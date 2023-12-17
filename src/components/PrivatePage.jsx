import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const PrivatePage = ({ page: Page }) => {
  const navigate = useNavigate();

  if (localStorage.getItem("token")) {
    return Page;
  } else {
    useEffect(() => {
      navigate("/login")
    }, [])
    return <></>;
  }
};

export default PrivatePage;
