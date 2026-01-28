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
  Card,
  CardBody,
  CardHeader,
  Divider,
  Badge,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  useDisclosure,
} from "@chakra-ui/react";

const OfferManagementScreen = () => {
  const dispatch = useDispatch();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [editingId, setEditingId] = useState(null);
  const [code, setCode] = useState("");
  const [offerPercentage, setOfferPercentage] = useState("");
  const [startDate, setStartDate] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [maxUsage, setMaxUsage] = useState("");

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

  useEffect(() => {
    dispatch(listOffers());
  }, [dispatch]);

  useEffect(() => {
    if (createSuccess || updateSuccess) {
      toast({
        title: editingId
          ? "Offer updated successfully"
          : "Offer created successfully",
        status: "success",
        isClosable: true,
      });

      dispatch({ type: OFFER_CREATE_RESET });
      dispatch({ type: OFFER_UPDATE_RESET });
      resetForm();
      onClose();
      dispatch(listOffers());
    }

    if (deleteSuccess) {
      toast({
        title: "Offer deleted successfully",
        status: "success",
        isClosable: true,
      });
      dispatch({ type: OFFER_DELETE_RESET });
      dispatch(listOffers());
    }

    if (createError || updateError || deleteError) {
      toast({
        title: createError || updateError || deleteError,
        status: "error",
        isClosable: true,
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
    editingId,
    onClose,
  ]);

  const resetForm = () => {
    setEditingId(null);
    setCode("");
    setOfferPercentage("");
    setStartDate("");
    setExpiryDate("");
    setMaxUsage("");
  };

  const openCreateModal = () => {
    resetForm();
    onOpen();
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

    editingId
      ? dispatch(updateOffer(editingId, offerData))
      : dispatch(createOffer(offerData));
  };

  const editHandler = (offer) => {
    setEditingId(offer._id);
    setCode(offer.code);
    setOfferPercentage(offer.offerPercentage);
    setStartDate(offer.startDate.substring(0, 10));
    setExpiryDate(offer.expiryDate.substring(0, 10));
    setMaxUsage(offer.maxUsage || "");
    onOpen();
  };

  const deleteHandler = (id) => {
    if (window.confirm("Delete this offer?")) {
      dispatch(deleteOffer(id));
    }
  };

  return (
    <Box>
      <Card shadow="md">
        <CardHeader>
          <HStack justify="space-between">
            <Text fontSize="lg" fontWeight="bold">
              Coupon Management
            </Text>
            <Button colorScheme="blue" size="sm" onClick={openCreateModal}>
              + Create Coupon
            </Button>
          </HStack>
        </CardHeader>

        <Divider />

        <CardBody overflowX="auto">
          {loading && <Text mb={3}>Loading...</Text>}

          <Table size="sm">
            <Thead bg="gray.50">
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
                  <Td>
                    <Badge colorScheme="purple">{offer.code}</Badge>
                  </Td>
                  <Td>{offer.offerPercentage}%</Td>
                  <Td>
                    {offer.usedCount || 0} /{" "}
                    {offer.maxUsage === 0 ? "∞" : offer.maxUsage}
                  </Td>
                  <Td>{new Date(offer.startDate).toLocaleDateString()}</Td>
                  <Td>{new Date(offer.expiryDate).toLocaleDateString()}</Td>
                  <Td>
                    <HStack>
                      <Button size="xs" onClick={() => editHandler(offer)}>
                        Edit
                      </Button>
                      <Button
                        size="xs"
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
        </CardBody>
      </Card>

      {/* ===== CREATE / EDIT MODAL ===== */}
      <Modal isOpen={isOpen} onClose={onClose} size="md">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{editingId ? "Edit Offer" : "Create Offer"}</ModalHeader>
          <ModalCloseButton />

          <form onSubmit={submitHandler}>
            <ModalBody>
              <Stack spacing={4}>
                <Input
                  placeholder="Offer Code"
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  required
                />

                <Input
                  type="number"
                  placeholder="Discount %"
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

                <Input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  required
                />

                <Input
                  type="date"
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                  required
                />
              </Stack>
            </ModalBody>

            <ModalFooter>
              <Button colorScheme="blue" type="submit">
                {editingId ? "Update" : "Create"}
              </Button>
              <Button ml={3} variant="ghost" onClick={onClose}>
                Cancel
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default OfferManagementScreen;
