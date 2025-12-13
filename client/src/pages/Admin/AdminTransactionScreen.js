import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Heading,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Textarea,
  FormControl,
  FormLabel,
  useDisclosure,
  Alert,
  AlertIcon,
  Flex,
  Skeleton,
  SkeletonText,
} from "@chakra-ui/react";
import {
  fetchPendingDeposits,
  fetchPendingWithdrawals,
  confirmDeposit,
  approveWithdrawal,
  rejectWithdrawal,
} from "../../actions/transactionActions";

const AdminTransactionsScreen = () => {
  const dispatch = useDispatch();
  const [key, setKey] = useState("deposits");
  const [rejectReason, setRejectReason] = useState("");
  const [currentTx, setCurrentTx] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const {
    loading: loadingDeposits,
    error: errorDeposits,
    deposits,
  } = useSelector((state) => state.adminPendingDeposits);
  const {
    loading: loadingWithdrawals,
    error: errorWithdrawals,
    withdrawals,
  } = useSelector((state) => state.adminPendingWithdrawals);

  useEffect(() => {
    if (key === "deposits") {
      dispatch(fetchPendingDeposits());
    } else {
      dispatch(fetchPendingWithdrawals());
    }
  }, [dispatch, key]);

  const handleApproveDeposit = (orderId, txId) => {
    dispatch(confirmDeposit(orderId, txId));
  };

  const handleApproveWithdrawal = (orderId, txId) => {
    dispatch(approveWithdrawal(orderId, txId));
  };

  const handleRejectWithdrawal = (orderId, txId) => {
    dispatch(rejectWithdrawal(orderId, txId, rejectReason));
    onClose();
    setRejectReason("");
  };

  const openRejectModal = (tx) => {
    setCurrentTx(tx);
    onOpen();
  };

  const LoadingSkeletonRow = () => (
    <Tr>
      <Td colSpan={5}>
        <Skeleton height="20px" my="10px" />
        <SkeletonText noOfLines={3} spacing="3" />
      </Td>
    </Tr>
  );

  return (
    <Box maxW="container.xl" mx="auto" mt={8} p={4}>
      <Heading as="h2" size="lg" mb={6}>
        Pending Transactions
      </Heading>

      <Tabs
        isFitted
        variant="enclosed"
        onChange={(index) => setKey(index === 0 ? "deposits" : "withdrawals")}
      >
        <TabList mb="1em">
          <Tab>Deposits</Tab>
          <Tab>Withdrawals</Tab>
        </TabList>
        <TabPanels>
          <TabPanel p={0}>
            {errorDeposits ? (
              <Alert status="error" mb={4}>
                <AlertIcon />
                {errorDeposits}
              </Alert>
            ) : (
              <Table variant="striped" colorScheme="gray" size="sm">
                <Thead>
                  <Tr>
                    <Th>DATE</Th>
                    <Th>DELIVERY PERSON</Th>
                    <Th>ORDER</Th>
                    <Th>AMOUNT</Th>
                    <Th>ACTIONS</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {loadingDeposits ? (
                    <LoadingSkeletonRow />
                  ) : deposits?.length > 0 ? (
                    deposits.map((tx) => (
                      <Tr key={tx._id}>
                        <Td>{new Date(tx.createdAt).toLocaleDateString()}</Td>
                        <Td>{tx.deliveryPersonName}</Td>
                        <Td>{tx.orderNumber}</Td>
                        <Td>${tx.amount.toFixed(2)}</Td>
                        <Td>
                          <Button
                            colorScheme="green"
                            size="sm"
                            onClick={() =>
                              handleApproveDeposit(tx.orderId, tx._id)
                            }
                          >
                            Approve
                          </Button>
                        </Td>
                      </Tr>
                    ))
                  ) : (
                    <Tr>
                      <Td colSpan={5} textAlign="center">
                        No pending deposits
                      </Td>
                    </Tr>
                  )}
                </Tbody>
              </Table>
            )}
          </TabPanel>
          <TabPanel p={0}>
            {errorWithdrawals ? (
              <Alert status="error" mb={4}>
                <AlertIcon />
                {errorWithdrawals}
              </Alert>
            ) : (
              <>
                <Table variant="striped" colorScheme="gray" size="sm">
                  <Thead>
                    <Tr>
                      <Th>DATE</Th>
                      <Th>DELIVERY PERSON</Th>
                      <Th>ORDER</Th>
                      <Th>AMOUNT</Th>
                      <Th>ACTIONS</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {loadingWithdrawals ? (
                      <LoadingSkeletonRow />
                    ) : withdrawals?.length > 0 ? (
                      withdrawals.map((tx) => (
                        <Tr key={tx._id}>
                          <Td>{new Date(tx.createdAt).toLocaleDateString()}</Td>
                          <Td>{tx.deliveryPersonName}</Td>
                          <Td>{tx.orderNumber}</Td>
                          <Td>${tx.amount.toFixed(2)}</Td>
                          <Td>
                            <Flex gap={2}>
                              <Button
                                colorScheme="green"
                                size="sm"
                                onClick={() =>
                                  handleApproveWithdrawal(tx.orderId, tx._id)
                                }
                              >
                                Approve
                              </Button>
                              <Button
                                colorScheme="red"
                                size="sm"
                                onClick={() => openRejectModal(tx)}
                              >
                                Reject
                              </Button>
                            </Flex>
                          </Td>
                        </Tr>
                      ))
                    ) : (
                      <Tr>
                        <Td colSpan={5} textAlign="center">
                          No pending withdrawals
                        </Td>
                      </Tr>
                    )}
                  </Tbody>
                </Table>

                <Modal isOpen={isOpen} onClose={onClose}>
                  <ModalOverlay />
                  <ModalContent>
                    <ModalHeader>Reject Withdrawal</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                      <FormControl>
                        <FormLabel>Reason for Rejection</FormLabel>
                        <Textarea
                          rows={3}
                          value={rejectReason}
                          onChange={(e) => setRejectReason(e.target.value)}
                          placeholder="Enter reason for rejecting this withdrawal request"
                        />
                      </FormControl>
                    </ModalBody>
                    <ModalFooter>
                      <Button mr={3} onClick={onClose}>
                        Cancel
                      </Button>
                      <Button
                        colorScheme="red"
                        onClick={() =>
                          handleRejectWithdrawal(
                            currentTx.orderId,
                            currentTx._id
                          )
                        }
                        isDisabled={!rejectReason}
                      >
                        Confirm Reject
                      </Button>
                    </ModalFooter>
                  </ModalContent>
                </Modal>
              </>
            )}
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
};

export default AdminTransactionsScreen;
