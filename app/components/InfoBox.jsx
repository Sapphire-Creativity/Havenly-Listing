const InfoBox = ({ label, value }) => (
  <div className="p-4 rounded-xl border bg-white">
    <p className="text-xs text-gray-500">{label}</p>
    <p className="text-lg font-bold">{value}</p>
  </div>
);
