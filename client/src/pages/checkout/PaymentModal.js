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
import { savepaymentmethod } from "../../actions/cartActions";

const API_URL = process.env.REACT_APP_API_URL;

const PaymentModal = ({ isOpen, onClose, handleOrder, totalPrice }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // ✅ Hooks INSIDE component
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const [selectedPayment, setSelectedPayment] = useState("Online Payment");

  const handleCheckout = async () => {
    if (selectedPayment === "Cash on Delivery") {
      dispatch(savepaymentmethod("Cash on Delivery"));
      await handleOrder({ paymentMethod: "Cash on Delivery" });
      onClose();
      navigate("/placeorder");
    } else {
      dispatch(savepaymentmethod("Razorpay"));

      try {
        const { data } = await axios.post(
          `${API_URL}/api/orders/razorpay`,
          { amount: Number(totalPrice) }, // ✅ FIX
          {
            headers: {
              Authorization: `Bearer ${userInfo.token}`,
            },
          }
        );

        if (!window.Razorpay) {
          alert("Razorpay SDK not loaded");
          return;
        }

        const options = {
          key: data.keyId,
          amount: data.amount,
          currency: "INR",
          name: "Your Store",
          description: "Order Payment",
          order_id: data.id,

          method: {
            upi: true,
            card: true,
            netbanking: false,
            wallet: false,
          },

          upi: {
            flow: "collect",
          },

          handler: async function (response) {
            console.log("Razorpay Success:", response);

            await handleOrder({
              paymentMethod: "Razorpay",
              paymentResult: response,
            });

            onClose();
            navigate("/placeorder");
          },

          prefill: {
            name: userInfo.name || "Test User",
            email: userInfo.email || "test@example.com",
            contact: "9999999999",
          },

          theme: {
            color: "#000",
          },
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
      } catch (error) {
        console.error("Razorpay Error:", error.response?.data || error.message);
      }
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
            <HStack
              w="100%"
              p={4}
              border="1px solid"
              cursor="pointer"
              onClick={() => setSelectedPayment("Cash on Delivery")}
            >
              <Icon as={FaMoneyBillWave} />
              <Text>Cash on Delivery</Text>
            </HStack>

            <HStack
              w="100%"
              p={4}
              border="1px solid"
              cursor="pointer"
              onClick={() => setSelectedPayment("Online Payment")}
            >
              <Icon as={FaCreditCard} />
              <Text>Online Payment (Razorpay)</Text>
            </HStack>
          </VStack>
        </ModalBody>

        <ModalFooter>
          <Button w="100%" bg="black" color="white" onClick={handleCheckout}>
            {selectedPayment === "Cash on Delivery"
              ? "Place Order"
              : "Continue Online Payment"}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default PaymentModal;
