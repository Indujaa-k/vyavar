import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useSelector } from "react-redux";
import { Box, Text, Stack, Icon, Flex, SimpleGrid } from "@chakra-ui/react";
import {
  FaUsers,
  FaShoppingCart,
  FaTimesCircle,
  FaCrown,
  FaTruck,
} from "react-icons/fa";

const UsersPieChart = () => {
  const userList = useSelector((state) => state.userList);
  const { users } = userList;

  if (!users || users.length === 0) {
    return <Text>No user data available.</Text>;
  }

  const totalUsers = users.length;
  const usersWithOrders = users.filter(
    (user) => user.orderHistory?.length > 0
  ).length;
  const usersWithoutOrders = totalUsers - usersWithOrders;
  const adminUsers = users.filter((user) => user.isAdmin).length;
  const deliveryAgents = users.filter((user) => user.isDelivery).length;

  const data = [
    { name: "Users with Orders", value: usersWithOrders },
    { name: "Users without Orders", value: usersWithoutOrders },
    { name: "Admin Users", value: adminUsers },
    { name: "Delivery Agents", value: deliveryAgents },
  ];

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  return (
    <Box width="100%" p={6}>
      {/* Pie Chart Container */}
      <Flex justify="center" align="center" w="100%">
        <Box
          p={4}
          bg="white"
          shadow="md"
          borderRadius="md"
          maxW="800px"
          w="100%"
        >
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={data} cx="50%" cy="50%" outerRadius={120}>
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend align="right" verticalAlign="middle" layout="vertical" />
            </PieChart>
          </ResponsiveContainer>
        </Box>
      </Flex>
      {/* User Data on Right Side */}
      <Box mt="5">
        <SimpleGrid columns={{ base: 2, md: 3 }} spacing={4}>
          {[
            {
              label: "Total Users",
              value: totalUsers,
              icon: FaUsers,
              color: "blue.500",
            },
            {
              label: "Users with Orders",
              value: usersWithOrders,
              icon: FaShoppingCart,
              color: "green.500",
            },
            {
              label: "Users without Orders",
              value: usersWithoutOrders,
              icon: FaTimesCircle,
              color: "red.500",
            },
            {
              label: "Admin Users",
              value: adminUsers,
              icon: FaCrown,
              color: "purple.500",
            },
            {
              label: "Delivery Agents",
              value: deliveryAgents,
              icon: FaTruck,
              color: "orange.500",
            },
          ].map((item, index) => (
            <Box
              key={index}
              p={3}
              shadow="md"
              borderRadius="md"
              bg="white"
              maxW="300px" 
              w="100%"
            >
              <Flex align="center" justify="center">
                <Icon as={item.icon} color={item.color} mr={3} boxSize={6} />
                <Text fontSize="lg" fontWeight="bold" color="gray.700">
                  {item.label}: {item.value}
                </Text>
              </Flex>
            </Box>
          ))}
        </SimpleGrid>
      </Box>
    </Box>
  );
};

export default UsersPieChart;
