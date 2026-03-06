import React from "react";
import { Box, Text, Stack, Icon, Divider, HStack } from "@chakra-ui/react";
import { FaCheckCircle } from "react-icons/fa";

const OrderTracking = ({ order }) => {
  const statusOrder = [
    "CREATED",
    "CONFIRMED",
    "PACKED",
    "OUT_FOR_DELIVERY",
    "DELIVERED",
  ];

  const returnStatuses = ["RETURN_APPROVED", "RETURN_COMPLETED"];

  const isCompleted = (stepStatus) => {
    const currentIndex = statusOrder.indexOf(order.orderStatus);
    const stepIndex = statusOrder.indexOf(stepStatus);

    if (returnStatuses.includes(order.orderStatus)) {
      return true; // all steps completed before return
    }

    return currentIndex >= stepIndex;
  };

  const StatusRow = ({ label, step }) => (
    <HStack spacing={2}>
      <Icon
        as={FaCheckCircle}
        color={isCompleted(step) ? "green.500" : "gray.400"}
      />
      <Text fontWeight={isCompleted(step) ? "bold" : "normal"}>{label}</Text>
    </HStack>
  );

  return (
    <Box borderWidth={1} borderRadius="md" p={5} boxShadow="lg" bg="white">
      <Text fontSize="lg" fontWeight="bold" mb={3}>
        Tracking Details
      </Text>

      <Stack spacing={3}>
        <StatusRow label="Order Created" step="CREATED" />
        <Divider />

        <StatusRow label="Confirmed" step="CONFIRMED" />
        <Divider />

        <StatusRow label="Packed" step="PACKED" />
        <Divider />

        <StatusRow label="Out For Delivery" step="OUT_FOR_DELIVERY" />
        <Divider />

        <StatusRow label="Delivered" step="DELIVERED" />
        <Divider />

        {order.orderStatus === "RETURN_APPROVED" && (
          <>
            <StatusRow label="Return Approved" step="DELIVERED" />
            <Divider />
          </>
        )}

        {order.orderStatus === "RETURN_COMPLETED" && (
          <>
            <StatusRow label="Return Completed" step="DELIVERED" />
            <Divider />
          </>
        )}
      </Stack>
    </Box>
  );
};

export default OrderTracking;
