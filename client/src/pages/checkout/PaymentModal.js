import { useState } from "react";
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
import { FaMoneyBillWave, FaCreditCard } from "react-icons/fa";
import { SiRazorpay } from "react-icons/si";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { savepaymentmethod } from "../../actions/cartActions";
import RazorpayPayment from "./RazorpayPayment";

const PaymentModal = ({ isOpen, onClose, handleOrder, totalPrice }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [selectedPayment, setSelectedPayment] = useState("Online Payment");

  // Handle COD order
  const handleCheckout = async () => {
    if (selectedPayment === "Cash on Delivery") {
      dispatch(savepaymentmethod("Cash on Delivery"));
      await handleOrder({ paymentMethod: "Cash on Delivery" });
      onClose();
      navigate("/placeorder");
    } else if (selectedPayment === "Online Payment") {
      dispatch(savepaymentmethod("Razorpay"));

      try {
        // Call your backend to create Razorpay order
        const { data } = await axios.post(
          `${API_URL}/api/orders/razorpay`,
          { amount: totalPrice },
          {
            headers: { Authorization: `Bearer ${userInfo.token}` },
          }
        );

        const options = {
          key: data.keyId, // Razorpay key
          amount: data.amount,
          currency: data.currency,
          name: "Your Store",
          description: "Order Payment",
          order_id: data.id,
          handler: async function (response) {
            // Payment successful
            await handleOrder({
              paymentMethod: "Razorpay",
              paymentResult: response,
            });
            onClose();
            navigate("/placeorder");
          },
          theme: { color: "#000" },
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
      } catch (error) {
        console.error("Razorpay Error:", error);
      }
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent borderRadius="12px">
        <ModalHeader textAlign="center">Select Payment Option</ModalHeader>
        <ModalCloseButton />

        <ModalBody>
          <VStack spacing={4}>
            {/* Cash on Delivery */}
            <HStack
              w="100%"
              p={4}
              borderRadius="md"
              border="1px solid"
              borderColor={
                selectedPayment === "Cash on Delivery" ? "black" : "gray.200"
              }
              cursor="pointer"
              bg={selectedPayment === "Cash on Delivery" ? "gray.100" : "white"}
              justifyContent="space-between"
              onClick={() => setSelectedPayment("Cash on Delivery")}
            >
              <HStack>
                <Icon as={FaMoneyBillWave} boxSize={5} />
                <Text>Cash on Delivery</Text>
              </HStack>
              {selectedPayment === "Cash on Delivery" && (
                <Box w={3} h={3} borderRadius="full" bg="black" />
              )}
            </HStack>

            {/* Online Payment */}
            <HStack
              w="100%"
              p={4}
              borderRadius="md"
              border="1px solid"
              borderColor={
                selectedPayment === "Online Payment" ? "black" : "gray.200"
              }
              cursor="pointer"
              bg={selectedPayment === "Online Payment" ? "gray.100" : "white"}
              justifyContent="space-between"
              onClick={() => setSelectedPayment("Online Payment")}
            >
              <HStack>
                <Icon as={FaCreditCard} boxSize={5} />
                <Text>Online Payment</Text>
              </HStack>
              {selectedPayment === "Online Payment" && (
                <Box w={3} h={3} borderRadius="full" bg="black" />
              )}
            </HStack>
          </VStack>
        </ModalBody>

        <ModalFooter>
          <Button
            w="100%"
            bg="black"
            color="white"
            _hover={{ bg: "gray.800" }}
            onClick={handleCheckout}
          >
            {selectedPayment === "Cash on Delivery"
              ? "Place Order"
              : "Continue"}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default PaymentModal;
