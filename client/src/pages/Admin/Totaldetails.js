import React, { useEffect, useState } from "react";
import {
  Box,
  SimpleGrid,
  Text,
  Icon,
  Flex,
  Select,
  Spinner,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FaClipboardList, FaUsers, FaBoxOpen } from "react-icons/fa";
import { MdPendingActions, MdLocalShipping, MdCancel } from "react-icons/md";
import { AiOutlineDeliveredProcedure, AiOutlineRollback } from "react-icons/ai";
import { GiCardboardBox } from "react-icons/gi";
import { ImCross } from "react-icons/im";
import { getTotalOrders } from "../../actions/dashboardActions";
import { getOrderStatusCounts } from "../../actions/orderActions";
import { ListUsers } from "../../actions/userActions";
import { listProducts } from "../../actions/productActions";

const AnalyticsCard = ({ title, value, icon, isLoading, onClick }) => (
  <Box
    p={4}
    bg="white"
    borderRadius="md"
    boxShadow="sm"
    textAlign="center"
    cursor="pointer"
    _hover={{ bg: "green.200" }}
    onClick={onClick}
  >
    <Icon as={icon} w={8} h={8} mb={2} color="gray.600" />
    <Text fontSize="sm" fontWeight="bold" color="gray.600">
      {title}
    </Text>
    <Text fontSize="2xl" fontWeight="bold">
      {isLoading ? <Spinner size="sm" /> : value}
    </Text>
  </Box>
);

const StatusCard = ({ label, count, icon, color, onClick }) => (
  <Flex
    bg="white"
    p={4}
    borderRadius="md"
    boxShadow="sm"
    alignItems="center"
    justifyContent="space-between"
    cursor="pointer"
    _hover={{ bg: "green.200" }}
    onClick={onClick}
  >
    <Flex alignItems="center">
      <Icon as={icon} w={5} h={5} color={color} mr={2} />
      <Text fontSize="sm" fontWeight="medium">
        {label}
      </Text>
    </Flex>
    <Text fontSize="md" fontWeight="bold" color={color}>
      {count !== undefined ? count : <Spinner size="xs" />}
    </Text>
  </Flex>
);

const TotalDetails = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [filter, setFilter] = useState("Overall");
  const { totalOrders, loading: loadingOrders } = useSelector(
    (state) => state.totalOrders
  );
  const userList = useSelector((state) => state.userList) || {};
  const { users = [], loading: loadingUsers } = userList;

  const productList = useSelector((state) => state.productList) || {};
  const { products = [], loading: loadingProducts } = productList;

  const orderStatusCounts = useSelector((state) => state.orderStatuses) || {};
  const { loading: loadingOrderStatuses, orderStatuses = {} } =
    orderStatusCounts;

  useEffect(() => {
    dispatch(getTotalOrders(filter));
    dispatch(getOrderStatusCounts());
    dispatch(ListUsers());
    dispatch(listProducts());
  }, [dispatch, filter]);

  const orderStatusList = [
    {
      label: "Pending",
      key: "pending",
      icon: MdPendingActions,
      color: "blue.500",
    },
    {
      label: "Confirmed",
      key: "confirmed",
      icon: FaClipboardList,
      color: "green.500",
    },
    {
      label: "Packaging",
      key: "packaging",
      icon: GiCardboardBox,
      color: "orange.500",
    },
    {
      label: "Out for delivery",
      key: "outForDelivery",
      icon: MdLocalShipping,
      color: "green.500",
    },
    {
      label: "Delivered",
      key: "delivered",
      icon: AiOutlineDeliveredProcedure,
      color: "blue.500",
    },
    { label: "Canceled", key: "canceled", icon: MdCancel, color: "red.500" },
    {
      label: "Returned",
      key: "returned",
      icon: AiOutlineRollback,
      color: "blue.500",
    },
    {
      label: "Failed to deliver",
      key: "failed",
      icon: ImCross,
      color: "red.500",
    },
  ];

  return (
    <Box bg="gray.100" p={6} borderRadius="md">
      <Flex justify="space-between" align="center" mb={4}>
        <Text fontSize="lg" fontWeight="bold">
          📊 Business Analytics
        </Text>
        <Select
          width="200px"
          bg="white"
          boxShadow="sm"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="Overall">Overall statistics</option>
          <option value="LastMonth">Last Month</option>
          <option value="LastWeek">Last Week</option>
        </Select>
      </Flex>

      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4} mb={4}>
        <AnalyticsCard
          title="Total Orders"
          value={totalOrders || 0}
          icon={FaClipboardList}
          isLoading={loadingOrders}
          onClick={() => navigate("/orders")}
        />
        <AnalyticsCard
          title="Total Users"
          value={loadingUsers ? null : users?.length || 0}
          icon={FaUsers}
          onClick={() => navigate("/admin/userlist")}
        />
        <AnalyticsCard
          title="Total Products"
          value={loadingProducts ? null : products?.length || 0}
          icon={FaBoxOpen}
          onClick={() => navigate("/admin/productlist")}
        />
      </SimpleGrid>

      <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={4}>
        {loadingOrderStatuses ? (
          <Spinner size="lg" />
        ) : (
          orderStatusList.map((status) => (
            <StatusCard
              key={status.label}
              label={status.label}
              count={orderStatuses[status.key] || 0}
              icon={status.icon}
              color={status.color}
              onClick={() => navigate(`/orders/${status.key}`)}
            />
          ))
        )}
      </SimpleGrid>
    </Box>
  );
};

export default TotalDetails;
