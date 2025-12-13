import React from "react";
import errorImage from "../assets/errorImage.webp";

const NotFoundPage = () => {
  return (
    <div style={{ textAlign: "center", marginTop: "120px" }}>
      <img
        src={errorImage}
        alt="404 Not Found"
        style={{
          display: "block",
          margin: "0 auto",
          maxWidth: "100%",
          height: "auto",
          width: "400px",
        }}
      />
      <h1>404 Page Not Found</h1>
    </div>
  );
};

export default NotFoundPage;
