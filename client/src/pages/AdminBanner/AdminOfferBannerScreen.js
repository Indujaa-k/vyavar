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
import axios from "axios";
import { useSelector } from "react-redux";

const AdminOfferBannerScreen = () => {
  const toast = useToast();
  const [offerText, setOfferText] = useState("");
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;
  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState("");

  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${userInfo.token}`,
    },
  };
const API_URL = process.env.REACT_APP_API_URL;
  /* FETCH ALL OFFERS (ADMIN) */
  const fetchOffers = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${API_URL}/api/banners/offerbanners`, config);

      setOffers(data);
      setLoading(false);
    } catch (err) {
      setError("Failed to load offers");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOffers();
  }, []);

  /* ADD OFFER */
  const addOfferHandler = async () => {
    if (!offerText) {
      toast({
        title: "Enter offer text",
        status: "warning",
        duration: 3000,
        isClosable: true,
        position: "bottom-right",
      });
      return;
    }

    try {
      await axios.post(`${API_URL}/api/banners/offerbanner`, { offerText }, config);

      toast({
        title: "Offer added successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "bottom-right",
      });

      // setOfferText("");
      // fetchOffers();
    } catch (err) {
      toast({
        title: "Failed to add offer",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "bottom-right",
      });
    }

    setOfferText("");
    fetchOffers();
  };

  /* UPDATE OFFER */
  const editOfferHandler = async () => {
    if (!editingText.trim()) {
      toast({
        title: "Offer text cannot be empty",
        status: "warning",
        duration: 3000,
        isClosable: true,
        position: "bottom-right",
      });
      return;
    }

    try {
      await axios.put(
        `${API_URL}/api/banners/offerbanner/${editingId}`,
        { offerText: editingText },
        config,
      );

      toast({
        title: "Offer updated successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "bottom-right",
      });

      setEditingId(null);
      setEditingText("");
      fetchOffers();
    } catch (err) {
      toast({
        title: "Failed to update offer",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "bottom-right",
      });
    }
  };

  /* DELETE OFFER */
  const deleteOfferHandler = async (id) => {
    try {
      await axios.delete(`${API_URL}/api/banners/offerbanner/${id}`, config);

      toast({
        title: "Offer deleted successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "bottom-right",
      });

      fetchOffers();
    } catch (err) {
      toast({
        title: "Failed to delete offer",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "bottom-right",
      });
    }
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
              <HStack justify="space-between" align="center" w="100%">
                {/* Left side: Radio + text */}
                <HStack spacing={3}>
                  <Radio
                    name="activeOffer"
                    isChecked={offer.isActive}
                    onChange={async () => {
                      try {
                        const { data } = await axios.put(
                          `${API_URL}/api/banners/offerbanner/activate/${offer._id}`,
                          {}, // PUT body can be empty
                          config,
                        );
                        toast({
                          title: "Offer activated",
                          status: "success",
                          duration: 2000,
                          isClosable: true,
                          position: "bottom-right",
                        });

                        fetchOffers();
                      } catch (err) {
                        console.error(
                          "Activate offer error:",
                          err.response?.data || err.message,
                        ); // 🔹 Step 3: More info
                        toast({
                          title: "Failed to activate offer",
                          status: "error",
                          duration: 3000,
                          isClosable: true,
                          position: "bottom-right",
                        });
                      }
                    }}
                  />
                  {editingId === offer._id ? (
                    <Input
                      value={editingText}
                      size="sm"
                      onChange={(e) => setEditingText(e.target.value)}
                    />
                  ) : (
                    <Text fontWeight="bold">{offer.offerText}</Text>
                  )}
                </HStack>

                {/* Right side: Buttons */}
                <HStack spacing={2}>
                  <Button
                    colorScheme="yellow"
                    size="sm"
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
                      onClick={editOfferHandler}
                    >
                      Update
                    </Button>
                  )}

                  <Button
                    colorScheme="red"
                    size="sm"
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
