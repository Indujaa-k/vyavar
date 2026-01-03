import React, { useEffect, useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  FormControl,
  FormLabel,
  VStack,
  Text,
  Select,
  HStack,
} from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import { createSubscription } from "../../actions/subscriptionActions";
import { SUBSCRIPTION_CREATE_RESET } from "../../constants/subscriptionConstants";

const CreateSubscriptionModal = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [offers, setOffers] = useState([""]);
  const [price, setPrice] = useState("");
  const [discountPercent, setDiscountPercent] = useState("");
  const [durationInDays, setDurationInDays] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const subscriptionCreate = useSelector((state) => state.subscriptionCreate);
  const { loading, success, error } = subscriptionCreate;

  const subscriptionList = useSelector((state) => state.subscriptionList);
  const { subscriptions = [] } = subscriptionList;

  const activePlanExists = subscriptions.some((s) => s.isActive);

  /* Auto calculate end date */
  useEffect(() => {
    if (startDate && durationInDays) {
      const end = new Date(startDate);
      end.setDate(end.getDate() + Number(durationInDays) - 1);
      setEndDate(end.toISOString().split("T")[0]);
    } else {
      setEndDate("");
    }
  }, [startDate, durationInDays]);

  /* Reset on success */
  useEffect(() => {
    if (success) {
      dispatch({ type: SUBSCRIPTION_CREATE_RESET });

      setTitle("");
      setDescription("");
      setOffers([""]);
      setPrice("");
      setDiscountPercent("");
      setDurationInDays("");
      setStartDate("");
      setEndDate("");

      onClose();
    }
  }, [success, dispatch, onClose]);

  /* Offers handlers */
  const handleOfferChange = (index, value) => {
    const updated = [...offers];
    updated[index] = value;
    setOffers(updated);
  };

  const addOffer = () => setOffers([...offers, ""]);
  const removeOffer = (index) =>
    setOffers(offers.filter((_, i) => i !== index));
  const submitHandler = () => {
    const cleanedOffers = offers.filter((o) => o.trim() !== "");

    if (
      !title ||
      !description ||
      cleanedOffers.length === 0 ||
      !price ||
      !durationInDays ||
      !startDate
    ) {
      alert("All fields are required");
      return;
    }

    dispatch(
      createSubscription({
        title,
        description,
        offers: cleanedOffers, // ✅ always valid array
        price: Number(price),
        discountPercent: Number(discountPercent || 0),
        durationInDays: Number(durationInDays),
        startDate,
      })
    );
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Create Subscription</ModalHeader>
        <ModalCloseButton />

        <ModalBody>
          {error && (
            <Text color="red.500" mb={2}>
              {error}
            </Text>
          )}

          {activePlanExists && (
            <Text color="red.500" mb={2} fontSize="sm">
              An active subscription already exists. Deactivate it first.
            </Text>
          )}

          <VStack spacing={4}>
            <FormControl isRequired>
              <FormLabel>Title</FormLabel>
              <Input value={title} onChange={(e) => setTitle(e.target.value)} />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Description</FormLabel>
              <Input
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Offers</FormLabel>
              <VStack align="stretch">
                {offers.map((offer, index) => (
                  <HStack key={index}>
                    <Input
                      placeholder={`Offer ${index + 1}`}
                      value={offer}
                      onChange={(e) => handleOfferChange(index, e.target.value)}
                    />
                    {offers.length > 1 && (
                      <Button
                        size="sm"
                        colorScheme="red"
                        onClick={() => removeOffer(index)}
                      >
                        X
                      </Button>
                    )}
                  </HStack>
                ))}
              </VStack>
              <Button mt={2} size="sm" colorScheme="blue" onClick={addOffer}>
                + Add Offer
              </Button>
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Price</FormLabel>
              <Input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </FormControl>

            <FormControl>
              <FormLabel>Discount (%)</FormLabel>
              <Input
                type="number"
                value={discountPercent}
                onChange={(e) => setDiscountPercent(e.target.value)}
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Duration (Days)</FormLabel>
              <Input
                type="number"
                value={durationInDays}
                onChange={(e) => setDurationInDays(e.target.value)}
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

            <FormControl>
              <FormLabel>End Date</FormLabel>
              <Input value={endDate} isReadOnly />
            </FormControl>
          </VStack>
        </ModalBody>

        <ModalFooter>
          <Button
            colorScheme="blue"
            onClick={submitHandler}
            isLoading={loading}
            isDisabled={activePlanExists}
          >
            Create
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default CreateSubscriptionModal;
