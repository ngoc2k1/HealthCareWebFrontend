import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const PrivatePage = ({ page: Page }) => {//check login
  const navigate = useNavigate();

  if (localStorage.getItem("token")) {//đã login -> có token
    return Page;
  } else {
    useEffect(() => {//chưa login
      navigate("/login")
    }, [])
    return <></>;
  }
};

export default PrivatePage;
