import React, { useState, useEffect } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  VStack,
  Input,
  Button,
  Select,
  Text,
  FormLabel,
  FormControl,
  Spinner,
  SimpleGrid,
} from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import {
  createSubscription,
  updateSubscription,
} from "../../actions/subscriptionActions";

const CreateSubscriptionModal = ({ isOpen, onClose, subscription }) => {
  const dispatch = useDispatch();
  const isEdit = Boolean(subscription);

  const [planName, setPlanName] = useState("");
  const [planType, setPlanType] = useState("MONTHLY");
  const [price, setPrice] = useState("");
  const [discountPercent, setDiscountPercent] = useState(0);
  const [startDate, setStartDate] = useState("");
  const [days, setDays] = useState("");
  const [endDate, setEndDate] = useState("");

  const { loading, error, success } = useSelector(
    (state) => state.subscriptionCreate
  );

  const { loading: updateLoading, success: updateSuccess } = useSelector(
    (state) => state.subscriptionUpdate
  );

  // Prefill when editing
  useEffect(() => {
    if (subscription) {
      setPlanName(subscription.planName);
      setPlanType(subscription.planType);
      setPrice(subscription.price);
      setDiscountPercent(subscription.discountPercent || 0);
      setStartDate(subscription.startDate.split("T")[0]);
      setDays(subscription.durationInDays);
    }
  }, [subscription]);

  // Auto calculate end date
  useEffect(() => {
    if (startDate && days) {
      const end = new Date(startDate);
      end.setDate(end.getDate() + Number(days));
      setEndDate(end.toISOString().split("T")[0]);
    }
  }, [startDate, days]);

  // Close modal on success
  useEffect(() => {
    if (success || updateSuccess) {
      handleClose();
    }
  }, [success, updateSuccess]);

  const handleClose = () => {
    setPlanName("");
    setPlanType("MONTHLY");
    setPrice("");
    setDiscountPercent(0);
    setStartDate("");
    setDays("");
    setEndDate("");
    onClose();
  };

  const submitHandler = (e) => {
    e.preventDefault();

    const payload = {
      planName,
      planType,
      price: Number(price),
      discountPercent: Number(discountPercent),
      startDate,
      durationInDays: Number(days),
    };

    if (isEdit) {
      dispatch(updateSubscription(subscription._id, payload));
    } else {
      dispatch(createSubscription(payload));
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} isCentered size="lg">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader textAlign="center">
          {isEdit ? "Edit Subscription" : "Create Subscription"}
        </ModalHeader>
        <ModalCloseButton />

        <ModalBody pb={6}>
          {(loading || updateLoading) && (
            <Spinner display="block" mx="auto" mb={4} />
          )}
          {error && <Text color="red.500">{error}</Text>}
          <form onSubmit={submitHandler}>
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
              <FormControl isRequired>
                <FormLabel>Plan Name</FormLabel>
                <Input
                  value={planName}
                  onChange={(e) => setPlanName(e.target.value)}
                  placeholder="Enter plan name"
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Plan Type</FormLabel>
                <Select
                  value={planType}
                  onChange={(e) => setPlanType(e.target.value)}
                >
                  <option value="MONTHLY">MONTHLY</option>
                  <option value="YEARLY">YEARLY</option>
                </Select>
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Price</FormLabel>
                <Input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="e.g. 1000"
                />
              </FormControl>

              <FormControl>
                <FormLabel>Discount %</FormLabel>
                <Input
                  type="number"
                  value={discountPercent}
                  onChange={(e) => setDiscountPercent(e.target.value)}
                  placeholder="10 / 20 / 30"
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Start Date</FormLabel>
                <Input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Duration (Days)</FormLabel>
                <Input
                  type="number"
                  value={days}
                  onChange={(e) => setDays(e.target.value)}
                  placeholder="30 / 60 / 90"
                />
              </FormControl>

              <FormControl>
                <FormLabel>End Date</FormLabel>
                <Input value={endDate} isReadOnly />
              </FormControl>
            </SimpleGrid>

            <Button mt={4} type="submit" colorScheme="teal" width="100%">
              {isEdit ? "Update" : "Create"}
            </Button>
          </form>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default CreateSubscriptionModal;
