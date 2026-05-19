import  { useState } from "react";
import InputField from "./InputFeild";
const Password = ({form,setForm}) => {
  const [passwordHidden, setPasswordHidden] = useState(true);
  const passwordImages = [
    {
      src: "/svg/eye.png",
      className: `w-5 h-5 absolute top-1/2 right-2 ${
        !passwordHidden ? "hidden" : ""
      }`,
      clickHandler: function (e) {
        setPasswordHidden((prev) => !prev);
      },
    },
    {
      src: "/svg/images.png",
      clickHandler: function (e) {
        setPasswordHidden((prev) => !prev);
      },
      className: `w-5 h-5 absolute top-1/2 right-2 ${
        passwordHidden ? "hidden" : ""
      }`,
    },
  ];
  return (
    <InputField
      label="Password"
      type={passwordHidden ? "password" : "text"}
      placeholder="Enter your password"
      value={form.password}
      onChange={(e) => setForm({ ...form, password: e.target.value })}
      img={passwordImages}
    />
  );
};

export default Password;
