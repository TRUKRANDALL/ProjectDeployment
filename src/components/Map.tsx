function Map({
  lat,
  lng,
  geofence,
}: {
  lat: number;
  lng: number;
  geofence: string;
}) {
  const encodedLocation = encodeURIComponent(`${lat},${lng}`);
  const mapSrc = `https://maps.google.com/maps?width=100%25&height=600&hl=en&q=${encodedLocation}&t=&z=17&ie=UTF8&iwloc=B&output=embed`;

  return (
    <div className="flex flex-col gap-4">
      <div className="w-full h-[500px] bg-gray-200 rounded-lg">
        <div className="flex items-center justify-center w-full h-full text-gray-600">
          <div style={{ width: "100%", height: "100%" }}>
            <iframe
              className="rounded-md"
              width="100%"
              height="100%"
              src={mapSrc}></iframe>
          </div>
        </div>
      </div>

      <div className="flex flex-row justify-between items-center border-[1px] border-gray-200 py-2 rounded-lg mb-3 px-4">
        <h6 className="text-xs text-gray-500">GEOFENCE</h6>
        <h6
          className={`text-md font-bold ${
            geofence === "safe" ? "text-green-500" : "text-red-500"
          }`}>
          {geofence}
        </h6>
      </div>
    </div>
  );
}

export default Map;
