const StatCard = ({ title, value }) => {
  return (
    <div className="bg-brand-800 p-4 rounded-xl shadow">
      <p className="text-accent-300 text-sm">{title}</p>
      <h2 className="text-5xl lg:text-7xl px-3 font-bold text-accent-500">{value}</h2>
    </div>
  );
};

export default StatCard;
