import React, { useEffect, useState } from "react";
import { IoIosArrowForward, IoIosArrowBack } from "react-icons/io";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { listBanners } from "../actions/bannerActions";
import ShopNowBtn from "./ShopNowBtn";
import { useLocation } from "react-router-dom";

const Slider = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const genderParam = searchParams.get("gender"); // Get gender from URL query params
  // Convert to lowercase for case-insensitive matching
  const gender =
    genderParam?.toLowerCase() === "men"
      ? "male"
      : genderParam?.toLowerCase() === "women"
      ? "female"
      : null;

  const bannerList = useSelector((state) => state.bannerList);
  const { loading, error, banners } = bannerList;
  const [current, setCurrent] = useState(0);
  const [auto, setAuto] = useState(true);
  const intervalTime = 6000;
  let slideInterval;

  // Filter banners based on gender
  const filteredBanners = banners?.filter(
    (banner) => !gender || banner.gender.toLowerCase() === gender.toLowerCase()
  );

  const length = filteredBanners?.length || 0;

  const nextSlide = () => {
    setCurrent(current === length - 1 ? 0 : current + 1);
  };

  const prevSlide = () => {
    setCurrent(current === 0 ? length - 1 : current - 1);
  };

  useEffect(() => {
    dispatch(listBanners());
  }, [dispatch]);

  useEffect(() => {
    setAuto(true);
    if (auto) {
      slideInterval = setInterval(nextSlide, intervalTime);
    }
    return () => {
      setAuto(false);
      clearInterval(slideInterval);
    };
  }, [auto, current]);

  if (loading) return <p>Loading banners...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!filteredBanners.length)
    return <p>No banners available for {gender || "all"}.</p>;

  return (
    <div className="slider">
      {filteredBanners.map((banner, index) => (
        <div
          key={banner._id}
          className={index === current ? "slide current" : "slide"}
          style={{
            background: `url(${banner.image}) no-repeat center top/cover`,
          }}
        >
          <h1 className="titleslider">{banner.title}</h1>
          <h3 className="subtitleslider">{banner.subtitle}</h3>

          <div className="content">
            <Link to="/products/">
              <ShopNowBtn />
            </Link>
          </div>
        </div>
      ))}
      <IoIosArrowForward className="next" size="32" onClick={nextSlide} />
      <IoIosArrowBack className="prev" size="32" onClick={prevSlide} />
    </div>
  );
};

export default Slider;
