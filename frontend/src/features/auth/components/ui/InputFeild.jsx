const InputFeild = ({
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  img,
}) => {
  return (
    <div className="   relative w-full">
      <label className="text-sm text-gray-700">{label}</label>
      <div>
        {Array.isArray(img) &&
          img.map((i) => (
            <img
              src={i.src}
              alt=""
              className={i.className}
              onClick={i.clickHandler}
            />
          ))}
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className="w-full border border-sec rounded-lg px-4 py-2 focus:outline-none  focus:bg-blue-50"
        />
      </div>
    </div>
  );
};

export default InputFeild;
