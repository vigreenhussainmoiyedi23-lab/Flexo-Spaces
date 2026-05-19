// /admin/components/TimeFilter.jsx

export default function TimeFilter({ selected, setSelected }) {
  const options = [7, 14, 28];

  return (
    <div className="flex gap-2 mb-6">
      {options.map((opt) => (
        <button
          key={opt}
          onClick={() => setSelected(opt)}
          className={`px-3 py-1 rounded source-code-pro ${
            selected === opt
              ? "bg-accent-500 text-brand-900"
              : "bg-brand-700 text-white"
          }`}
        >
          {opt} Days
        </button>
      ))}
    </div>
  );
}