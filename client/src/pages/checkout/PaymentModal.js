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
  Radio,
  RadioGroup,
  Stack,
} from "@chakra-ui/react";
import {
  FaMoneyBillWave,
  FaCreditCard,
  FaPaypal,
  FaStripe,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { savepaymentmethod } from "../../actions/cartActions";
import PaypalPayment from "./PaypalPayment";
import StripePayment from "./Stripepayment";

const PaymentModal = ({ isOpen, onClose, handleOrder, totalPrice }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // Step 1: Choose Payment, Step 2: Choose Online Payment Type
  const [selectedPayment, setSelectedPayment] = useState("Online Payment");
  const [onlinePaymentMethod, setOnlinePaymentMethod] = useState("Stripe");

  const handleCheckout = async () => {
    const finalPaymentMethod =
      selectedPayment === "Online Payment"
        ? onlinePaymentMethod
        : selectedPayment;

    dispatch(savepaymentmethod(finalPaymentMethod)); // Save payment method in Redux

    if (finalPaymentMethod === "Cash on Delivery") {
      await handleOrder({ paymentMethod: finalPaymentMethod });
      onClose();
      navigate("/placeorder");
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent borderRadius="12px">
        <ModalHeader textAlign="center">
          {step === 1 ? "Select Payment Option" : "Choose Online Payment"}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {step === 1 ? (
            // **Step 1: Choose Cash on Delivery or Online Payment**
            <VStack spacing={4}>
              <HStack
                w="100%"
                p={4}
                borderRadius="md"
                border="1px solid"
                borderColor={
                  selectedPayment === "Cash on Delivery" ? "black" : "gray.200"
                }
                cursor="pointer"
                bg={
                  selectedPayment === "Cash on Delivery" ? "gray.100" : "white"
                }
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
                onClick={() => setStep(2)}
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
          ) : (
            // **Step 2: Choose Between Stripe & PayPal**
            <VStack spacing={4}>
              <RadioGroup
                onChange={setOnlinePaymentMethod}
                value={onlinePaymentMethod}
              >
                <Stack spacing={5}>
                  <Radio value="Stripe">
                    <HStack>
                      <Icon as={FaStripe} />
                      <Text>Pay with Stripe</Text>
                    </HStack>
                  </Radio>
                  <Radio value="Paypal">
                    <HStack>
                      <Icon as={FaPaypal} />
                      <Text>Pay with PayPal</Text>
                    </HStack>
                  </Radio>
                </Stack>
              </RadioGroup>

              {/* Render PayPal or Stripe Component */}
              <Box mt={4} w="100%">
                {onlinePaymentMethod === "Paypal" && (
                  <PaypalPayment
                    totalPrice={totalPrice}
                    onSuccess={handleOrder}
                  />
                )}
                {onlinePaymentMethod === "Stripe" && (
                  <StripePayment
                    totalPrice={totalPrice}
                    onSuccess={handleOrder}
                  />
                )}
              </Box>
            </VStack>
          )}
        </ModalBody>

        <ModalFooter>
          {step === 1 ? (
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
          ) : (
            <Button variant="outline" onClick={() => setStep(1)}>
              Back
            </Button>
          )}
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default PaymentModal;
