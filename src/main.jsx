import { ConfigProvider } from "antd";
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import vi_VN from "antd/lib/locale/vi_VN";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <ConfigProvider
      locale={vi_VN}
      theme={{
        token: {
          colorPrimary: "#00925e",
          borderRadius: 2,
          colorLink: "#00925e",
          colorLinkHover: "#50d8a7",  
        },
      }}
    >
      <App />
    </ConfigProvider>
  </BrowserRouter>
);
