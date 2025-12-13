import React, { useState, useEffect } from "react";
import axios from "axios";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { Box, Spinner, Text } from "@chakra-ui/react";

const PaypalPayment = ({ totalPrice, onSuccess, setPaymentMethod }) => {
  const [clientId, setClientId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPaypalClientId = async () => {
      try {
        const { data } = await axios.get("/api/config/paypal");
        setClientId(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching PayPal client ID:", error);
        setLoading(false);
      }
    };

    fetchPaypalClientId();
  }, []);

  const successPaymentHandler = (paymentResult) => {
    console.log("Payment Result:", paymentResult);

    // Check if PayPal was paid via a Credit/Debit Card
    if (paymentResult.payment_source === "card") {
      setPaymentMethod("Card"); // Save as "Card" in DB
    } else {
      setPaymentMethod("Paypal");
    }

    onSuccess(paymentResult);
  };

  return (
    <Box mt={4} w="full">
      <Text fontSize="lg" fontWeight="bold" mb={2}>
        Pay with PayPal
      </Text>

      {loading ? (
        <Spinner />
      ) : clientId ? (
        <PayPalScriptProvider options={{ "client-id": clientId }}>
          <PayPalButtons
            createOrder={(data, actions) =>
              actions.order.create({
                purchase_units: [{ amount: { value: totalPrice.toFixed(2) } }],
              })
            }
            onApprove={(data, actions) =>
              actions.order.capture().then(successPaymentHandler)
            }
          />
        </PayPalScriptProvider>
      ) : (
        <Text color="red.500">Error loading PayPal. Try again later.</Text>
      )}
    </Box>
  );
};

export default PaypalPayment;
