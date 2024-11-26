"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { ref, get, getDatabase } from "firebase/database";
import WidgetContent from "./WidgetContent";
import {
  LayoutDashboard,
  Thermometer,
  Droplet,
  Heart,
  MapPin,
  IdCard,
  HelpCircle,
  ArrowLeft,
  LucideIcon,
  Archive,
  BarChart,
} from "lucide-react";
import Loader from "@/components/Loader";
import { Suspense } from "react";

const iconMap: { [key: string]: LucideIcon } = {
  dashboard: LayoutDashboard,
  temperature: Thermometer,
  humidity: Droplet,
  "heart-beat": Heart,
  sensors: Heart,
  archive: Archive,
  location: MapPin,
  analytics: BarChart,
  id: IdCard,
  help: HelpCircle,
};

function WidgetParams() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeUid, setActiveUid] = useState<string | null>(null);
  const [loadingUid, setLoadingUid] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/sign-in");
    }
  }, [user, loading, router]);

  useEffect(() => {
    const fetchActiveUid = async () => {
      if (!user) return;

      const db = getDatabase();
      const uidRef = ref(db, "uid");
      try {
        const snapshot = await get(uidRef);
        if (snapshot.exists()) {
          setActiveUid(snapshot.val());
        }
      } catch (error) {
        console.error("Error fetching active UID:", error);
      } finally {
        setLoadingUid(false);
      }
    };

    fetchActiveUid();
  }, [user]);

  const id = searchParams.get("id") || "";
  const name = searchParams.get("name") || "";
  const Icon = iconMap[id] || LayoutDashboard;

  if (loading || loadingUid) {
    return <Loader />;
  }

  if (!user) {
    return null;
  }

  return (
    <div className="bg-gray-100">
      <div className="w-full lg:max-w-5xl lg:mx-auto">
        <div className="min-h-screen flex flex-col items-center p-6 relative">
          <button
            onClick={() => router.push("/dashboard")}
            className="text-sm absolute top-4 left-4 flex items-center space-x-2 bg-white text-gray-800 px-5 py-3 ml-2 mt-5 rounded-md shadow-sm hover:bg-gray-50 transition-colors">
            <ArrowLeft size={20} />
            <span>Back</span>
          </button>
          <WidgetContent
            id={id}
            name={name}
            Icon={Icon}
            activeUid={activeUid}
          />
        </div>
      </div>
    </div>
  );
}

function WidgetPage() {
  return (
    <Suspense fallback={<Loader />}>
      <WidgetParams />
    </Suspense>
  );
}

export default WidgetPage;
