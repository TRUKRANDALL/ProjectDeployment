"use client";

import React, { useState, useEffect, useCallback } from "react";
import { ref, query, orderByKey, get, getDatabase } from "firebase/database";
import { getApp } from "firebase/app";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import Loader from "@/components/Loader";
import { DataTable } from "@/components/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import { exportToExcel } from "@/lib/exportToExcel";
import { Data as DataItem } from "@/types/data";

const ArchiveContent: React.FC = () => {
  const [data, setData] = useState<DataItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [displayDate, setDisplayDate] = useState<string>(
    format(new Date(), "MM-dd-yyyy")
  );
  const [isFullDate, setIsFullDate] = useState(true);
  const [calendarOpen, setCalendarOpen] = useState(false);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const app = getApp();
      const database = getDatabase(app);

      const activeUIDRef = ref(database, "uid");
      const snap = await get(activeUIDRef);
      const activeUID = snap.val();

      const monthYear = format(selectedDate, "MM-yyyy");
      const dataRef = ref(database, `${activeUID}/${monthYear}`);

      const dataQuery = query(dataRef, orderByKey());
      const snapshot = await get(dataQuery);

      if (snapshot.exists()) {
        const fetchedData: DataItem[] = [];
        snapshot.forEach((childSnapshot) => {
          const childData = childSnapshot.val() as DataItem;
          if (
            !isFullDate ||
            childData.date === format(selectedDate, "MM-dd-yyyy")
          ) {
            fetchedData.push(childData);
          }
        });

        setData(fetchedData.reverse());
      } else {
        setData([]);
      }
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Failed to fetch data. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, [selectedDate, isFullDate]);

  useEffect(() => {
    loadData();
  }, [loadData, isFullDate, selectedDate]);

  const handleSelect = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date);
      setDisplayDate(
        isFullDate ? format(date, "MM-dd-yyyy") : format(date, "MM-yyyy")
      );
      setCalendarOpen(false);
    }
  };

  const toggleDateFormat = () => {
    setIsFullDate((prev) => !prev);
    setDisplayDate(
      isFullDate
        ? format(selectedDate, "MM-yyyy")
        : format(selectedDate, "MM-dd-yyyy")
    );
  };

  const handleExport = () => {
    if (data.length === 0) return;

    const filename = isFullDate
      ? `data_${format(selectedDate, "MM-dd-yyyy")}`
      : `data_${format(selectedDate, "MM-yyyy")}`;

    exportToExcel(data, filename);
  };

  const columns: ColumnDef<DataItem>[] = [
    {
      accessorKey: "date",
      header: "Date",
      cell: ({ row }) => <div>{row.getValue("date")}</div>,
    },
    {
      accessorKey: "time",
      header: "Time",
      cell: ({ row }) => <div>{row.getValue("time")}</div>,
    },
    {
      accessorKey: "temperature",
      header: "Temperature",
      cell: ({ row }) => <div>{row.getValue("temperature")}</div>,
    },
    {
      accessorKey: "humidity",
      header: "Humidity",
      cell: ({ row }) => <div>{row.getValue("humidity")}</div>,
    },
    {
      accessorKey: "heartRate",
      header: "Heart Rate",
      cell: ({ row }) => <div>{row.getValue("heartRate")}</div>,
    },
  ];

  return (
    <div className="container mt-5">
      <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
        <PopoverTrigger asChild>
          <Button
            variant={"outline"}
            className={cn(
              "w-full bg-white rounded-lg justify-start text-left font-normal",
              !displayDate && "text-muted-foreground"
            )}
            onClick={() => setCalendarOpen(true)}>
            <CalendarIcon className="mr-2 h-4 w-4" />
            {displayDate ? displayDate : <span>Pick a date</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent align="start" className="w-auto p-0">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={handleSelect}
            defaultMonth={selectedDate}
          />
        </PopoverContent>
      </Popover>
      <div className="flex flex-row gap-4 my-4">
        <Button
          onClick={toggleDateFormat}
          className="w-full rounded-lg bg-orange-500 text-white hover:bg-orange-600 hover:text-white"
          variant="outline">
          {isFullDate ? "Switch Month-Year" : "Switch Full Date"}
        </Button>
        <Button
          onClick={handleExport}
          className="w-full rounded-lg bg-green-500 text-white hover:bg-green-600 hover:text-white"
          variant="outline"
          disabled={data.length === 0}>
          Export
        </Button>
      </div>
      {loading ? (
        <Loader />
      ) : error ? (
        <div className="text-red-500 text-center">{error}</div>
      ) : data.length === 0 ? (
        <div className="text-center text-gray-500 py-10 border border-gray-200 rounded-lg">
          No data available for the selected date.
        </div>
      ) : (
        <DataTable columns={columns} data={data} />
      )}
    </div>
  );
};

export default ArchiveContent;
