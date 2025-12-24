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
      dispatch(savepaymentmethod("COD"));
      await handleOrder({ paymentMethod: "COD" });
      onClose();
      navigate("/placeorder");
    } else {
      dispatch(savepaymentmethod("Razorpay"));

      try {
        const { data } = await axios.post(
          `${API_URL}/api/orders/razorpay`,
          { amount: Number(totalPrice) },
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

          handler: async function (response) {
            // ✅ VERIFY
            await axios.post(
              `${API_URL}/api/orders/razorpay/verify`,
              response,
              {
                headers: {
                  Authorization: `Bearer ${userInfo.token}`,
                },
              }
            );

            // ✅ CREATE ORDER
            await handleOrder({
              paymentMethod: "Razorpay",
              paymentResult: response,
            });

            onClose();
            navigate("/placeorder");
          },

          prefill: {
            name: userInfo.name,
            email: userInfo.email,
            contact: "9999999999",
          },

          theme: { color: "#000" },
        };

        const rzp = new window.Razorpay(options);

        rzp.on("payment.failed", function (response) {
          alert(response.error.description);
        });

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
