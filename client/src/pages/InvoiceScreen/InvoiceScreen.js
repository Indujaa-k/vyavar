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
  Divider,
  Flex,
  Badge,
} from "@chakra-ui/react";
import { jsPDF } from "jspdf";
import { useParams } from "react-router-dom";

import stampLogo from "../../assets/about/stamp.png";

const FROM_NAME = "Viyavar Fashions";
const FROM_ADDRESS = [
  "173A, Anna Nagar, Industrial Estate",
  "Karur, Tamil Nadu – 639004",
  "India",
];

const LOGO_W = 15;
const LOGO_H = 18;

const getCompressedLogoBase64 = (url) =>
  new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const TARGET_W = 80;
      const TARGET_H = Math.round((img.naturalHeight / img.naturalWidth) * TARGET_W);
      const canvas = document.createElement("canvas");
      canvas.width = TARGET_W;
      canvas.height = TARGET_H;
      const ctx = canvas.getContext("2d");
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, TARGET_W, TARGET_H);
      ctx.drawImage(img, 0, 0, TARGET_W, TARGET_H);
      resolve(canvas.toDataURL("image/jpeg", 0.7));
    };
    img.onerror = reject;
    img.src = url;
  });

const InvoiceScreen = ({ match }) => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const invoiceDetails = useSelector((state) => state.invoiceDetails);
  const { loading, error, invoice } = invoiceDetails;

  useEffect(() => {
    dispatch(getInvoice(id));
  }, [dispatch, id]);

  const hasCoupon =
    invoice?.pricing?.coupon &&
    Number(invoice.pricing.coupon.discountAmount) > 0;

  const cgst =
    invoice?.pricing?.cgstPrice != null
      ? invoice.pricing.cgstPrice
      : Math.round(((invoice?.pricing?.taxPrice || 0) / 2) * 100) / 100;
  const sgst =
    invoice?.pricing?.sgstPrice != null
      ? invoice.pricing.sgstPrice
      : Math.round(((invoice?.pricing?.taxPrice || 0) / 2) * 100) / 100;

  // ── Download PDF ────────────────────────────────────────────────────────────
  const handleDownloadPDF = async () => {
    if (!invoice) return;

    let logoBase64 = null;
    try {
      logoBase64 = await getCompressedLogoBase64(stampLogo);
    } catch (err) {
      console.warn("Logo could not be loaded, skipping.", err);
    }

    const doc = new jsPDF({ unit: "mm", format: [120, 150], compress: true });
    const PW = 120;
    let y = 6;

    // ── LOGO ─────────────────────────────────────────────────────────────────
    if (logoBase64) {
      doc.addImage(logoBase64, "JPEG", 7, y, LOGO_W, LOGO_H);
    } else {
      doc.setDrawColor(180, 180, 180);
      doc.setFillColor(240, 240, 240);
      doc.roundedRect(7, y, LOGO_W, LOGO_H, 2, 2, "FD");
      doc.setFontSize(7);
      doc.setTextColor(120, 120, 120);
      doc.setFont(undefined, "bold");
      doc.text("LOGO", 7 + LOGO_W / 2, y + LOGO_H / 2 + 1, { align: "center" });
      doc.setTextColor(0, 0, 0);
    }

    const logoMidY = y + LOGO_H / 2;
    doc.setFontSize(10);
    doc.setFont(undefined, "bold");
    doc.setTextColor(0, 0, 0);
    doc.text(FROM_NAME, 7 + LOGO_W + 3, logoMidY - 1);

    doc.setFontSize(6.5);
    doc.setFont(undefined, "normal");
    doc.setTextColor(100, 100, 100);
    doc.text("Premium Fashion Store", 7 + LOGO_W + 3, logoMidY + 4);
    doc.setTextColor(0, 0, 0);

    y += LOGO_H + 4;

    // ── RULE ─────────────────────────────────────────────────────────────────
    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.3);
    doc.line(8, y, PW - 8, y);
    y += 4;

    // ── INVOICE TITLE + INVOICE NUMBER + ORDER ID ─────────────────────────────
    doc.setFontSize(11);
    doc.setFont(undefined, "bold");
    doc.setTextColor(0, 0, 0);
    doc.text("INVOICE", 8, y);

    if (invoice.invoiceNumber) {
      doc.setFontSize(7);
      doc.setFont(undefined, "bold");
      doc.setTextColor(0, 0, 0);
      doc.text(`#${invoice.invoiceNumber}`, PW - 8, y, { align: "right" });
      y += 4;
      doc.setFontSize(6.5);
      doc.setFont(undefined, "normal");
      doc.setTextColor(100, 100, 100);
      doc.text(`Order ID: ${invoice.orderId}`, PW - 8, y, { align: "right" });
    } else {
      doc.setFontSize(7);
      doc.setFont(undefined, "normal");
      doc.setTextColor(100, 100, 100);
      doc.text(`Order ID: ${invoice.orderId}`, PW - 8, y, { align: "right" });
    }

    doc.setTextColor(0, 0, 0);
    y += 5;

    // ── FROM / TO ─────────────────────────────────────────────────────────────
    const colLeft = 8;
    const colRight = 62;

    doc.setFontSize(6.5);
    doc.setFont(undefined, "bold");
    doc.setTextColor(120, 120, 120);
    doc.text("FROM", colLeft, y);
    doc.text("TO", colRight, y);
    doc.setTextColor(0, 0, 0);
    y += 3.5;

    doc.setFontSize(7.5);
    doc.setFont(undefined, "bold");
    doc.text(FROM_NAME, colLeft, y);
    const toName = invoice.user?.name || "N/A";
    doc.text(toName, colRight, y);
    y += 4;

    doc.setFontSize(6.5);
    doc.setFont(undefined, "bold");
    FROM_ADDRESS.forEach((line) => {
      doc.text(line, colLeft, y);
      y += 3.2;
    });

    let yRight = y - FROM_ADDRESS.length * 3.2;
    const addr = invoice.shippingAddress || {};
    const toLines = [
      [addr.doorNo, addr.street].filter(Boolean).join(", "),
      addr.nearestLandmark,
      [addr.city, addr.state].filter(Boolean).join(", "),
      addr.pin,
      addr.country,
      addr.phoneNumber ? `Ph: ${addr.phoneNumber}` : null,
    ].filter(Boolean);

    doc.setFontSize(6.5);
    doc.setFont(undefined, "bold");
    toLines.forEach((line) => {
      doc.text(String(line), colRight, yRight);
      yRight += 3.2;
    });

    y = Math.max(y, yRight) + 2;

    // ── RULE ─────────────────────────────────────────────────────────────────
    doc.setDrawColor(200, 200, 200);
    doc.line(8, y, PW - 8, y);
    y += 4;

    // ── EMAIL ─────────────────────────────────────────────────────────────────
    doc.setFontSize(6.5);
    doc.setFont(undefined, "normal");
    doc.setTextColor(100, 100, 100);
    doc.text(`Email: ${invoice.user?.email || "N/A"}`, 8, y);
    doc.setTextColor(0, 0, 0);
    y += 5;

    // ── ITEMS TABLE HEADER ────────────────────────────────────────────────────
    // Columns: Qty | Product | HSN | Size | Amount
    doc.setFillColor(245, 245, 245);
    doc.rect(8, y - 3, PW - 16, 7, "F");
    doc.setFontSize(7);
    doc.setFont(undefined, "bold");
    doc.setTextColor(0, 0, 0);
    doc.text("Qty",     10,       y + 1);
    doc.text("Product", 20,       y + 1);
    doc.text("HSN",     72,       y + 1);
    doc.text("Size",    88,       y + 1);
    doc.text("Amount",  102,      y + 1);
    y += 6;

    doc.setDrawColor(220, 220, 220);
    doc.line(8, y, PW - 8, y);
    y += 3;

    // ── ITEM ROWS ─────────────────────────────────────────────────────────────
    doc.setFont(undefined, "normal");
    doc.setFontSize(6.5);
    invoice.orderItems.forEach((item, i) => {
      if (y > 132) { doc.addPage(); y = 8; }
      if (i % 2 === 0) {
        doc.setFillColor(252, 252, 252);
        doc.rect(8, y - 2.5, PW - 16, 5.5, "F");
      }
      const name = item.name.length > 26 ? item.name.slice(0, 24) + ".." : item.name;
      const hsn  = item.hsnCode || "6109"; // ✅ show HSN per item
      doc.text(String(item.qty),    10,  y + 0.5);
      doc.text(name,                20,  y + 0.5);
      doc.text(hsn,                 72,  y + 0.5);
      doc.text(item.size || "-",    88,  y + 0.5);
      doc.text(`Rs.${item.price}`,  102, y + 0.5);
      y += 5.5;
    });

    y += 1;
    doc.setDrawColor(200, 200, 200);
    doc.line(8, y, PW - 8, y);
    y += 4;

    // ── SUMMARY ───────────────────────────────────────────────────────────────
    const sumLabel = 62;
    const sumValue = PW - 8;
    doc.setFontSize(6.5);
    doc.setFont(undefined, "normal");
    doc.setTextColor(80, 80, 80);

    doc.text("CGST @2.5%:", sumLabel, y);
    doc.text(`Rs. ${cgst}`, sumValue, y, { align: "right" });
    y += 4;

    doc.text("SGST @2.5%:", sumLabel, y);
    doc.text(`Rs. ${sgst}`, sumValue, y, { align: "right" });
    y += 4;

    doc.text("Shipping:", sumLabel, y);
    doc.text(`Rs. ${invoice.pricing?.shippingPrice || 0}`, sumValue, y, { align: "right" });
    y += 4;

    if (hasCoupon) {
      doc.setTextColor(20, 140, 80);
      doc.text(`Coupon (${invoice.pricing.coupon.code}):`, sumLabel, y);
      doc.text(`-Rs. ${invoice.pricing.coupon.discountAmount}`, sumValue, y, { align: "right" });
      doc.setTextColor(0, 0, 0);
      y += 4;
    }

    doc.setFillColor(30, 30, 30);
    doc.rect(8, y - 3, PW - 16, 8, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(8);
    doc.setFont(undefined, "bold");
    doc.text("TOTAL", 12, y + 2);
    doc.text(`Rs. ${invoice.pricing?.totalPrice || 0}`, sumValue - 2, y + 2, { align: "right" });
    doc.setTextColor(0, 0, 0);
    y += 11;

    // ── PAYMENT STATUS ────────────────────────────────────────────────────────
    doc.setFontSize(6.5);
    doc.setFont(undefined, "normal");
    doc.setTextColor(80, 80, 80);
    doc.text(
      invoice.paymentStatus?.isPaid
        ? `Paid on ${new Date(invoice.paymentStatus.paidAt).toLocaleDateString()}`
        : "Payment Pending",
      8,
      y
    );

    // ── FOOTER ────────────────────────────────────────────────────────────────
    doc.setTextColor(160, 160, 160);
    doc.setFontSize(5.5);
    doc.text("Thank you for shopping with Viyavar Fashions!", PW / 2, 146, {
      align: "center",
    });

    const filename = invoice.invoiceNumber
      ? `invoice_${invoice.invoiceNumber}.pdf`
      : `invoice_${invoice.orderId}.pdf`;

    doc.save(filename);
  };

  // ── UI ─────────────────────────────────────────────────────────────────────
  return (
    <Box
      px={{ base: 3, sm: 5, md: 8 }}
      py={{ base: 4, md: 6 }}
      mt={{ base: "60px", md: "50px" }}
      bg="white"
      minH="100vh"
    >
      <Text fontSize={{ base: "xl", md: "2xl" }} fontWeight="bold" mb={5}>
        Invoice
      </Text>

      {loading ? (
        <Flex justify="center" align="center" minH="200px">
          <Spinner size="xl" color="teal.500" />
        </Flex>
      ) : error ? (
        <Box bg="red.50" border="1px solid" borderColor="red.200" borderRadius="md" p={4}>
          <Text color="red.600" fontWeight="medium">{error}</Text>
        </Box>
      ) : invoice ? (
        <Box
          borderWidth={1}
          borderRadius="lg"
          p={{ base: 4, sm: 5, md: 6 }}
          boxShadow="lg"
          maxW="900px"
          mx="auto"
        >
          {/* ── FROM (Company Address) ── */}
          <Flex
            mb={4}
            p={{ base: 3, md: 4 }}
            bg="gray.50"
            borderRadius="md"
            align="center"
            gap={{ base: 3, md: 4 }}
            flexWrap="wrap"
          >
            <Box
              as="img"
              src={stampLogo}
              alt="Viyavar Fashions Logo"
              width={{ base: "60px", sm: "75px", md: "100px" }}
              height="auto"
              objectFit="contain"
              flexShrink={0}
            />
            <Box lineHeight="1.5">
              <Text
                fontWeight="bold"
                fontSize="xs"
                color="gray.400"
                mb={0.5}
                letterSpacing="wider"
                textTransform="uppercase"
              >
                From
              </Text>
              <Text fontWeight="bold" fontSize={{ base: "md", md: "lg" }} mb={0}>
                {FROM_NAME}
              </Text>
              {FROM_ADDRESS.map((line, i) => (
                <Text
                  key={i}
                  fontWeight="bold"
                  fontSize={{ base: "xs", md: "sm" }}
                  color="gray.700"
                  lineHeight="1.55"
                >
                  {line}
                </Text>
              ))}
            </Box>
          </Flex>

          <Divider mb={4} />

          {/* ── Invoice Number Banner ── */}
          {invoice.invoiceNumber && (
            <Flex
              mb={4}
              px={4}
              py={2}
              bg="teal.50"
              borderRadius="md"
              align="center"
              justify="space-between"
              flexWrap="wrap"
              gap={2}
            >
              <Text fontSize="xs" color="teal.600" fontWeight="bold" letterSpacing="wider" textTransform="uppercase">
                Invoice Number
              </Text>
              <Badge colorScheme="teal" fontSize={{ base: "sm", md: "md" }} px={3} py={1} borderRadius="full">
                {invoice.invoiceNumber}
              </Badge>
            </Flex>
          )}

          {/* ── Order Info + TO Address ── */}
          <Grid
            templateColumns={{ base: "1fr", sm: "repeat(2, 1fr)" }}
            gap={{ base: 4, md: 6 }}
            mb={6}
          >
            <Box>
              <Text
                fontWeight="bold"
                fontSize="xs"
                color="gray.400"
                mb={2}
                letterSpacing="wider"
                textTransform="uppercase"
              >
                Order Details
              </Text>
              <Text
                fontSize={{ base: "md", md: "xl" }}
                fontWeight="bold"
                mb={1}
                wordBreak="break-all"
              >
                {invoice.orderId}
              </Text>
              <Text fontSize={{ base: "sm", md: "md" }}>
                <Text as="span" fontWeight="semibold">Name: </Text>
                {invoice.user?.name || "N/A"}
              </Text>
              <Text fontSize={{ base: "sm", md: "md" }} wordBreak="break-all">
                <Text as="span" fontWeight="semibold">Email: </Text>
                {invoice.user?.email || "N/A"}
              </Text>
            </Box>

            <Box>
              <Text
                fontWeight="bold"
                fontSize="xs"
                color="gray.400"
                mb={2}
                letterSpacing="wider"
                textTransform="uppercase"
              >
                To
              </Text>
              <Text fontWeight="bold" fontSize={{ base: "sm", md: "md" }} mb={1}>
                {invoice.user?.name || "N/A"}
              </Text>
              {[
                invoice.shippingAddress?.doorNo,
                invoice.shippingAddress?.street,
                invoice.shippingAddress?.nearestLandmark,
                `${invoice.shippingAddress?.city || ""}, ${invoice.shippingAddress?.state || ""}`,
                invoice.shippingAddress?.pin,
                invoice.shippingAddress?.country,
                invoice.shippingAddress?.phoneNumber,
              ]
                .filter(Boolean)
                .map((line, i) => (
                  <Text
                    key={i}
                    fontWeight="bold"
                    fontSize={{ base: "xs", md: "sm" }}
                    color="gray.700"
                    lineHeight="1.6"
                  >
                    {line}
                  </Text>
                ))}
            </Box>
          </Grid>

          <Divider mb={4} />

          {/* ── Items Table ── */}
          <Box mb={6}>
            <Text fontSize={{ base: "lg", md: "xl" }} fontWeight="bold" mb={3}>
              Items
            </Text>
            <Box overflowX="auto" borderRadius="md" borderWidth={1} borderColor="gray.100">
              <Table variant="simple" size={{ base: "sm", md: "md" }} minW="500px">
                <Thead bg="gray.50">
                  <Tr>
                    <Th fontSize={{ base: "xs", md: "sm" }}>Qty</Th>
                    <Th fontSize={{ base: "xs", md: "sm" }}>Name</Th>
                    <Th fontSize={{ base: "xs", md: "sm" }}>HSN Code</Th>
                    <Th fontSize={{ base: "xs", md: "sm" }}>Size</Th>
                    <Th fontSize={{ base: "xs", md: "sm" }} isNumeric>Price</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {invoice.orderItems && invoice.orderItems.length > 0 ? (
                    invoice.orderItems.map((item, index) => (
                      <Tr key={index} _hover={{ bg: "gray.50" }} transition="background 0.15s">
                        <Td fontSize={{ base: "xs", md: "sm" }}>{item.qty}</Td>
                        <Td
                          fontSize={{ base: "xs", md: "sm" }}
                          maxW={{ base: "120px", md: "250px" }}
                          whiteSpace="normal"
                          wordBreak="break-word"
                        >
                          {item.name}
                        </Td>
                        {/* ✅ HSN Code column */}
                        <Td fontSize={{ base: "xs", md: "sm" }}>
                          <Badge colorScheme="gray" fontSize="xs" px={2} py={0.5} borderRadius="md">
                            {item.hsnCode || "6109"}
                          </Badge>
                        </Td>
                        <Td fontSize={{ base: "xs", md: "sm" }}>{item.size || "-"}</Td>
                        <Td fontSize={{ base: "xs", md: "sm" }} isNumeric fontWeight="medium">
                          ₹{item.price}
                        </Td>
                      </Tr>
                    ))
                  ) : (
                    <Tr>
                      <Td colSpan={5} textAlign="center" color="gray.400" py={6}>
                        No items in the order.
                      </Td>
                    </Tr>
                  )}
                </Tbody>
              </Table>
            </Box>
          </Box>

          {/* ── Summary ── */}
          <Box
            bg="gray.50"
            borderRadius="md"
            p={{ base: 3, md: 4 }}
            maxW={{ base: "100%", sm: "320px" }}
            ml="auto"
          >
            <Text fontSize={{ base: "lg", md: "xl" }} fontWeight="bold" mb={3}>
              Summary
            </Text>

            <Flex justify="space-between" mb={2}>
              <Text fontSize={{ base: "sm", md: "md" }} color="gray.600">
                CGST <Text as="span" fontSize="xs" color="gray.400">@2.5%</Text>
              </Text>
              <Text fontSize={{ base: "sm", md: "md" }}>₹{cgst}</Text>
            </Flex>

            <Flex justify="space-between" mb={2}>
              <Text fontSize={{ base: "sm", md: "md" }} color="gray.600">
                SGST <Text as="span" fontSize="xs" color="gray.400">@2.5%</Text>
              </Text>
              <Text fontSize={{ base: "sm", md: "md" }}>₹{sgst}</Text>
            </Flex>

            <Flex justify="space-between" mb={2}>
              <Text fontSize={{ base: "sm", md: "md" }} color="gray.600">Shipping</Text>
              <Text fontSize={{ base: "sm", md: "md" }}>₹{invoice.pricing?.shippingPrice || 0}</Text>
            </Flex>

            {hasCoupon && (
              <Flex justify="space-between" mb={2} align="center" flexWrap="wrap" gap={1}>
                <Flex align="center" gap={2}>
                  <Text fontSize={{ base: "sm", md: "md" }} color="green.600" fontWeight="bold">
                    Coupon
                  </Text>
                  <Badge colorScheme="green" fontSize="xs">
                    {invoice.pricing.coupon.code}
                  </Badge>
                </Flex>
                <Text fontSize={{ base: "sm", md: "md" }} color="green.600" fontWeight="bold">
                  − ₹{invoice.pricing.coupon.discountAmount}
                </Text>
              </Flex>
            )}

            <Divider my={2} />

            <Flex justify="space-between" align="center">
              <Text fontWeight="bold" fontSize={{ base: "md", md: "lg" }}>Total</Text>
              <Text fontWeight="bold" fontSize={{ base: "md", md: "lg" }} color="teal.600">
                ₹{invoice.pricing?.totalPrice || 0}
              </Text>
            </Flex>

            <Flex mt={3} align="center" gap={2}>
              <Badge
                colorScheme={invoice.paymentStatus?.isPaid ? "green" : "red"}
                fontSize={{ base: "xs", md: "sm" }}
                px={2}
                py={1}
                borderRadius="full"
              >
                {invoice.paymentStatus?.isPaid ? "Paid" : "Unpaid"}
              </Badge>
              {invoice.paymentStatus?.isPaid && (
                <Text fontSize={{ base: "xs", md: "sm" }} color="gray.500">
                  on {new Date(invoice.paymentStatus.paidAt).toLocaleDateString()}
                </Text>
              )}
            </Flex>
          </Box>

          {/* ── Actions ── */}
          <Stack direction={{ base: "column", sm: "row" }} spacing={3} mt={6}>
            <Button
              colorScheme="teal"
              onClick={handleDownloadPDF}
              size={{ base: "md", md: "md" }}
              w={{ base: "100%", sm: "auto" }}
            >
              Download PDF
            </Button>
          </Stack>
        </Box>
      ) : (
        <Box textAlign="center" py={10}>
          <Text color="gray.400" fontSize="lg">No invoice found.</Text>
        </Box>
      )}
    </Box>
  );
};

export default InvoiceScreen;