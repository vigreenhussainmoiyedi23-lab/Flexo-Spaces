const StatCard = ({ title, value }) => {
  return (
    <div className="bg-text-primary text-white p-4 rounded-xl shadow">
      <p className="text-brand-100 text-sm">{title}</p>
      <h2 className="text-5xl lg:text-7xl px-3 font-bold text-white">{value}</h2>
    </div>
  );
};

export default StatCard;
