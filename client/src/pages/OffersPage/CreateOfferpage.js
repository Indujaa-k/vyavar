import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  createOffer,
  listOffers,
  updateOffer,
  deleteOffer,
} from "../../actions/offerActions";
import {
  OFFER_CREATE_RESET,
  OFFER_UPDATE_RESET,
  OFFER_DELETE_RESET,
} from "../../constants/offerConstants";
import {
  Box,
  Button,
  Input,
  Stack,
  Text,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  HStack,
  useToast,
} from "@chakra-ui/react";

const OfferManagementScreen = () => {
  const dispatch = useDispatch();
  const toast = useToast();

  // 🔹 Form State
  const [editingId, setEditingId] = useState(null);
  const [code, setCode] = useState("");
  const [offerPercentage, setOfferPercentage] = useState("");
  const [startDate, setStartDate] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [maxUsage, setMaxUsage] = useState("");

  // 🔹 Redux States
  const { offers = [], loading } = useSelector((state) => state.offerList);
  const { success: createSuccess, error: createError } = useSelector(
    (state) => state.offerCreate
  );
  const { success: updateSuccess, error: updateError } = useSelector(
    (state) => state.offerUpdate
  );
  const { success: deleteSuccess, error: deleteError } = useSelector(
    (state) => state.offerDelete
  );

  // 🔹 Load offers
  useEffect(() => {
    dispatch(listOffers());
  }, [dispatch]);

  // 🔹 Handle success & errors
  useEffect(() => {
    if (createSuccess) {
      toast({ title: "Offer created", status: "success" });
      dispatch({ type: OFFER_CREATE_RESET });
      resetForm();
      dispatch(listOffers());
    }

    if (updateSuccess) {
      toast({ title: "Offer updated", status: "success" });
      dispatch({ type: OFFER_UPDATE_RESET });
      resetForm();
      dispatch(listOffers());
    }

    if (deleteSuccess) {
      toast({ title: "Offer deleted", status: "success" });
      dispatch({ type: OFFER_DELETE_RESET });
      dispatch(listOffers());
    }

    if (createError || updateError || deleteError) {
      toast({
        title: createError || updateError || deleteError,
        status: "error",
      });
    }
  }, [
    createSuccess,
    updateSuccess,
    deleteSuccess,
    createError,
    updateError,
    deleteError,
    dispatch,
    toast,
  ]);

  // 🔹 Helpers
  const resetForm = () => {
    setEditingId(null);
    setCode("");
    setOfferPercentage("");
    setStartDate("");
    setExpiryDate("");
    setMaxUsage("");
  };

  const submitHandler = (e) => {
    e.preventDefault();

    const offerData = {
      code,
      offerPercentage,
      startDate,
      expiryDate,
      maxUsage: Number(maxUsage),
    };

    if (editingId) {
      dispatch(updateOffer(editingId, offerData));
    } else {
      dispatch(createOffer(offerData));
    }
  };

  const editHandler = (offer) => {
    setEditingId(offer._id);
    setCode(offer.code);
    setOfferPercentage(offer.offerPercentage);
    setStartDate(offer.startDate.substring(0, 10));
    setExpiryDate(offer.expiryDate.substring(0, 10));
    setMaxUsage(offer.maxUsage || "");
  };

  const deleteHandler = (id) => {
    if (window.confirm("Are you sure you want to delete this offer?")) {
      dispatch(deleteOffer(id));
    }
  };

  return (
    <Box p={6}>
      {/* ================= FORM ================= */}
      <Box maxW="420px" mb={10}>
        <Text fontSize="xl" fontWeight="bold" mb={4} mt={5}>
          {editingId ? "Edit Offer" : "Create Offer"}
        </Text>

        <form onSubmit={submitHandler}>
          <Stack spacing={4}>
            <Input
              placeholder="Offer Code"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              required
            />

            <Input
              type="number"
              placeholder="Offer Percentage"
              value={offerPercentage}
              onChange={(e) => setOfferPercentage(e.target.value)}
              required
            />

            <Input
              type="number"
              placeholder="Max Usage (0 = unlimited)"
              value={maxUsage}
              onChange={(e) => setMaxUsage(e.target.value)}
              required
            />
            <label>
              Start Date:
              <Input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
              />
            </label>
            <label>
              Expiry Date:
              <Input
                type="date"
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
                required
              />
            </label>
            <HStack>
              <Button type="submit" colorScheme="blackAlpha">
                {editingId ? "Update" : "Create"}
              </Button>

              {editingId && (
                <Button variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
              )}
            </HStack>
          </Stack>
        </form>
      </Box>

      {/* ================= TABLE ================= */}
      <Text fontSize="xl" fontWeight="bold" mb={4}>
        All Offers
      </Text>

      {loading && <Text>Loading...</Text>}

      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>Code</Th>
            <Th>Discount</Th>
            <Th>Usage</Th>
            <Th>Start</Th>
            <Th>Expiry</Th>
            <Th>Actions</Th>
          </Tr>
        </Thead>

        <Tbody>
          {offers.map((offer) => (
            <Tr key={offer._id}>
              <Td>{offer.code}</Td>
              <Td>{offer.offerPercentage}%</Td>
              <Td>
                {offer.usedCount || 0} /{" "}
                {offer.maxUsage === 0 ? "∞" : offer.maxUsage}
              </Td>
              <Td>{new Date(offer.startDate).toLocaleDateString()}</Td>
              <Td>{new Date(offer.expiryDate).toLocaleDateString()}</Td>
              <Td>
                <HStack>
                  <Button size="sm" onClick={() => editHandler(offer)}>
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    colorScheme="red"
                    onClick={() => deleteHandler(offer._id)}
                  >
                    Delete
                  </Button>
                </HStack>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
};

export default OfferManagementScreen;
