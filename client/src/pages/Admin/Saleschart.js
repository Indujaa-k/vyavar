import React, { useEffect, useState } from "react";
import {
  Box,
  Heading,
  Grid,
  GridItem,
  Select,
  Spinner,
  Alert,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
} from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import {
  getSalesData,
  getRevenueData,
  getDashboardOrders,
  getTotalOrders,
} from "../../actions/dashboardActions";
import { ResponsiveContainer } from "recharts";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

const Saleschart = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.userDetails);
  // Redux state
  const {
    loading: loadingSales,
    sales,
    error: errorSales,
  } = useSelector((state) => state.sales);
  const {
    loading: loadingRevenue,
    revenue,
    error: errorRevenue,
  } = useSelector((state) => state.revenue);
  const {
    loading: loadingTotalOrders,
    totalOrders,
    error: errortotalOrders,
  } = useSelector((state) => state.totalOrders);
  const {
    loading: loadingOrders,
    orders,
    error: errorOrders,
  } = useSelector((state) => state.orders);

  const [filter, setFilter] = useState("Day"); // Default filter

  // Calculate totals
  const totalOrdersCount = totalOrders || 0;
  const totalSales = sales?.reduce((acc, item) => acc + item.value, 0) || 0;
  const totalRevenue = revenue?.reduce((acc, item) => acc + item.value, 0) || 0;

  // Fetch data on mount & filter change
  useEffect(() => {
    dispatch(getSalesData(filter));
    dispatch(getRevenueData(filter));
    dispatch(getTotalOrders(filter));
    dispatch(getDashboardOrders());
  }, [dispatch, filter]);

  // Format chart data
  const formatChartData = (data) =>
    data?.map((item) => ({
      name: item.label,
      value: item.value,
    })) || [];

  return (
    <Box p={10} >
      {/* Key Metrics */}
      <Grid templateColumns="repeat(3, 1fr)" gap={6} mb={10}>
        <GridItem>
          <Stat p={5} bg="blue.50" borderRadius="md" shadow="sm">
            <StatLabel textAlign={"center"}>📦 Total Orders</StatLabel>
            <StatNumber textAlign={"center"}>{totalOrdersCount}</StatNumber>
            <StatHelpText textAlign={"center"}>Across all time</StatHelpText>
          </Stat>
        </GridItem>
        <GridItem>
          <Stat p={5} bg="blue.50" borderRadius="md" shadow="sm">
            <StatLabel textAlign={"center"}>📊 Total Sales</StatLabel>
            <StatNumber textAlign={"center"}>{totalSales} Nos</StatNumber>
            <StatHelpText textAlign={"center"}>Across all time</StatHelpText>
          </Stat>
        </GridItem>
        {user?.isSeller !== true && (
          <GridItem>
            <Stat p={5} bg="blue.50" borderRadius="md" shadow="sm">
              <StatLabel textAlign={"center"}>💰 Total Revenue</StatLabel>
              <StatNumber textAlign={"center"}>
                Rs. {totalRevenue.toFixed(2)}
              </StatNumber>
              <StatHelpText textAlign={"center"}>Across all time</StatHelpText>
            </Stat>
          </GridItem>
        )}
      </Grid>

      {/* Filter Dropdown */}
      <Box mb={8}>
        <Select
          placeholder="UptoDate"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          maxW="300px"
        >
          <option value="Day">Day</option>
          <option value="Week">Week</option>
          <option value="Month">Month</option>
          <option value="Year">Year</option>
        </Select>
      </Box>

      {/* Charts and Tables */}
      {loadingSales || loadingRevenue || loadingOrders || loadingTotalOrders ? (
        <Box textAlign="center" mt={10}>
          <Spinner size="xl" />
        </Box>
      ) : errorSales || errorRevenue || errorOrders || errortotalOrders ? (
        <Alert status="error" mt={4}>
          {errorSales || errorRevenue || errorOrders || errortotalOrders}
        </Alert>
      ) : (
        <Box>
          {/* Charts Section */}
          <Grid
            templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }}
            gap={10}
            mb={10}
          >
            <GridItem w="100%" h="350px">
              <Heading as="h3" size="md" mb={3} textAlign="center">
                Sales Data
              </Heading>

              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={formatChartData(sales)}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="violet"
                    strokeWidth={3}
                  />
                </LineChart>
              </ResponsiveContainer>
            </GridItem>

            <GridItem w="100%" h="350px">
              <Heading as="h3" size="md" mb={3} textAlign="center">
                Revenue Data
              </Heading>

              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={formatChartData(revenue)}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="orange"
                    strokeWidth={3}
                  />
                </LineChart>
              </ResponsiveContainer>
            </GridItem>
          </Grid>
        </Box>
      )}
    </Box>
  );
};

export default Saleschart;
