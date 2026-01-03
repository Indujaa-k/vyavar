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
} from "@chakra-ui/react";
import axios from "axios";
import { useSelector } from "react-redux";

const AdminOfferBannerScreen = () => {
  const [offerText, setOfferText] = useState("");
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${userInfo.token}`,
    },
  };

  /* FETCH ALL OFFERS (ADMIN) */
  const fetchOffers = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get("/api/banners/offerbanners", config);

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
    if (!offerText) return alert("Enter offer text");

    await axios.post("/api/banners/offerbanner", { offerText }, config);

    setOfferText("");
    fetchOffers();
  };

  /* UPDATE OFFER */
  const editOfferHandler = async (id, oldText) => {
    const newText = prompt("Edit offer text", oldText);
    if (!newText) return;

    await axios.put(
      `/api/banners/offerbanner/${id}`,
      { offerText: newText }, // ✅ ONLY TEXT
      config
    );

    fetchOffers();
  };

  /* DELETE OFFER */
  const deleteOfferHandler = async (id) => {
    if (window.confirm("Delete this offer?")) {
      await axios.delete(`/api/banners/offerbanner/${id}`, config);

      fetchOffers();
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
                          `/api/banners/offerbanner/activate/${offer._id}`,
                          {}, // PUT body can be empty
                          config
                        );
                        console.log("Activate offer response:", data); // 🔹 Step 2: Debug log
                        fetchOffers();
                      } catch (err) {
                        console.error(
                          "Activate offer error:",
                          err.response?.data || err.message
                        ); // 🔹 Step 3: More info
                        alert("Failed to activate offer");
                      }
                    }}
                  />

                  <Text fontWeight="bold">{offer.offerText}</Text>
                </HStack>

                {/* Right side: Buttons */}
                <HStack spacing={2}>
                  <Button
                    colorScheme="yellow"
                    size="sm"
                    onClick={() => editOfferHandler(offer._id, offer.offerText)}
                  >
                    Edit
                  </Button>
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
