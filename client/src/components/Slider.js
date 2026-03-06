import React, { useEffect, useState } from "react";
import { IoIosArrowForward, IoIosArrowBack } from "react-icons/io";
import { Link, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { listBanners } from "../actions/bannerActions";
import ShopNowBtn from "./ShopNowBtn";
import "./Slider.css";

const Slider = () => {
  const dispatch = useDispatch();
  const location = useLocation();

  const searchParams = new URLSearchParams(location.search);
  const genderParam = searchParams.get("gender");

  const gender =
    genderParam?.toLowerCase() === "men"
      ? "male"
      : genderParam?.toLowerCase() === "women"
        ? "female"
        : null;

  const bannerList = useSelector((state) => state.bannerList);
  const { loading, error, banners } = bannerList;

  const [current, setCurrent] = useState(0);

  const intervalTime = 6000;
  const API_URL = process.env.REACT_APP_API_URL;

  const filteredBanners =
    banners?.filter(
      (banner) =>
        banner?.image &&
        banner?.title &&
        (!gender || banner.gender?.toLowerCase() === gender.toLowerCase()),
    ) || [];

  const length = filteredBanners.length;

  const nextSlide = () => {
    setCurrent((prev) => (prev === length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrent((prev) => (prev === 0 ? length - 1 : prev - 1));
  };

  useEffect(() => {
    dispatch(listBanners());
  }, [dispatch]);

  useEffect(() => {
    if (length <= 1) return;

    const slideInterval = setInterval(() => {
      nextSlide();
    }, intervalTime);

    return () => clearInterval(slideInterval);
  }, [length]);

  if (loading) return <p>Loading banners...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!length) return null;

  return (
    <div className="slider">
      {filteredBanners.map((banner, index) => (
        <div
          key={banner._id}
          className={index === current ? "slide current" : "slide"}
          style={{
            backgroundImage: `url(${API_URL}${banner.image})`,
          }}
        >
          <div className="slide-overlay" />

          {index === current && (
            <div className="slide-content">
              <div className="titleslider">{banner.title}</div>
              <div className="subtitleslider">{banner.subtitle}</div>

              <div className="content">
                <Link to="/products/">
                  <ShopNowBtn className="shop-now-btn" />
                </Link>
              </div>
            </div>
          )}
        </div>
      ))}

      {length > 1 && (
        <>
          <IoIosArrowForward className="next" size="32" onClick={nextSlide} />
          <IoIosArrowBack className="prev" size="32" onClick={prevSlide} />
        </>
      )}
    </div>
  );
};

export default Slider;
