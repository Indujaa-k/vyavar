import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getInvoice } from "../../actions/orderActions";
import {
  Box,
  Text,
  Grid,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  Stack,
  Spinner,
} from "@chakra-ui/react";
import { jsPDF } from "jspdf";
import { useParams } from "react-router-dom";

const InvoiceScreen = ({ match }) => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const invoiceDetails = useSelector((state) => state.invoiceDetails);
  const { loading, error, invoice } = invoiceDetails;

  useEffect(() => {
    dispatch(getInvoice(id));
  }, [dispatch, id]);

  const handleDownloadPDF = () => {
    const doc = new jsPDF();

    doc.text(`Invoice - Order ID: ${invoice.orderId}`, 20, 20);
    doc.text(`Name: ${invoice.user?.name || "N/A"}`, 20, 30);
    doc.text(`Email: ${invoice.user?.email || "N/A"}`, 20, 40);
    doc.text("Items:", 20, 50);

    invoice.orderItems.forEach((item, index) => {
      doc.text(
        `${item.qty} x ${item.name} = $${item.price * item.qty}`,
        20,
        60 + index * 10
      );
    });

    doc.text("Shipping Address:", 20, 60 + invoice.orderItems.length * 10);
    doc.text(
      `${invoice.shippingAddress?.address || "N/A"}, ${
        invoice.shippingAddress?.city || "N/A"
      }, ${invoice.shippingAddress?.postalCode || "N/A"}, ${
        invoice.shippingAddress?.country || "N/A"
      }`,
      20,
      70 + invoice.orderItems.length * 10
    );

    doc.text(
      `Tax: $${invoice.taxPrice || 0}`,
      20,
      80 + invoice.orderItems.length * 10
    );
    doc.text(
      `Shipping: $${invoice.shippingPrice || 0}`,
      20,
      90 + invoice.orderItems.length * 10
    );
    doc.text(
      `Total: $${invoice.totalPrice || 0}`,
      20,
      100 + invoice.orderItems.length * 10
    );
    doc.text(
      `${invoice.isPaid ? `Paid at ${invoice.paidAt}` : "Not Paid"}`,
      20,
      110 + invoice.orderItems.length * 10
    );

    doc.save("invoice.pdf");
  };

  return (
    <Box p={5} bg={"white"}>
      <Text fontSize="2xl" fontWeight="bold" mb={5}>
        Invoice
      </Text>
      {loading ? (
        <Spinner size="xl" />
      ) : error ? (
        <Text color="red.500">{error}</Text>
      ) : invoice ? (
        <Box borderWidth={1} borderRadius="md" p={5} boxShadow="lg">
          <Grid templateColumns="repeat(2, 1fr)" gap={6}>
            <Box>
              <Text fontSize="xl" fontWeight="bold">
                Order ID: {invoice.orderId}
              </Text>
              <Text>Name: {invoice.user?.name || "N/A"}</Text>
              <Text>Email: {invoice.user?.email || "N/A"}</Text>
            </Box>
            <Box>
              <Text fontSize="xl" fontWeight="bold">
                Shipping Address
              </Text>
              <Text>
                {invoice.shippingAddress?.doorNo},
                {invoice.shippingAddress?.street},
                {invoice.shippingAddress?.nearestLandmark},
                {invoice.shippingAddress?.city},
                {/* {invoice.shippingAddress?.doorNo}, */}
                {invoice.shippingAddress?.state},{invoice.shippingAddress?.pin},
                {invoice.shippingAddress?.country},
                {invoice.shippingAddress?.phoneNumber},
              </Text>
            </Box>
          </Grid>

          <Box mt={6}>
            <Text fontSize="xl" fontWeight="bold" mb={3}>
              Items
            </Text>
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>Qty</Th>
                  <Th>Name</Th>
                  <Th>Price</Th>
                </Tr>
              </Thead>
              <Tbody>
                {invoice.orderItems && invoice.orderItems.length > 0 ? (
                  invoice.orderItems.map((item, index) => (
                    <Tr key={index}>
                      <Td>{item.qty}</Td>
                      <Td>{item.name}</Td>
                      <Td>${item.price * item.qty}</Td>
                    </Tr>
                  ))
                ) : (
                  <Tr>
                    <Td colSpan={3}>No items in the order.</Td>
                  </Tr>
                )}
              </Tbody>
            </Table>
          </Box>

          <Box mt={6}>
            <Text fontSize="xl" fontWeight="bold" mb={3}>
              Summary
            </Text>
            <Text>Tax: ${invoice.taxPrice || 0}</Text>
            <Text>Shipping: ${invoice.shippingPrice || 0}</Text>
            <Text>Total: ${invoice.totalPrice || 0}</Text>
            <Text>
              {invoice.isPaid ? `Paid at ${invoice.paidAt}` : "Not Paid"}
            </Text>
          </Box>

          <Stack direction="row" spacing={4} mt={6}>
            <Button colorScheme="teal" onClick={handleDownloadPDF}>
              Download PDF
            </Button>
          </Stack>
        </Box>
      ) : (
        <Text>No invoice found.</Text>
      )}
    </Box>
  );
};

export default InvoiceScreen;
