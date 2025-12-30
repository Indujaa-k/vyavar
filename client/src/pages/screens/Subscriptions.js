import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Text,
  Spinner,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Flex,
  IconButton,
  useDisclosure,
  Tooltip,
} from "@chakra-ui/react";
import { EditIcon, DeleteIcon } from "@chakra-ui/icons";
import { useDispatch, useSelector } from "react-redux";
import {
  listSubscriptions,
  deleteSubscription,
} from "../../actions/subscriptionActions";
import CreateSubscriptionModal from "./CreateSubscriptionModal";

const Subscriptions = () => {
  const dispatch = useDispatch();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [editSubscription, setEditSubscription] = useState(null);

  const { loading, error, subscriptions } = useSelector(
    (state) => state.subscriptionList
  );

  const { success: deleteSuccess } = useSelector(
    (state) => state.subscriptionDelete
  );

  const { success: updateSuccess } = useSelector(
    (state) => state.subscriptionUpdate
  );

  const { success: createSuccess } = useSelector(
    (state) => state.subscriptionCreate
  );

  useEffect(() => {
    dispatch(listSubscriptions());
  }, [dispatch]);

  // Fetch again after create / update / delete
  useEffect(() => {
    if (createSuccess || updateSuccess || deleteSuccess) {
      dispatch(listSubscriptions());
    }

    if (createSuccess) dispatch({ type: "SUBSCRIPTION_CREATE_RESET" });
    if (updateSuccess) dispatch({ type: "SUBSCRIPTION_UPDATE_RESET" });
    if (deleteSuccess) dispatch({ type: "SUBSCRIPTION_DELETE_RESET" });
  }, [dispatch, createSuccess, updateSuccess, deleteSuccess]);

  const deleteHandler = (id) => {
    if (window.confirm("Are you sure?")) {
      dispatch(deleteSubscription(id));
    }
  };

  const editHandler = (subscription) => {
    setEditSubscription(subscription);
    onOpen();
  };

  const closeModal = () => {
    setEditSubscription(null);
    onClose();
  };

  const hasSubscription = subscriptions.length >= 1;

  const getDaysLeft = (endDate) => {
    const today = new Date();
    const end = new Date(endDate);

    const diffTime = end - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return diffDays > 0 ? diffDays : 0;
  };

  return (
    <Box p={6} mt={6}>
      <Flex justify="space-between" mb={6}>
        <Text fontSize="2xl" fontWeight="bold">
          Subscriptions
        </Text>
        <Tooltip
          label="Only one subscription is allowed at a time"
          placement="bottom-start"
          hasArrow
          isDisabled={!hasSubscription}
        >
          <Box>
            <Button
              colorScheme="teal"
              onClick={onOpen}
              isDisabled={hasSubscription}
            >
              Create Subscription
            </Button>
          </Box>
        </Tooltip>
      </Flex>

      <CreateSubscriptionModal
        isOpen={isOpen}
        onClose={closeModal}
        subscription={editSubscription}
      />

      {loading ? (
        <Spinner />
      ) : error ? (
        <Text color="red.500">{error}</Text>
      ) : subscriptions.length === 0 ? (
        <Text>No subscriptions found</Text>
      ) : (
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Plan</Th>
              <Th>Type</Th>
              <Th>Price</Th>
              <Th>Discount</Th>
              <Th>Start Date</Th>
              <Th>End Date</Th>
              <Th>Duration</Th>
              <Th>Days Left</Th>
              <Th>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {subscriptions.map((sub) => (
              <Tr key={sub._id}>
                <Td fontWeight="bold">{sub.planName}</Td>
                <Td>{sub.planType}</Td>
                <Td>₹{sub.price}</Td>
                <Td>{sub.discountPercent || 0}%</Td>
                <Td>{new Date(sub.startDate).toLocaleDateString()}</Td>
                <Td>{new Date(sub.endDate).toLocaleDateString()}</Td>
                <Td>{sub.durationInDays} days</Td>
                <Td>{getDaysLeft(sub.endDate)} days</Td>
                <Td>
                  <IconButton
                    icon={<EditIcon />}
                    size="sm"
                    mr={2}
                    onClick={() => editHandler(sub)}
                  />
                  <IconButton
                    icon={<DeleteIcon />}
                    size="sm"
                    colorScheme="red"
                    onClick={() => deleteHandler(sub._id)}
                  />
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      )}
    </Box>
  );
};

export default Subscriptions;
