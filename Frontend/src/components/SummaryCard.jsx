const SummaryCard = ({ label, value, color }) => {
  return (
    <div className={`p-4 rounded shadow-md w-40 text-white ${color}`}>
      <div className="text-sm font-medium">{label}</div>
      <div className="text-lg font-bold">{value.toLocaleString("en-IN")}</div>
    </div>
  );
};

export default SummaryCard;
