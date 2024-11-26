"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Widget from "./Widget";
import {
  LayoutDashboard,
  Heart,
  MapPin,
  IdCard,
  HelpCircle,
  LogOut,
  Archive,
  BarChart,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import Loader from "@/components/Loader";

function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [animatedWidgets, setAnimatedWidgets] = useState(0);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/sign-in");
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      const interval = setInterval(() => {
        setAnimatedWidgets((prev) => {
          if (prev < 8) return prev + 1;
          clearInterval(interval);
          return prev;
        });
      }, 100);

      return () => clearInterval(interval);
    }
  }, [user]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push("/sign-in");
    } catch (error) {
      console.error("Failed to log out", error);
    }
  };

  if (loading) {
    return <Loader />;
  }

  if (!user) {
    return null;
  }

  return (
    <div className="bg-gray-100 flex flex-col h-screen justify-center items-center">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-1">
        {[
          {
            name: "Dashboard",
            id: "dashboard",
            Icon: LayoutDashboard,
            description: "Monitor cattle",
          },
          {
            name: "Sensors",
            id: "sensors",
            Icon: Heart,
            description: "Sensor data",
          },
          {
            name: "Location",
            id: "location",
            Icon: MapPin,
            description: "View your location",
          },
          { name: "ID", id: "id", Icon: IdCard, description: "View your ID" },
          {
            name: "Archive",
            id: "archive",
            Icon: Archive,
            description: "View your archive",
          },
          {
            name: "Analytics",
            id: "analytics",
            Icon: BarChart,
            description: "Predictive Analytics",
          },
          {
            name: "Help",
            id: "help",
            Icon: HelpCircle,
            description: "View your help",
          },
          {
            name: "Logout",
            id: "logout",
            Icon: LogOut,
            description: "Logout from your account",
            onClick: handleLogout,
          },
        ].map((widget, index) => (
          <div
            key={widget.id}
            className={`transition-all duration-300 ${
              index < animatedWidgets
                ? "scale-100 opacity-100 hover:z-10"
                : "scale-0 opacity-0"
            }`}
          >
            <Widget {...widget} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default DashboardPage;
