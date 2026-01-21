import React, { useState } from "react";
import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  VStack,
  HStack,
  Text,
  Icon,
  Box,
} from "@chakra-ui/react";
import axios from "axios";
import { FaMoneyBillWave, FaCreditCard } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { savepaymentmethod, fetchCart } from "../../actions/cartActions";

const API_URL = process.env.REACT_APP_API_URL;

const PaymentModal = ({
  isOpen,
  onClose,
  handleOrder,
  cartItems,
  couponCode,
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { userInfo } = useSelector((state) => state.userLogin);

  const handleCheckout = async () => {
    dispatch(savepaymentmethod("Razorpay"));

    try {
      const { data } = await axios.post(
        `${API_URL}/api/orders/razorpay`,
        {
          cartItems: cartItems.map((item) => ({
            product: item.product._id,
            qty: item.qty,
            size: item.size,
          })),
          couponCode: couponCode || null,
        },
        {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        },
      );

      if (!window.Razorpay) {
        alert("Razorpay SDK not loaded");
        return;
      }

      const options = {
        key: data.keyId,
        amount: data.amount, // backend calculated (paise)
        currency: "INR",
        name: "Your Store",
        description: "Order Payment",
        order_id: data.id,

        handler: async function (response) {
          await axios.post(`${API_URL}/api/orders/razorpay/verify`, response, {
            headers: {
              Authorization: `Bearer ${userInfo.token}`,
            },
          });

          
          await handleOrder();

         
          dispatch(fetchCart());

          onClose();
        },

        prefill: {
          name: userInfo.name,
          email: userInfo.email,
        },

        theme: { color: "#000" },
      };

      // const rzp = new window.Razorpay(options);

      // rzp.on("payment.failed", function (response) {
      //   alert(response.error.description);
      // });

      // rzp.open();
      onClose(); // close Chakra modal first

      setTimeout(() => {
        const rzp = new window.Razorpay(options);

        rzp.on("payment.failed", function (response) {
          alert(response.error.description);
        });

        rzp.open();
      }, 300);
    } catch (error) {
      console.error(
        "❌ Razorpay Error:",
        error.response?.data || error.message,
      );
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Select Payment Option</ModalHeader>
        <ModalCloseButton />

        <ModalBody>
          <VStack spacing={4}>
            {/* <HStack
              w="100%"
              p={4}
              border="1px solid"
              cursor="pointer"
              bg={selectedPayment === "Cash on Delivery" ? "gray.200" : "white"} // ✅ highlight
              borderColor={
                selectedPayment === "Cash on Delivery" ? "black" : "gray.300"
              }
              onClick={() => setSelectedPayment("Cash on Delivery")}
            >
              <Icon as={FaMoneyBillWave} />
              <Text>Cash on Delivery</Text>
            </HStack> */}

            <HStack
              w="100%"
              p={4}
              border="1px solid"
              cursor="pointer"
              // bg={selectedPayment === "Online Payment" ? "gray.200" : "white"} // ✅ highlight
              // borderColor={
              //   selectedPayment === "Online Payment" ? "black" : "gray.300"
              // }
            >
              <Icon as={FaCreditCard} />
              <Text>Online Payment (Razorpay)</Text>
            </HStack>
          </VStack>
        </ModalBody>

        <ModalFooter>
          <Button w="100%" bg="black" color="white" onClick={handleCheckout}>
            Continue Online Payment
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default PaymentModal;
