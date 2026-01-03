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
  HStack,
} from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import { updateSubscription } from "../../actions/subscriptionActions";
import { SUBSCRIPTION_UPDATE_RESET } from "../../constants/subscriptionConstants";

const EditSubscriptionModal = ({ isOpen, onClose, subscription }) => {
  const dispatch = useDispatch();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [offers, setOffers] = useState([""]);

  const { success } = useSelector((state) => state.subscriptionUpdate);

  // Prefill data
  useEffect(() => {
    if (subscription) {
      setTitle(subscription.title || "");
      setDescription(subscription.description || "");
      setOffers(subscription.offers?.length ? subscription.offers : [""]);
    }
  }, [subscription]);

  // Reset & close
  useEffect(() => {
    if (success) {
      dispatch({ type: SUBSCRIPTION_UPDATE_RESET });
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
  const removeOffer = (index) => setOffers(offers.filter((_, i) => i !== index));

  const submitHandler = () => {
    dispatch(
      updateSubscription(subscription._id, {
        title,
        description,
        offers: offers.filter((o) => o.trim() !== ""),
      })
    );
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Edit Subscription</ModalHeader>
        <ModalCloseButton />

        <ModalBody>
          <VStack spacing={3}>
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
                      <Button size="sm" colorScheme="red" onClick={() => removeOffer(index)}>
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
          </VStack>
        </ModalBody>

        <ModalFooter>
          <Button colorScheme="blue" onClick={submitHandler}>
            Update
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default EditSubscriptionModal;
