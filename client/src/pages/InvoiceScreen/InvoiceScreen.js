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
    if (!invoice) return;

    const doc = new jsPDF();
    let y = 20;

    // ===== TITLE =====
    doc.setFontSize(16);
    doc.text("INVOICE", 20, y);
    y += 10;

    // ===== BASIC INFO =====
    doc.setFontSize(10);
    doc.text(`Order ID: ${invoice.orderId}`, 20, y);
    y += 6;
    doc.text(`Name: ${invoice.user?.name || "N/A"}`, 20, y);
    y += 6;
    doc.text(`Email: ${invoice.user?.email || "N/A"}`, 20, y);
    y += 10;

    // ===== SHIPPING ADDRESS =====
    doc.setFontSize(12);
    doc.text("Shipping Address:", 20, y);
    y += 6;

    doc.setFontSize(10);
    const addr = invoice.shippingAddress || {};

    const addressLines = [
      addr.doorNo,
      addr.street,
      addr.nearestLandmark,
      `${addr.city || ""}, ${addr.state || ""}`,
      addr.pin,
      addr.country,
      `Phone: ${addr.phoneNumber || ""}`,
    ].filter(Boolean);

    addressLines.forEach((line) => {
      doc.text(String(line), 20, y);
      y += 5;
    });

    y += 6;

    // ===== ITEMS HEADER =====
    doc.setFontSize(12);
    doc.text("Items", 20, y);
    y += 8;

    doc.setFontSize(10);
    doc.text("Qty", 20, y);
    doc.text("Product", 40, y);
    doc.text("Size", 120, y);
    doc.text("Amount", 160, y);
    y += 4;

    doc.line(20, y, 190, y);
    y += 6;

    // ===== ITEMS ROWS =====
    invoice.orderItems.forEach((item) => {
      if (y > 270) {
        doc.addPage();
        y = 20;
      }

      doc.text(String(item.qty), 20, y);
      doc.text(item.name, 40, y);
      doc.text(item.size || "-", 120, y);
      doc.text(`Rs. ${item.qty * item.price}`, 160, y);
      y += 8;
    });

    y += 6;
    doc.line(20, y, 190, y);
    y += 8;

    // ===== SUMMARY =====
    doc.text(`Tax: Rs. ${invoice.taxPrice}`, 20, y);
    y += 6;
    doc.text(`Shipping: Rs. ${invoice.shippingPrice}`, 20, y);
    y += 6;

    doc.setFontSize(12);
    doc.text(`Total: Rs. ${invoice.totalPrice}`, 20, y);
    y += 8;

    doc.setFontSize(10);
    doc.text(
      invoice.isPaid
        ? `Paid at: ${new Date(invoice.paidAt).toLocaleString()}`
        : "Payment Status: Not Paid",
      20,
      y
    );

    // ===== SAVE =====
    doc.save(`invoice_${invoice.orderId}.pdf`);
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
                  <Th>Size</Th>
                  <Th>Price</Th>
                </Tr>
              </Thead>
              <Tbody>
                {invoice.orderItems && invoice.orderItems.length > 0 ? (
                  invoice.orderItems.map((item, index) => (
                    <Tr key={index}>
                      <Td>{item.qty}</Td>
                      <Td>{item.name}</Td>
                      <Td>{item.size}</Td>
                      <Td>₹{item.price * item.qty}</Td>
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
            <Text>Tax: ₹{invoice.taxPrice || 0}</Text>
            <Text>Shipping: ₹{invoice.shippingPrice || 0}</Text>
            <Text>Total: ₹{invoice.totalPrice || 0}</Text>
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
