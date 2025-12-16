import React, { useEffect } from "react";
import { Button } from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import { processRazorpayPayment } from "../../actions/orderActions";

function RazorpayPayment(props) {
  var totalPrice = props.totalPrice;
  var onSuccess = props.onSuccess;

  var dispatch = useDispatch();

  var razorpayPayment = useSelector(function (state) {
    return state.razorpayPayment || {};
  });

  var loading = razorpayPayment.loading;
  var order = razorpayPayment.order;

  function handlePayment() {
    dispatch(processRazorpayPayment(totalPrice));
  }

  useEffect(
    function () {
      if (!order) return;

      if (typeof window.Razorpay === "undefined") {
        alert("Razorpay SDK not loaded");
        return;
      }

      var options = {
        key: order.keyId,
        amount: order.amount,
        currency: "INR",
        name: "My Store",
        description: "Order Payment",
        order_id: order.id,
        handler: function (response) {
          onSuccess(response);
        },
        theme: { color: "#000" },
      };

      var rzp = new window.Razorpay(options);
      rzp.open();
    },
    [order]
  );

  return React.createElement(
    Button,
    {
      width: "100%",
      bg: "black",
      color: "white",
      isLoading: loading,
      _hover: { bg: "gray.800" },
      onClick: handlePayment,
    },
    "Pay ₹" + totalPrice + " with Razorpay"
  );
}

export default RazorpayPayment;
