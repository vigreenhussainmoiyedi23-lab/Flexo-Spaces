// ================= RegisterPage.jsx =================
import React from "react";
import { RegisterForm } from "../components/forms/RegisterForm";
import Panel from "../components/ui/Panel";

export const RegisterPage = () => {
  const panelParams = {
    heading: "Join the sustainable fashion revolution",
    paragraph:
      "Create your free account and start swapping today. Reduce waste, save money, and discover unique fashion.",
  };
  return (
    <div className="min-h-screen flex">
      <div className="hidden md:flex w-2/5 bg-green-800 text-white flex-col justify-center">
        <Panel
          heading={panelParams.heading}
          paragragh={panelParams.paragraph}
        />
      </div>

      <div className="flex-1 relative flex items-center justify-center bg-brand-900">
        <div
          id="noise"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100%25' height='100%25'%3E%3Cfilter id='n' x='0' y='0'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.15'/%3E%3C/svg%3E")`,
          }}
          className="absolute z-0 w-full h-full"
        ></div>
        <RegisterForm />
      </div>
    </div>
  );
};
