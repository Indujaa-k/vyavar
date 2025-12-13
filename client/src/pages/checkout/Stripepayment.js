import React, { useEffect, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  useStripe,
  PaymentRequestButtonElement,
} from "@stripe/react-stripe-js";
import { Box, Text } from "@chakra-ui/react";

const stripeApiKey = process.env.REACT_APP_STRIPE_PUBLIC_KEY;
const stripePromise = loadStripe(stripeApiKey);

const GooglePayButton = ({ totalPrice, onSuccess, setPaymentMethod }) => {
  const stripe = useStripe();
  const [paymentRequest, setPaymentRequest] = useState(null);
  const [canShowPaymentRequest, setCanShowPaymentRequest] = useState(false);

  useEffect(() => {
    if (!stripe) return;

    // ✅ Ensure totalPrice is a valid number and greater than zero
    const validTotalPrice = Number(totalPrice);
    if (isNaN(validTotalPrice) || validTotalPrice <= 0) {
      console.error("Invalid totalPrice:", totalPrice);
      return;
    }

    const pr = stripe.paymentRequest({
      country: "US",
      currency: "usd",
      total: { label: "Total", amount: Math.round(validTotalPrice * 100) }, // Convert to cents
      requestPayerName: true,
      requestPayerEmail: true,
    });

    pr.canMakePayment().then((result) => {
      if (result) {
        setPaymentRequest(pr);
        setCanShowPaymentRequest(true);
      }
    });
  }, [stripe, totalPrice]);

  if (!canShowPaymentRequest) {
    return (
      <Text fontSize="lg">Google Pay is not available on this device.</Text>
    );
  }

  return (
    <Box>
      <Text fontSize="lg" fontWeight="bold" mb={2}>
        Pay with Google Pay
      </Text>
      <PaymentRequestButtonElement options={{ paymentRequest }} />
    </Box>
  );
};

const StripePayment = ({ totalPrice, onSuccess, setPaymentMethod }) => {
  return (
    <Elements stripe={stripePromise}>
      <GooglePayButton
        totalPrice={totalPrice}
        onSuccess={onSuccess}
        setPaymentMethod={setPaymentMethod}
      />
    </Elements>
  );
};

export default StripePayment;
