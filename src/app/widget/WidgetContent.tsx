"use client";

import { useState, useEffect } from "react";
import { LucideIcon } from "lucide-react";
import Map from "@/components/Map";
import { ref, onValue, off, DataSnapshot } from "firebase/database";
import { db } from "@/lib/firebase";
import DashboardContent from "./DashboardContent";
import ChangeUID from "@/components/ChangeUID";
import ShowUIDList from "@/components/ShowUIDList";
import SensorsContent from "./SensorsContent";
import ArchiveContent from "./ArchiveContent";
import AnalyticsContent from "./AnalyticsContent";
import ChangeNumber from "@/components/ChangeNumber";

interface WidgetContentProps {
  id: string;
  name: string;
  Icon: LucideIcon;
  activeUid: string | null;
}

interface LocationData {
  lat: number;
  lng: number;
}

interface FirebaseData {
  date: string;
  heartRate: number;
  humidity: number;
  latitude: number;
  longitude: number;
  temperature: number;
  time: string;
  geofence: string;
}

const WidgetContent: React.FC<WidgetContentProps> = ({
  id,
  name,
  Icon,
  activeUid,
}) => {
  const [data, setData] = useState<string | number | null | LocationData>(null);
  const [datetime, setDatetime] = useState<string>("");
  const [firebaseData, setFirebaseData] = useState<FirebaseData | null>(null);

  useEffect(() => {
    const latestRef = ref(db, `latest/${activeUid}`);

    const fetchData = (snapshot: DataSnapshot) => {
      const firebaseData: FirebaseData | null = snapshot.val();

      if (!firebaseData) {
        setDatetime("");
        setFirebaseData(null);
        setData("No data available");
        return;
      }

      setDatetime(`${firebaseData.date} ${firebaseData.time}`);
      setFirebaseData(firebaseData);

      switch (id) {
        case "temperature":
          setData(firebaseData.temperature.toFixed(1) + "°");
          break;
        case "humidity":
          setData(firebaseData.humidity.toFixed(1) + "%");
          break;
        case "heart-beat":
          setData(firebaseData.heartRate + " bpm");
          break;
        case "location":
          setData({ lat: firebaseData.latitude, lng: firebaseData.longitude });
          break;
        case "id":
          setData(Math.floor(1000 + Math.random() * 9000));
          break;
        case "help":
          setData("Contact support at support@example.com");
          break;
        default:
          setData("No data available");
      }
    };

    onValue(latestRef, fetchData);

    return () => {
      off(latestRef, "value", fetchData);
    };
  }, [id, activeUid]);

  const renderContent = () => {
    if (data === null) {
      return <p className="text-gray-500">Loading data...</p>;
    }

    if (id === "location" && typeof data === "object") {
      return (
        <Map
          lat={data.lat}
          lng={data.lng}
          geofence={firebaseData?.geofence || ""}
        />
      );
    }

    if (id === "dashboard" && firebaseData) {
      return <DashboardContent data={firebaseData} />;
    }

    if (id === "help") {
      return (
        <p className="text-2xl mb-4 font-semibold text-gray-800">
          {data as string}
        </p>
      );
    }

    if (id === "id") {
      return (
        <>
          <ShowUIDList />
          <ChangeUID />
          <ChangeNumber />
        </>
      );
    }

    if (id === "analytics") {
      return <AnalyticsContent />;
    }

    if (id === "sensors" && firebaseData) {
      return <SensorsContent data={firebaseData} />;
    }

    if (id === "archive") {
      return <ArchiveContent />;
    }

    return (
      <p className="text-6xl mb-4 font-semibold text-gray-800">
        {data as string}
      </p>
    );
  };

  return (
    <div className="w-full max-w-md mt-20">
      <div>
        <h6 className="text-sm text-end text-gray-500 mb-2">{datetime}</h6>
      </div>
      <div className="border-[1px] border-gray-200 bg-white rounded-xl p-8 pb-4 px-4">
        <div className="flex gap-3 items-center justify-center mb-5 text-orange-500">
          <Icon className="w-8 h-8 text-white bg-orange-500 rounded-full p-2" />
          <h1 className="text-2xl font-bold">{name}</h1>
        </div>
        <div className="text-center">{renderContent()}</div>
      </div>
    </div>
  );
};

export default WidgetContent;
