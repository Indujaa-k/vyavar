import React, { useEffect, useState } from "react";
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
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import {
  listSubscriptions,
  toggleSubscription,
} from "../../actions/subscriptionActions";
import CreateSubscriptionModal from "./CreateSubscriptionModal";
import EditSubscriptionModal from "./EditSubscriptionModal";

const Subscriptions = () => {
  const dispatch = useDispatch();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const editModal = useDisclosure();
  const [selectedSubscription, setSelectedSubscription] = useState(null);

  const subscriptionCreate = useSelector((state) => state.subscriptionCreate);
  const { success: createSuccess } = subscriptionCreate;

  const subscriptionUpdate = useSelector((state) => state.subscriptionUpdate);
  const { success: updateSuccess } = subscriptionUpdate;

  const subscriptionList = useSelector((state) => state.subscriptionList);
  const { loading, subscriptions, error } = subscriptionList;

  const subscriptionToggle = useSelector((state) => state.subscriptionToggle);
  const { loading: toggleLoading, success: toggleSuccess } = subscriptionToggle;

  useEffect(() => {
    dispatch(listSubscriptions());
  }, [dispatch, toggleSuccess, createSuccess, updateSuccess]);

  const toggleHandler = (id) => {
    dispatch(toggleSubscription(id));
  };

  const editHandler = (subscription) => {
    setSelectedSubscription(subscription);
    editModal.onOpen();
  };

  return (
    <Box p={6} mt={6}>
      <Flex justify="space-between" mb={5}>
        <Text fontSize="2xl" fontWeight="bold">
          Subscriptions
        </Text>
        <Button colorScheme="blue" onClick={onOpen}>
          Create Subscription
        </Button>
      </Flex>

      {loading ? (
        <Spinner />
      ) : error ? (
        <Text color="red.500">{error}</Text>
      ) : (
        <Table variant="simple">
          <Thead bg="gray.100">
            <Tr>
              {/* <Th colSpan={3} textAlign="center">
                Subscription Details
              </Th> */}
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
            {subscriptions?.map((sub) => (
              <React.Fragment key={sub._id}>
                {/* ROW 1 → Price row */}
                <Tr bg="gray.50">
                  <Td>₹{sub.price}</Td>
                  <Td>{sub.discountPercent}%</Td>
                  <Td>{new Date(sub.startDate).toLocaleDateString()}</Td>
                  <Td>{new Date(sub.endDate).toLocaleDateString()}</Td>
                  <Td>{sub.durationInDays}</Td>
                  <Td>
                    <Badge colorScheme={sub.isActive ? "green" : "red"}>
                      {sub.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </Td>
                  <Td>
                    <Flex gap={2}>
                      <Button
                        size="sm"
                        colorScheme={sub.isActive ? "red" : "green"}
                        onClick={() => toggleHandler(sub._id)}
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
                    </Flex>
                  </Td>
                </Tr>

                {/* ROW 2 → Title */}
                <Tr>
                  <Td colSpan={10}>
                    <Text fontWeight="bold">Title</Text>
                    {sub.title}
                  </Td>
                </Tr>

                {/* ROW 3 → Description */}
                <Tr>
                  <Td colSpan={10}>
                    <Text fontWeight="bold">Description</Text>
                    {sub.description}
                  </Td>
                </Tr>

                {/* ROW 4 → Offers */}
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
            ))}
          </Tbody>
        </Table>
      )}

      {/* CREATE MODAL */}
      <CreateSubscriptionModal isOpen={isOpen} onClose={onClose} />

      {/* EDIT MODAL */}
      {selectedSubscription && (
        <EditSubscriptionModal
          isOpen={editModal.isOpen}
          onClose={editModal.onClose}
          subscription={selectedSubscription}
        />
      )}
    </Box>
  );
};

export default Subscriptions;
