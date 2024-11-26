import { useEffect, useState } from "react";
import { ref, get } from "firebase/database";
import { db } from "@/lib/firebase";
import Image from "next/image";
import { PhotoProvider, PhotoView } from "react-photo-view";
import "react-photo-view/dist/react-photo-view.css";

interface PredictedData {
  heartRate: number;
  temperature: number;
  humidity: number;
}

const AnalyticsContent = () => {
  const [images, setImages] = useState<{ [key: string]: string }>({});
  const [predictedData, setPredictedData] = useState<PredictedData[]>([]);

  useEffect(() => {
    const date = new Date();
    const monthYear = `${String(date.getMonth() + 1).padStart(
      2,
      "0"
    )}-${date.getFullYear()}`;

    const fetchData = async () => {
      const uidRef = ref(db, "uid");
      const uidSnapshot = await get(uidRef);
      if (uidSnapshot.exists()) {
        const userId = uidSnapshot.val();

        const metricsRef = ref(db, `graph/${userId}/${monthYear}`);
        const metricsSnapshot = await get(metricsRef);

        if (metricsSnapshot.exists()) {
          const data = metricsSnapshot.val();
          const imageData = {
            heartRate: data.heartRate?.image || "",
            humidity: data.humidity?.image || "",
            temperature: data.temperature?.image || "",
          };
          setImages(imageData);
        }

        const predictedDataRef = ref(
          db,
          `predictions/${userId}/${monthYear}/future_predictions`
        );
        const predictedDataSnapshot = await get(predictedDataRef);
        if (predictedDataSnapshot.exists()) {
          const predictedData = predictedDataSnapshot.val();
          setPredictedData(predictedData);
        }
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <PhotoProvider>
        <div className="grid grid-cols-1 gap-5 p-2">
          {Object.entries(images).map(([metric, base64], index) => (
            <div key={metric} className="w-full">
              <PhotoView src={base64}>
                <Image
                  id={index.toString()}
                  src={base64}
                  alt={`${metric} Graph`}
                  width={400}
                  height={300}
                  className="w-full h-auto rounded-lg shadow-lg cursor-pointer"
                />
              </PhotoView>
            </div>
          ))}
        </div>
      </PhotoProvider>
      {predictedData.length > 0 && (
        <div className="p-2 bg-white rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Predicted Data</h2>
          <div className="space-y-2">
            {predictedData.map((prediction, index) => (
              <div key={index} className="border-b pb-2 last:border-b-0">
                <div className="grid grid-cols-3 gap-3">
                  <div className="p-2 bg-gray-50 rounded-md">
                    <h4 className="text-xs font-medium text-gray-700">
                      Heart Rate
                    </h4>
                    <p className="text-md text-gray-800">
                      {prediction.heartRate} BPM
                    </p>
                  </div>
                  <div className="p-2 bg-gray-50 rounded-md">
                    <h4 className="text-xs font-medium text-gray-700">
                      Humidity
                    </h4>
                    <p className="text-md text-gray-800">
                      {prediction.humidity}%
                    </p>
                  </div>
                  <div className="p-2 bg-gray-50 rounded-md">
                    <h4 className="text-xs font-medium text-gray-700">
                      Temperature
                    </h4>
                    <p className="text-md text-gray-800">
                      {prediction.temperature}°C
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AnalyticsContent;
