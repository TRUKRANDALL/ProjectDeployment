import Map from "@/components/Map";
import { Data } from "@/types/data";

interface DashboardContentProps {
  data: Data;
}

const DashboardContent: React.FC<DashboardContentProps> = ({ data }) => {
  const { temperature, humidity, heartRate, latitude, longitude, geofence } =
    data;
  const element = (value: string | number, label: string, unit: string) => {
    return (
      <div className="flex flex-row justify-between items-center border-[1px] border-gray-200 py-2 rounded-lg mb-3 px-4">
        <h6 className="text-sm text-gray-500">{label}</h6>
        <div className="flex flex-row justify-center items-center gap-2">
          <h1 className="text-4xl font-semibold text-gray-800">{value}</h1>
          <h6 className="text-sm flex items-end text-gray-500 w-4">{unit}</h6>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-4">
      <div>
        {element(temperature, "Temperature", "°C")}
        {element(humidity, "Humidity", "%")}
        {element(heartRate, "Heart Rate", "bpm")}
      </div>
      <Map lat={latitude || 0} lng={longitude || 0} geofence={geofence || ""} />
    </div>
  );
};

export default DashboardContent;
