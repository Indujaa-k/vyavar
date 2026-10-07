import React, { useEffect, useState } from "react";
import { IoIosArrowForward, IoIosArrowBack } from "react-icons/io";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { listBanners } from "../actions/bannerActions";
import "./Slider.css";

const API_URL = process.env.REACT_APP_API_URL;

const BUTTON_POSITIONS = {
  "top-left": { top: "16px", left: "24px" },
  "top-center": { top: "16px", left: "50%", transform: "translateX(-50%)" },
  "top-right": { top: "16px", right: "24px" },
  center: { top: "50%", left: "50%", transform: "translate(-50%, -50%)" },
  "bottom-left": { bottom: "24px", left: "24px" },
  "bottom-center": { bottom: "24px", left: "50%", transform: "translateX(-50%)" },
  "bottom-right": { bottom: "24px", right: "24px" },
};

const Slider = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
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

  const filteredBanners =
    banners?.filter(
      (banner) =>
        banner?.image &&
        (!gender || banner.gender?.toLowerCase() === gender.toLowerCase()),
    ) || [];

  const length = filteredBanners.length;

  const nextSlide = () =>
    setCurrent((prev) => (prev >= length - 1 ? 0 : prev + 1));
  const prevSlide = () =>
    setCurrent((prev) => (prev <= 0 ? length - 1 : prev - 1));

  useEffect(() => {
    dispatch(listBanners());
  }, [dispatch]);

  useEffect(() => {
    if (current >= length) setCurrent(0);
  }, [length, current]);

  useEffect(() => {
    if (length <= 1) return;
    const slideInterval = setInterval(() => {
      setCurrent((prev) => (prev >= length - 1 ? 0 : prev + 1));
    }, intervalTime);
    return () => clearInterval(slideInterval);
  }, [length]);

  if (loading) return <p>Loading banners...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!length) return null;

  return (
    <div className="slider">
      {filteredBanners.map((banner, index) => {
        const hasText = !!(banner.title?.trim() || banner.subtitle?.trim());
        const target = banner.linkUrl || `/product/${banner.productId}`;
        const isCurrent = index === current;

        return (
          <div
            key={banner._id}
            className={isCurrent ? "slide current" : "slide"}
            onClick={() => isCurrent && navigate(target)}
          >
            <picture>
              {banner.imageMobile && (
                <source
                  media="(max-width: 768px)"
                  srcSet={`${API_URL}${banner.imageMobile}`}
                />
              )}
              {banner.imageTablet && (
                <source
                  media="(max-width: 1024px)"
                  srcSet={`${API_URL}${banner.imageTablet}`}
                />
              )}
              <img
                className="slide-img"
                src={`${API_URL}${banner.image}`}
                alt={banner.title || "Banner"}
              />
            </picture>

            {hasText && <div className="slide-overlay" />}

            {hasText && (
              <div className="slide-content">
                {banner.title?.trim() && (
                  <div
                    className="titleslider"
                    style={{
                      fontFamily: banner.fontFamily || undefined,
                      fontSize: banner.fontSize || undefined,
                      color: banner.fontColor || undefined,
                    }}
                  >
                    {banner.title}
                  </div>
                )}
                {banner.subtitle?.trim() && (
                  <div
                    className="subtitleslider"
                    style={{
                      fontFamily: banner.fontFamily || undefined,
                      color: banner.fontColor || undefined,
                    }}
                  >
                    {banner.subtitle}
                  </div>
                )}
              </div>
            )}

            {banner.buttonText?.trim() && (
              <button
                type="button"
                className="shop-now-btn"
                style={
                  BUTTON_POSITIONS[banner.buttonPosition] ||
                  BUTTON_POSITIONS["bottom-left"]
                }
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(target);
                }}
              >
                {banner.buttonText}
              </button>
            )}
          </div>
        );
      })}

      {length > 1 && (
        <>
          <IoIosArrowForward
            className="next"
            size="32"
            onClick={(e) => {
              e.stopPropagation();
              nextSlide();
            }}
          />
          <IoIosArrowBack
            className="prev"
            size="32"
            onClick={(e) => {
              e.stopPropagation();
              prevSlide();
            }}
          />
        </>
      )}
    </div>
  );
};

export default Slider;