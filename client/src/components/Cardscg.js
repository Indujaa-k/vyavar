import React from "react";
import { Link } from "react-router-dom";
import boyimage from "../assets/boy.jpg";
import girlimage from "../assets/girl.jpg";

const Cardscg = () => {
  return (
    <div style={{ display: "flex", gap: "20px", margin: "50px" }}>
      {/* Boy Card */}
      <Link to="/?gender=Men" style={{ textAlign: "center" }}>
        <img
          src={boyimage}
          alt="Boy"
          style={{ width: "100%", height: "100%" }}
        />
        <h2>BOY</h2>
      </Link>

      {/* Girl Card */}
      <Link to="/?gender=Women" style={{ textAlign: "center" }}>
        <img
          src={girlimage}
          alt="Girl"
          style={{ width: "100%", height: "100%" }}
        />
        <h2>GIRL</h2>
      </Link>
    </div>
  );
};

export default Cardscg;
