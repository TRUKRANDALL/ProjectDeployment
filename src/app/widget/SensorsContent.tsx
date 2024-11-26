import { Data } from "@/types/data";
import { Heart, Droplet, Thermometer } from "lucide-react";

interface SensorsContentProps {
  data: Data;
}

const SensorsContent: React.FC<SensorsContentProps> = ({ data }) => {
  const { temperature, humidity, heartRate, date, time } = data;
  const datetime = `${date} ${time}`;
  const element = (
    value: string | number,
    label: string,
    unit: string,
    Icon: React.ElementType
  ) => {
    return (
      <div className="border-[1px] border-gray-200 py-4 rounded-lg mb-3">
        <h6 className="text-md text-gray-800 flex flex-col items-center gap-1 justify-center mb-4">
          <Icon className="w-10 h-10 text-white bg-orange-500 rounded-full p-2" />
          {label}
        </h6>
        <div className="flex flex-row justify-center items-center">
          <div className="flex flex-row justify-center items-center gap-2">
            <h1 className="text-5xl font-semibold text-gray-800">{value}</h1>
            <h6 className="text-sm flex items-end text-gray-500 w-4">{unit}</h6>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="px-4">
        <h6 className="text-sm text-center text-gray-500 mt-2 mb-6">
          {datetime}
        </h6>
        {element(temperature, "Temperature", "°C", Thermometer)}
        {element(humidity, "Humidity", "%", Droplet)}
        {element(heartRate, "Heart Rate", "bpm", Heart)}
      </div>
    </div>
  );
};

export default SensorsContent;
