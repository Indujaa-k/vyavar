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
  Spinner,
} from "@chakra-ui/react";
import axios from "axios";
import { FaCreditCard } from "react-icons/fa";
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
  const { userInfo } = useSelector((state) => state.userLogin);
  
  // Add loading state
  const [isProcessing, setIsProcessing] = useState(false);

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
        amount: data.amount,
        currency: "INR",
        name: "Your Store",
        description: "Order Payment",
        order_id: data.id,

        handler: async function (response) {
          // ✅ Show processing state
          setIsProcessing(true);
          
          try {
            await axios.post(
              `${API_URL}/api/orders/razorpay/verify`,
              response,
              {
                headers: {
                  Authorization: `Bearer ${userInfo.token}`,
                },
              }
            );

            await handleOrder();
            dispatch(fetchCart());
            
            // The redirect will happen from Checkout.jsx useEffect
          } catch (error) {
            console.error("Payment verification error:", error);
            setIsProcessing(false);
            alert("Payment verification failed. Please contact support.");
          }
        },

        prefill: {
          name: userInfo.name,
          email: userInfo.email,
        },

        theme: { color: "#000" },
      };

      onClose(); // close Chakra modal first

      setTimeout(() => {
        const rzp = new window.Razorpay(options);

        rzp.on("payment.failed", function (response) {
          alert(response.error.description);
          setIsProcessing(false);
        });

        rzp.open();
      }, 300);
    } catch (error) {
      console.error(
        "❌ Razorpay Error:",
        error.response?.data || error.message,
      );
      setIsProcessing(false);
      alert("Payment initialization failed. Please try again.");
    }
  };

  return (
    <>
      {/* Payment Selection Modal */}
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
                borderColor="gray.300"
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

      {/* ✅ Processing Modal - Shows after payment */}
      <Modal 
        isOpen={isProcessing} 
        isCentered 
        closeOnOverlayClick={false}
        closeOnEsc={false}
      >
        <ModalOverlay bg="blackAlpha.800" />
        <ModalContent bg="white" p={8} textAlign="center">
          <ModalBody>
            <VStack spacing={6}>
              <Spinner 
                size="xl" 
                thickness="4px" 
                speed="0.65s"
                color="pink.500" 
              />
              <Text fontSize="2xl" fontWeight="bold" color="black">
                Processing Your Order...
              </Text>
              <Text color="gray.600" fontSize="lg">
                Please do not refresh or close this page
              </Text>
              <Text color="gray.500" fontSize="sm">
                This may take a few moments
              </Text>
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default PaymentModal;