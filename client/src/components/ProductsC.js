import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Listproductbyfiters } from "../actions/productActions";
import { useHistory, useLocation } from "react-router-dom";
import QuickPicks from "../pages/QuickPicks/QuickPicks";
import Slider from "./Slider";
import Cardscg from "./Cardscg";
import womenImg from "../assets/women.png";
import menImg from "../assets/men.png";
import "../pages/Home.css";
import Trust from "./Trustdetails/Trust";
import VideoBanner from "./UserVideoBanner/VideoBanner";
import OffersPage from "../pages/OffersPage/OffersPage";
import Bestselling from "../pages/Bestselling/Bestselling";
import Trendingbrand from "../pages/Trendingbrands/Trendingbrand";
import { useNavigate } from "react-router-dom";
import Tshirts from "./TopCategories/Tshirts";
import Pants from "./TopCategories/Pants";
import SweatPants from "./TopCategories/SweatPants";
import DiscountTag from "./DiscountTag.js";

const ProductsC = ({ match }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const searchParams = new URLSearchParams(location.search);
  const gender = searchParams.get("gender");
  const offerfilter = searchParams.get("offerfilter");
  const productList = useSelector((state) => state.productList);
  const { loading, error, products } = productList;
  const category = searchParams.get("category");
  const subcategory = searchParams.get("subcategory");

  const keyword = window.location.pathname.split("/")[2];
  useEffect(() => {
    dispatch(Listproductbyfiters({ gender, category, subcategory }));
  }, [dispatch, gender, subcategory]);

  return (
    <>
      <VideoBanner />
      {gender && <QuickPicks category={gender} />}
      <Slider />
      {gender && <OffersPage category={gender} />}
      {/* <Cardscg /> */}
      {gender && <Bestselling category={gender} />}
      {gender && <Trendingbrand category={gender} />}
      {gender && <Tshirts category={gender} subcategory={"Shirts"} />}
      {gender && <Pants category={gender} subcategory={"Jeans"} />}
      {gender && <SweatPants category={gender} subcategory={"SweatPants"} />}
      <Trust />
      <DiscountTag />
    </>
  );
};

export default ProductsC;
