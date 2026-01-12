import React, { useEffect } from "react";
import { Box, Text } from "@chakra-ui/react";
import { useSelector, useDispatch } from "react-redux";
import { getUserDetails } from "../../actions/userActions";
import TotalDetails from "./Totaldetails";
import AdminWallet from "./Adminwallet";
import Admincharts from "./Admincharts";
import AdminProduct from "./AdminProduct";
import AdminTopCustomers from "./AdminTopcustomers";

const AdminDashboard = () => {
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.userDetails);

  useEffect(() => {
    if (!user) {
      dispatch(getUserDetails("profile"));
    }
  }, [dispatch, user]);

  return (
    <Box mt={20} p="5">
      <Text fontWeight="lg" fontSize="lg">
        Welcome Admin..!
      </Text>

      <TotalDetails />

      {/* 🔒 Hide AdminWallet for sellers */}
      {user?.isSeller === false && <AdminWallet />}

      <Admincharts />
      <AdminTopCustomers />
      <AdminProduct />
    </Box>
  );
};

export default AdminDashboard;
