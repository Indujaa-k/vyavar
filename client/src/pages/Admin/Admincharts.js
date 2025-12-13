import React from "react";
import UsersPieChart from "../../pages/Userslist/UsersPieChart";
import Saleschart from "./Saleschart";

const Admincharts = () => {
  return (
    <div>
      <UsersPieChart />
      <Saleschart />
    </div>
  );
};

export default Admincharts;
