import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  HStack,
  Heading,
  Text,
  Spinner,
  Alert,
  AlertIcon,
  Radio,
  useToast,
} from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";

import {
  fetchTopOffers,
  createTopOffer,
  updateTopOffer,
  deleteTopOffer,
  activateTopOffer,
} from "../../actions/bannerActions";

const AdminOfferBannerScreen = () => {
  const dispatch = useDispatch();
  const toast = useToast();

  const [offerText, setOfferText] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState("");

  /* ONLY ONE SELECTOR */
  const topOfferList = useSelector((state) => state.topOfferList);
  const { loading, error, offers = [] } = topOfferList;

  /* FETCH ON LOAD */
  useEffect(() => {
    dispatch(fetchTopOffers());
  }, [dispatch]);

  /* ADD OFFER */
  const addOfferHandler = () => {
    if (!offerText.trim()) {
      toast({
        title: "Enter offer text",
        status: "warning",
        duration: 3000,
        isClosable: true,
        position: "bottom-right",
      });
      return;
    }

    dispatch(createTopOffer(offerText));
    setOfferText("");

    toast({
      title: "Offer added",
      status: "success",
      duration: 2000,
      isClosable: true,
      position: "bottom-right",
    });
  };

  /* UPDATE OFFER */
  const updateOfferHandler = () => {
    if (!editingText.trim()) return;

    dispatch(updateTopOffer(editingId, editingText));
    setEditingId(null);
    setEditingText("");

    toast({
      title: "Offer updated",
      status: "success",
      duration: 2000,
      isClosable: true,
      position: "bottom-right",
    });
  };

  /* DELETE OFFER */
  const deleteOfferHandler = (id) => {
    dispatch(deleteTopOffer(id));

    toast({
      title: "Offer deleted",
      status: "success",
      duration: 2000,
      isClosable: true,
      position: "bottom-right",
    });
  };

  /* ACTIVATE OFFER */
  const activateOfferHandler = (id) => {
    dispatch(activateTopOffer(id));

    toast({
      title: "Offer activated",
      status: "success",
      duration: 2000,
      isClosable: true,
      position: "bottom-right",
    });
  };

  return (
    <Box p={14} bg="white">
      <Heading mb={6}>Offer Banner</Heading>

      {/* ADD OFFER */}
      <Box bg="gray.50" p={6} mb={8} borderRadius="md" boxShadow="md">
        <Heading size="md" mb={4}>
          Add New Offer
        </Heading>
        <VStack spacing={4}>
          <FormControl isRequired>
            <FormLabel>Offer Text</FormLabel>
            <Input
              value={offerText}
              onChange={(e) => setOfferText(e.target.value)}
              placeholder="Flat 50% Discount | Free Delivery Above ₹999"
            />
          </FormControl>
          <Button colorScheme="blue" w="full" onClick={addOfferHandler}>
            Add Offer
          </Button>
        </VStack>
      </Box>

      {/* LIST OFFERS */}
      {loading ? (
        <Spinner size="xl" />
      ) : error ? (
        <Alert status="error">
          <AlertIcon />
          {error}
        </Alert>
      ) : (
        <VStack spacing={4} align="stretch">
          {offers.map((offer) => (
            <Box
              key={offer._id}
              p={4}
              border="1px solid"
              borderColor="gray.200"
              borderRadius="md"
              boxShadow="sm"
            >
              <HStack justify="space-between">
                {/* LEFT */}
                <HStack spacing={3}>
                  <Radio
                    isChecked={offer.isActive}
                    onChange={() => activateOfferHandler(offer._id)}
                  />

                  {editingId === offer._id ? (
                    <Input
                      size="sm"
                      value={editingText}
                      onChange={(e) => setEditingText(e.target.value)}
                    />
                  ) : (
                    <Text fontWeight="bold">{offer.offerText}</Text>
                  )}
                </HStack>

                {/* RIGHT */}
                <HStack spacing={2}>
                  <Button
                    size="sm"
                    colorScheme="yellow"
                    onClick={() => {
                      setEditingId(offer._id);
                      setEditingText(offer.offerText);
                    }}
                  >
                    Edit
                  </Button>

                  {editingId === offer._id && (
                    <Button
                      size="sm"
                      colorScheme="green"
                      onClick={updateOfferHandler}
                    >
                      Update
                    </Button>
                  )}

                  <Button
                    size="sm"
                    colorScheme="red"
                    onClick={() => deleteOfferHandler(offer._id)}
                  >
                    Delete
                  </Button>
                </HStack>
              </HStack>
            </Box>
          ))}
        </VStack>
      )}
    </Box>
  );
};

export default AdminOfferBannerScreen;
