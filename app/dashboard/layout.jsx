"use client";
import React, { useEffect } from "react";
import Header from "./_components/Header";
import { createContext, useState } from "react";
export const WebCamContext = createContext();

const DashboardLayout = ({ children }) => {
  const [webCamEnabled, setWebCamEnabled] = useState(false);

  useEffect(() => {
    const storedState = window.sessionStorage.getItem("dashboard-webcam-enabled");
    if (storedState === "true") {
      setWebCamEnabled(true);
    }
  }, []);

  useEffect(() => {
    window.sessionStorage.setItem(
      "dashboard-webcam-enabled",
      webCamEnabled ? "true" : "false"
    );
  }, [webCamEnabled]);

  return (
    <div>
        <Header />
        <div className="">
          <WebCamContext.Provider value={{ webCamEnabled, setWebCamEnabled }}>
            {children}
          </WebCamContext.Provider>
        </div>
    </div>
  );
};

export default DashboardLayout;
