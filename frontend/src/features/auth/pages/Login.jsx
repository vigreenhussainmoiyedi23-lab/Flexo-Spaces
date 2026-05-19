// ================= LoginPage.jsx =================
import React from "react";
import { LoginForm } from "../components/forms/LoginForm";
import Panel from "../components/ui/Panel";

export const LoginPage = () => {

  const panelParams = {
    heading: "Refresh your wardrobe without spending a dime",
    paragraph: "Join the sustainable fashion movement. Swap clothes you no longer wear and discover pieces you'll love.",
  };
  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex w-1/2 lg:w-2/5 text-white  flex-col justify-center ">
        <Panel heading={panelParams.heading} paragragh={panelParams.paragraph}/>
      </div>

      <div className="flex-1 relative px-2  bg-brand-900 flex items-center justify-center bg-tri">
        <div
          id="noise"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100%25' height='100%25'%3E%3Cfilter id='n' x='0' y='0'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.15'/%3E%3C/svg%3E")`,
          }}
          className="absolute z-0 w-full h-full"
        ></div>
        <LoginForm />
      </div>
    </div>
  );
};
