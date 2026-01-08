import React from "react";
import { Box, Text, Stack, Icon, Divider, HStack } from "@chakra-ui/react";
import { FaCheckCircle } from "react-icons/fa";

const OrderTracking = ({ order }) => {
  const isCompleted = (currentStatus, stepStatus) => {
    const statusOrder = [
      "CONFIRMED",
      "PACKED",
      "OUT_FOR_DELIVERY",
    ];

    return (
      statusOrder.indexOf(currentStatus) >=
      statusOrder.indexOf(stepStatus)
    );
  };

  const StatusRow = ({ label, active }) => (
    <HStack spacing={2}>
      <Icon
        as={FaCheckCircle}
        color={active ? "green.500" : "gray.400"}
      />
      <Text fontWeight={active ? "bold" : "normal"}>{label}</Text>
    </HStack>
  );

  return (
    <Box
      borderWidth={1}
      borderRadius="md"
      p={5}
      boxShadow="lg"
      bg="white"
    >
      <Text fontSize="lg" fontWeight="bold" mb={3}>
        Tracking Details
      </Text>

      <Stack spacing={3}>
        <StatusRow
          label="Confirmed"
          active={isCompleted(order.orderStatus, "CONFIRMED")}
        />
        <Divider />

        <StatusRow
          label="Packed"
          active={isCompleted(order.orderStatus, "PACKED")}
        />
        <Divider />

        <StatusRow
          label="Dispatched"
          active={isCompleted(order.orderStatus, "OUT_FOR_DELIVERY")}
        />
        <Divider />

      </Stack>
    </Box>
  );
};

export default OrderTracking;
