// ================= LoginForm.jsx =================
import React, { useState } from "react";
import { Button } from "../ui/Button";
import { Divider } from "../ui/Divider";
import  SocialButton  from "../ui/SocialButton";
import InputField from "../ui/InputFeild";
import { Link, useNavigate } from "react-router-dom";
import Password from "../ui/Password";
import useAuth from "../../hooks/useAuth";
import { AuthContext } from "../../auth.context";
import { useContext } from "react";

export const LoginForm = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState(null);
  const { loginHandler } = useAuth();
  const { loading } = useContext(AuthContext);
  const navigate = useNavigate();

  const SubmitHandler = async (e) => {
    setError(null);
    try {
      const response = await loginHandler({
        email: form.email,
        password: form.password,
      });
      navigate("/verify-otp");
    } catch (error) {
      console.log(error);
      setError(error.message);
    }
  };
  return (
    <div className="bg-white p-8 rounded-2xl relative z-9 shadow-lg w-full max-w-md flex flex-col gap-4">
      <h2 className="text-3xl font-serif text-center">Welcome Back</h2>
      <p className="text-center text-gray-500">Log in to continue swapping</p>

      <SocialButton />
      <Divider />
      <InputField
        label="Email"
        placeholder="Enter your email"
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
      />
      <Password form={form} setForm={setForm} />

      {loading ? (
        <Button>Loading...</Button>
      ) : (
        <Button submitHandler={SubmitHandler}>Start Swapping</Button>
      )}
      <p className="error text-red-500">{error ? `⚠️ ${error}` : ""}</p>
      <p className="text-sm text-center">
        Don't have an account?{" "}
        <Link to={"/register"} className="text-green-700">
          Register
        </Link>
      </p>
    </div>
  );
};
