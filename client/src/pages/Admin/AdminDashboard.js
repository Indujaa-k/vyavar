import React from "react";
import { Box, Text } from "@chakra-ui/react";
import TotalDetails from "./Totaldetails";
import AdminWallet from "./Adminwallet";
import Admincharts from "./Admincharts";
import AdminProduct from "./AdminProduct";
import AdminTopCustomers from "./AdminTopcustomers";

const AdminDashboard = () => {
  return (
    <Box mt={20} p="5">
      <Text alignItems="center" fontWeight="lg" fontSize={"lg"}>
        Welcome Admin..!
      </Text>
      <TotalDetails />
      <AdminWallet />
      <Admincharts />
      <AdminTopCustomers />
      <AdminProduct />
    </Box>
  );
};

export default AdminDashboard;
