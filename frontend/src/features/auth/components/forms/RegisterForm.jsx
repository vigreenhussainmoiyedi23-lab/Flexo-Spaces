// ================= RegisterForm.jsx =================
import React, { useState } from "react";
import InputField from "../ui/InputFeild";
import { Button } from "../ui/Button";
import { Divider } from "../ui/Divider";
import SocialButton from "../ui/SocialButton";
import { Link, useNavigate } from "react-router-dom";
import Password from "../ui/Password";
import { useContext } from "react";
import { AuthContext } from "../../auth.context";
import useAuth from "../../hooks/useAuth";

export const RegisterForm = () => {
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const { loading } = useContext(AuthContext);
  const { registerHandler } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const SubmitHandler = async (e) => {
    e.preventDefault();
    try {
      const response = await registerHandler(form);
      navigate("/verify-otp");
    } catch (error) {
      setError(error.message);
    }
  };
  return (
    <div className="bg-gray-50 z-10 p-8 rounded-2xl shadow-lg w-full max-w-md flex flex-col gap-4">
      <h2 className="text-3xl font-serif text-center">Join SwapStyle</h2>
      <p className="text-center text-gray-500">
        Swap clothes. Save money. Save the planet.
      </p>

      <SocialButton />
      <Divider />

      <InputField
        label="Username"
        placeholder="Enter your username"
        value={form.username}
        onChange={(e) => setForm({ ...form, username: e.target.value })}
      />

      <InputField
        label="Email"
        placeholder="Enter your email"
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
      />

      <Password form={form} setForm={setForm} />
      <p className="text-red-600 text-center">{error ? `⚠️ ${error}` : ""}</p>
      {loading ? (
        <Button>Creating Free account...</Button>
      ) : (
        <Button submitHandler={SubmitHandler}>Create Free Account</Button>
      )}

      <p className="text-sm text-center">
        Already have an account?{" "}
        <Link to={"/login"} className="text-green-700">
          Login
        </Link>
      </p>
    </div>
  );
};
