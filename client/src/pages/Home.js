import React from "react";
import ProductsC from "../components/ProductsC";
import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./Home.css";

const Home = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const gender = searchParams.get("gender");
  useEffect(() => {
    if (!gender) {
      navigate("/?gender=Men", { replace: true });
    }
  }, [navigate, location]);
  return (
    <div>
      <ProductsC />
    </div>
  );
};

export default Home;
