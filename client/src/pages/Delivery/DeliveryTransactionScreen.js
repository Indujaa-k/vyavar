import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Heading,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  Card,
  CardBody,
  Badge,
  Alert,
  AlertIcon,
  Flex,
  Text,
  Link,
  Skeleton,
  SkeletonText,
} from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import { getMyTransactions } from "../../actions/transactionActions";

const DeliveryTransactionsScreen = () => {
  const dispatch = useDispatch();

  const { loading, error, transactions } = useSelector(
    (state) => state.deliveryMyTransactions
  );

  useEffect(() => {
    dispatch(getMyTransactions());
  }, [dispatch]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const LoadingSkeletonRow = () => (
    <Tr>
      <Td colSpan={6}>
        <Skeleton height="20px" my="10px" />
        <SkeletonText noOfLines={4} spacing="3" />
      </Td>
    </Tr>
  );

  return (
    <Box maxW="container.xl" mx="auto" mt={8} p={4}>
      <Heading as="h2" size="lg" mb={6}>
        My Transactions
      </Heading>
      <Card>
        <CardBody>
          <Flex justify="space-between" mb={6}>
            <Button
              colorScheme="blue"
              onClick={() => dispatch(getMyTransactions())}
            >
              Refresh
            </Button>
            <Box>
              <Text fontWeight="bold" display="inline">
                Current Balance:
              </Text>{" "}
              ${transactions?.balance?.toFixed(2) || "0.00"}
            </Box>
          </Flex>

          {error ? (
            <Alert status="error" mb={4}>
              <AlertIcon />
              {error}
            </Alert>
          ) : (
            <Table variant="striped" colorScheme="gray" size="sm">
              <Thead>
                <Tr>
                  <Th>DATE</Th>
                  <Th>ORDER</Th>
                  <Th>TYPE</Th>
                  <Th>AMOUNT</Th>
                  <Th>STATUS</Th>
                  <Th>NOTES</Th>
                </Tr>
              </Thead>
              <Tbody>
                {loading ? (
                  <LoadingSkeletonRow />
                ) : transactions?.length > 0 ? (
                  transactions.map((tx) => (
                    <Tr key={tx._id}>
                      <Td>{formatDate(tx.createdAt)}</Td>
                      <Td>
                        <Link
                          as={RouterLink}
                          to={`/order/${tx.orderId}`}
                          color="blue.500"
                        >
                          {tx.orderNumber}
                        </Link>
                      </Td>
                      <Td>
                        {tx.type === "deposit" ? (
                          <Badge colorScheme="blue">Deposit</Badge>
                        ) : (
                          <Badge colorScheme="yellow">Withdrawal</Badge>
                        )}
                      </Td>
                      <Td>${tx.amount.toFixed(2)}</Td>
                      <Td>
                        {tx.status === "approved" ? (
                          <Badge colorScheme="green">Approved</Badge>
                        ) : tx.status === "rejected" ? (
                          <Badge colorScheme="red">Rejected</Badge>
                        ) : (
                          <Badge colorScheme="gray">Pending</Badge>
                        )}
                      </Td>
                      <Td>
                        {tx.rejectionReason && (
                          <Alert
                            status="error"
                            variant="subtle"
                            fontSize="sm"
                            p={2}
                          >
                            <AlertIcon boxSize={4} />
                            {tx.rejectionReason}
                          </Alert>
                        )}
                      </Td>
                    </Tr>
                  ))
                ) : (
                  <Tr>
                    <Td colSpan={6} textAlign="center">
                      No transactions found
                    </Td>
                  </Tr>
                )}
              </Tbody>
            </Table>
          )}
        </CardBody>
      </Card>
    </Box>
  );
};

export default DeliveryTransactionsScreen;
