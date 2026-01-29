import React, { useEffect, useState, useRef } from "react";
import {
  Box,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Text,
  Spinner,
  Badge,
  Flex,
  VStack,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import {
  listSubscriptions,
  toggleSubscription,
  deleteSubscription,
} from "../../actions/subscriptionActions";
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
} from "@chakra-ui/react";

import CreateSubscriptionModal from "./CreateSubscriptionModal";
import EditSubscriptionModal from "./EditSubscriptionModal";
import { SUBSCRIPTION_DELETE_RESET } from "../../constants/subscriptionConstants";

const Subscriptions = () => {
  const dispatch = useDispatch();
  const toast = useToast();

  const createModal = useDisclosure();
  const editModal = useDisclosure();
  const deleteModal = useDisclosure();
  const cancelRef = useRef();

  const [selectedSubscription, setSelectedSubscription] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  // ===== REDUX STATES =====
  const { loading, subscriptions, error } = useSelector(
    (state) => state.subscriptionList
  );

  const { success: createSuccess } = useSelector(
    (state) => state.subscriptionCreate
  );

  const { success: updateSuccess } = useSelector(
    (state) => state.subscriptionUpdate
  );

  const { success: toggleSuccess } = useSelector(
    (state) => state.subscriptionToggle
  );

  const subscriptionDelete = useSelector(
    (state) => state.subscriptionDelete
  );
  const { success: deleteSuccess, error: deleteError } = subscriptionDelete;

  // ===== EFFECTS =====
  useEffect(() => {
    dispatch(listSubscriptions());
  }, [dispatch, toggleSuccess, createSuccess, updateSuccess, deleteSuccess]);

  useEffect(() => {
    if (deleteSuccess) {
      toast({
        title: "Subscription deleted",
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "top",
      });

      dispatch({ type: SUBSCRIPTION_DELETE_RESET });
    }
  }, [deleteSuccess, toast, dispatch]);

  useEffect(() => {
    if (deleteError) {
      toast({
        title: "Delete failed",
        description: deleteError,
        status: "error",
        duration: 4000,
        isClosable: true,
        position: "top",
      });
    }
  }, [deleteError, toast]);

  // ===== HANDLERS =====
  const toggleHandler = (id) => {
    dispatch(toggleSubscription(id));
  };

  const editHandler = (subscription) => {
    setSelectedSubscription(subscription);
    editModal.onOpen();
  };

  const openDeleteModal = (id) => {
    setDeleteId(id);
    deleteModal.onOpen();
  };

  const confirmDelete = () => {
    dispatch(deleteSubscription(deleteId));
    deleteModal.onClose();
  };

  // ===== UI =====
  return (
    <>
      <Box p={6}>
        <Flex justify="space-between" mb={5}>
          <Text fontSize="2xl" fontWeight="bold">
            Subscriptions
          </Text>
          <Button colorScheme="blue" onClick={createModal.onOpen}>
            Create Subscription
          </Button>
        </Flex>

        {loading ? (
          <Spinner />
        ) : error ? (
          <Text color="red.500">{error}</Text>
        ) : subscriptions?.length === 0 ? (
          <Text textAlign="center" color="gray.500" fontSize="lg" mt={10}>
            No subscriptions found
          </Text>
        ) : (
          <Table variant="simple">
            <Thead bg="gray.100">
              <Tr>
                <Th>Price</Th>
                <Th>Discount (%)</Th>
                <Th>Start Date</Th>
                <Th>End Date</Th>
                <Th>Duration</Th>
                <Th>Status</Th>
                <Th>Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {subscriptions.map((sub) => {
                const isExpired = new Date(sub.endDate) < new Date();

                return (
                  <React.Fragment key={sub._id}>
                    <Tr bg="gray.50">
                      <Td>₹{sub.price}</Td>
                      <Td>{sub.discountPercent}%</Td>
                      <Td>{new Date(sub.startDate).toLocaleDateString()}</Td>
                      <Td>{new Date(sub.endDate).toLocaleDateString()}</Td>
                      <Td>{sub.durationInDays}</Td>
                      <Td>
                        {sub.isActive ? (
                          <Badge colorScheme="green">Active</Badge>
                        ) : isExpired ? (
                          <Badge colorScheme="gray">Expired</Badge>
                        ) : (
                          <Badge colorScheme="red">Inactive</Badge>
                        )}
                      </Td>
                      <Td>
                        <Flex gap={2} wrap="wrap">
                          <Button
                            size="sm"
                            colorScheme={sub.isActive ? "red" : "green"}
                            onClick={() => toggleHandler(sub._id)}
                            isDisabled={!sub.isActive && isExpired}
                          >
                            {sub.isActive ? "Deactivate" : "Activate"}
                          </Button>

                          <Button
                            size="sm"
                            colorScheme="blue"
                            onClick={() => editHandler(sub)}
                          >
                            Edit
                          </Button>

                          {!sub.isActive && (
                            <Button
                              size="sm"
                              colorScheme="red"
                              onClick={() => openDeleteModal(sub._id)}
                            >
                              Delete
                            </Button>
                          )}
                        </Flex>
                      </Td>
                    </Tr>

                    <Tr>
                      <Td colSpan={10}>
                        <Text fontWeight="bold">Title</Text>
                        {sub.title}
                      </Td>
                    </Tr>

                    <Tr>
                      <Td colSpan={10}>
                        <Text fontWeight="bold">Description</Text>
                        {sub.description}
                      </Td>
                    </Tr>

                    <Tr>
                      <Td colSpan={10}>
                        <Text fontWeight="bold">Offers</Text>
                        <VStack align="start">
                          {sub.offers?.map((offer, i) => (
                            <Text key={i}>• {offer}</Text>
                          ))}
                        </VStack>
                      </Td>
                    </Tr>
                  </React.Fragment>
                );
              })}
            </Tbody>
          </Table>
        )}

        <CreateSubscriptionModal
          isOpen={createModal.isOpen}
          onClose={createModal.onClose}
        />

        {selectedSubscription && (
          <EditSubscriptionModal
            isOpen={editModal.isOpen}
            onClose={editModal.onClose}
            subscription={selectedSubscription}
          />
        )}
      </Box>

      <AlertDialog
        isOpen={deleteModal.isOpen}
        leastDestructiveRef={cancelRef}
        onClose={deleteModal.onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete Subscription
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure? This action cannot be undone.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={deleteModal.onClose}>
                Cancel
              </Button>
              <Button colorScheme="red" onClick={confirmDelete} ml={3}>
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
};

export default Subscriptions;
