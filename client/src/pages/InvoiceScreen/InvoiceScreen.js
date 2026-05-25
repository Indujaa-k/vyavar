import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getInvoice } from "../../actions/orderActions";
import {
  Box,
  Text,
  Button,
  Spinner,
  Flex,
  Grid,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
} from "@chakra-ui/react";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { useParams } from "react-router-dom";

import stampLogo from "../../assets/about/stamp.png";

const FROM_NAME = "Viyavar Fashions";

const FROM_ADDRESS = [
  "173A, Anna Nagar, Industrial Estate",
  "Karur, Tamil Nadu - 639004",
  "India",
];

const GST_NUMBER = "33ABAFV1588M1ZS";

const getImageBase64 = (url, maxSize = 120) =>
  new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      try {
        const canvas = document.createElement("canvas");
        const scale = Math.min(1, maxSize / Math.max(img.width, img.height));
        canvas.width = Math.max(1, Math.round(img.width * scale));
        canvas.height = Math.max(1, Math.round(img.height * scale));
        const ctx = canvas.getContext("2d");

        // Fill white background before drawing — eliminates black on transparency
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        // PNG keeps it small at 120px — JPEG would turn transparency black
        resolve(canvas.toDataURL("image/png"));
      } catch (e) {
        resolve(null);
      }
    };
    img.onerror = () => resolve(null);
    img.src = url;
  });
const InvoiceScreen = () => {
  const dispatch = useDispatch();
  const { id } = useParams();

  const invoiceDetails = useSelector((state) => state.invoiceDetails);
  const { loading, error, invoice } = invoiceDetails;

  useEffect(() => {
    dispatch(getInvoice(id));
  }, [dispatch, id]);

  // ===== HELPERS =====

  const numberToWords = (num) => {
    const a = [
      "",
      "One",
      "Two",
      "Three",
      "Four",
      "Five",
      "Six",
      "Seven",
      "Eight",
      "Nine",
      "Ten",
      "Eleven",
      "Twelve",
      "Thirteen",
      "Fourteen",
      "Fifteen",
      "Sixteen",
      "Seventeen",
      "Eighteen",
      "Nineteen",
    ];
    const b = [
      "",
      "",
      "Twenty",
      "Thirty",
      "Forty",
      "Fifty",
      "Sixty",
      "Seventy",
      "Eighty",
      "Ninety",
    ];
    const inWords = (n) => {
      if (n < 20) return a[n];
      if (n < 100) return b[Math.floor(n / 10)] + " " + a[n % 10];
      if (n < 1000)
        return a[Math.floor(n / 100)] + " Hundred " + inWords(n % 100);
      if (n < 100000)
        return inWords(Math.floor(n / 1000)) + " Thousand " + inWords(n % 1000);
      if (n < 10000000)
        return inWords(Math.floor(n / 100000)) + " Lakh " + inWords(n % 100000);
      return "";
    };
    return inWords(num) + " Rupees Only";
  };

  // For UI preview — uses ₹ symbol
  const formatINR = (num) =>
    Number(num || 0).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  // For PDF — uses Rs. to avoid ₹ encoding issue in jsPDF
  const formatPDF = (num) =>
    "Rs. " +
    Number(num || 0).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  // ===== PREVIEW VALUES =====

  const total = invoice?.pricing?.totalPrice || 0;
  const taxableAmount =
    total -
    (invoice?.pricing?.taxPrice || 0) -
    (invoice?.pricing?.shippingPrice || 0);
  const cgst =
    invoice?.pricing?.cgstPrice || invoice?.pricing?.taxPrice / 2 || 0;
  const sgst =
    invoice?.pricing?.sgstPrice || invoice?.pricing?.taxPrice / 2 || 0;
  const shipping = invoice?.pricing?.shippingPrice || 0;

  // ✅ Read coupon from top-level invoice.coupon
  const coupon = invoice?.coupon;
  const couponCode = coupon?.code || "";
  const discountAmount = coupon?.discountAmount || 0;
  const discountPercentage = coupon?.percentage || 0;

  const summaryRows = invoice
    ? [
        {
          label: "Taxable Amount",
          value: formatINR(taxableAmount),
          bold: true,
          dark: false,
          green: false,
        },
        {
          label: "CGST @2.5%",
          value: formatINR(cgst),
          bold: false,
          dark: false,
          green: false,
        },
        {
          label: "SGST @2.5%",
          value: formatINR(sgst),
          bold: false,
          dark: false,
          green: false,
        },
        {
          label: "Shipping Charges",
          value: formatINR(shipping),
          bold: false,
          dark: false,
          green: false,
        },
        ...(discountAmount > 0
          ? [
              {
                label: `Coupon (${couponCode} - ${discountPercentage}% OFF)`,
                value: formatINR(discountAmount),
                bold: false,
                dark: false,
                green: true,
              },
            ]
          : []),
        {
          label: "Total Amount",
          value: formatINR(total),
          bold: true,
          dark: true,
          green: false,
        },
      ]
    : [];

  // ===== PDF DOWNLOAD =====

  const handleDownloadPDF = async () => {
    if (!invoice) return;

    const doc = new jsPDF("p", "mm", "a4");
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight(); // 297mm
    const marginBottom = 20; // reserve space for footer

    // ─── Helper: add new page + reset y if content would overflow ───
    const checkPageBreak = (currentY, neededHeight = 10) => {
      if (currentY + neededHeight > pageHeight - marginBottom) {
        doc.addPage();
        // Repeat a slim header on continuation pages
        doc.setFillColor(245, 245, 245);
        doc.rect(0, 0, 210, 14, "F");
        doc.setFontSize(9);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(80);
        doc.text(
          FROM_NAME + "  |  Invoice #" + (invoice.invoiceNumber || "N/A"),
          14,
          9,
        );
        doc.setTextColor(0);
        return 20; // new y after the mini-header
      }
      return currentY;
    };

    const logoBase64 = await getImageBase64(stampLogo);

    // ─── PAGE 1 HEADER ───
    doc.setFillColor(245, 245, 245);
    doc.rect(0, 0, 210, 42, "F");

    if (logoBase64) {
      doc.addImage(logoBase64, "PNG", 12, 5, 36, 36);
    }

    doc.setFontSize(22);
    doc.setFont("helvetica", "bold");
    doc.text(FROM_NAME, 54, 18);

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    FROM_ADDRESS.forEach((line, i) => {
      doc.text(line, 54, 24 + i * 5);
    });
    doc.text("GSTIN: " + GST_NUMBER, 54, 39);

    let y = 52;

    // ─── INVOICE TITLE ───
    y = checkPageBreak(y, 16);
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text("INVOICE", 14, y);

    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    doc.text(
      "Invoice No: " + (invoice.invoiceNumber || "N/A"),
      pageWidth - 14,
      y,
      { align: "right" },
    );

    y += 10;

    // ─── FROM / TO BOXES ───
    y = checkPageBreak(y, 56);
    doc.setDrawColor(220);
    doc.roundedRect(14, y, 85, 48, 2, 2);
    doc.roundedRect(111, y, 85, 48, 2, 2);

    doc.setFillColor(240, 240, 240);
    doc.rect(14, y, 85, 8, "F");
    doc.rect(111, y, 85, 8, "F");

    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text("FROM", 18, y + 5);
    doc.text("TO", 115, y + 5);

    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text(FROM_NAME, 18, y + 14);
    doc.text(invoice.user?.name || "N/A", 115, y + 14);

    doc.setFont("helvetica", "normal");
    FROM_ADDRESS.forEach((line, i) => {
      doc.text(line, 18, y + 19 + i * 4.5);
    });

    const toLines = [
      invoice.shippingAddress?.doorNo || "",
      invoice.shippingAddress?.street || "",
      invoice.shippingAddress?.city || "",
      invoice.shippingAddress?.state || "",
      invoice.shippingAddress?.pin || "",
      invoice.shippingAddress?.phoneNumber || "",
    ];
    toLines.forEach((line, i) => {
      doc.text(String(line), 115, y + 19 + i * 4.5);
    });

    y += 58;

    // ─── ITEMS TABLE ───
    // autoTable handles its own page breaks internally — just pass startY
    y = checkPageBreak(y, 20);
    autoTable(doc, {
      startY: y,
      head: [["ITEM", "HSN", "QTY", "SIZE", "PRICE", "TOTAL"]],
      body: invoice.orderItems.map((item) => [
        item.name,
        item.hsnCode || "6109",
        item.qty,
        item.size || "-",
        formatPDF(item.price),
        formatPDF(item.qty * item.price),
      ]),
      styles: { fontSize: 10, cellPadding: 4 },
      headStyles: { fillColor: [30, 30, 30], textColor: [255, 255, 255] },
      alternateRowStyles: { fillColor: [248, 248, 248] },
      columnStyles: {
        4: { halign: "right" },
        5: { halign: "right" },
      },
      theme: "grid",
      // This tells autoTable to add a new page when it overflows
      didDrawPage: (data) => {
        // Draw slim continuation header on every new page autoTable creates
        if (data.pageNumber > 1) {
          doc.setFillColor(245, 245, 245);
          doc.rect(0, 0, 210, 14, "F");
          doc.setFontSize(9);
          doc.setFont("helvetica", "bold");
          doc.setTextColor(80);
          doc.text(
            FROM_NAME + "  |  Invoice #" + (invoice.invoiceNumber || "N/A"),
            14,
            9,
          );
          doc.setTextColor(0);
        }
      },
    });

    y = doc.lastAutoTable.finalY + 8;

    // ─── SUMMARY ROWS ───
    const pdfTotal = invoice.pricing?.totalPrice || 0;
    const pdfTaxable =
      pdfTotal -
      (invoice.pricing?.taxPrice || 0) -
      (invoice.pricing?.shippingPrice || 0);
    const pdfCgst =
      invoice.pricing?.cgstPrice || invoice.pricing?.taxPrice / 2 || 0;
    const pdfSgst =
      invoice.pricing?.sgstPrice || invoice.pricing?.taxPrice / 2 || 0;
    const pdfShipping = invoice.pricing?.shippingPrice || 0;

    const pdfCoupon = invoice.coupon;
    const pdfCouponCode = pdfCoupon?.code || "";
    const pdfDiscountAmount = pdfCoupon?.discountAmount || 0;
    const pdfDiscountPct = pdfCoupon?.percentage || 0;

    const pdfSummaryRows = [
      {
        label: "Taxable Amount",
        value: formatPDF(pdfTaxable),
        dark: false,
        bold: true,
        green: false,
      },
      {
        label: "CGST @2.5%",
        value: formatPDF(pdfCgst),
        dark: false,
        bold: false,
        green: false,
      },
      {
        label: "SGST @2.5%",
        value: formatPDF(pdfSgst),
        dark: false,
        bold: false,
        green: false,
      },
      {
        label: "Shipping Charges",
        value: formatPDF(pdfShipping),
        dark: false,
        bold: false,
        green: false,
      },
      ...(pdfDiscountAmount > 0
        ? [
            {
              label: `Coupon (${pdfCouponCode} - ${pdfDiscountPct}% OFF)`,
              value: "- " + formatPDF(pdfDiscountAmount),
              dark: false,
              bold: false,
              green: true,
            },
          ]
        : []),
      {
        label: "Total Amount",
        value: formatPDF(pdfTotal),
        dark: true,
        bold: true,
        green: false,
      },
    ];

    const sumX = 110;
    const sumW = 86;
    const rowH = 9;
    const summaryBlockHeight = pdfSummaryRows.length * rowH;

    // ── If the whole summary block doesn't fit, push to next page ──
    y = checkPageBreak(y, summaryBlockHeight);

    pdfSummaryRows.forEach((row, i) => {
      const rowY = y + i * rowH;

      if (row.dark) {
        doc.setFillColor(30, 30, 30);
        doc.rect(sumX, rowY, sumW, rowH, "F");
        doc.setTextColor(255, 255, 255);
      } else if (row.green) {
        doc.setFillColor(240, 255, 240);
        doc.rect(sumX, rowY, sumW, rowH, "F");
        doc.setTextColor(20, 120, 40);
      } else {
        doc.setFillColor(
          i % 2 === 0 ? 255 : 248,
          i % 2 === 0 ? 255 : 248,
          i % 2 === 0 ? 255 : 248,
        );
        doc.rect(sumX, rowY, sumW, rowH, "F");
        doc.setTextColor(40, 40, 40);
      }

      doc.setDrawColor(210);
      doc.rect(sumX, rowY, sumW, rowH);
      doc.setFontSize(9.5);
      doc.setFont("helvetica", row.bold ? "bold" : "normal");
      doc.text(row.label, sumX + 3, rowY + 6);
      doc.text(row.value, sumX + sumW - 3, rowY + 6, { align: "right" });
    });

    doc.setTextColor(0);

    // ─── AMOUNT IN WORDS ───
    y = y + summaryBlockHeight + 10;
    y = checkPageBreak(y, 24);

    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(40, 40, 40);
    doc.text("Amount in Words:", 14, y);

    doc.setFont("helvetica", "normal");
    const splitWords = doc.splitTextToSize(
      numberToWords(Math.floor(pdfTotal)),
      170,
    );
    doc.text(splitWords, 14, y + 6);

    // ─── FOOTER on every page ───
    const totalPages = doc.internal.getNumberOfPages();
    for (let p = 1; p <= totalPages; p++) {
      doc.setPage(p);
      doc.setDrawColor(220);
      doc.line(14, 285, 196, 285);
      doc.setFontSize(9);
      doc.setTextColor(120);
      doc.text("Thanks for Shopping", pageWidth / 2, 291, { align: "center" });
      doc.text(`Page ${p} of ${totalPages}`, pageWidth - 14, 291, {
        align: "right",
      });
    }

    doc.save("invoice_" + (invoice.invoiceNumber || invoice.orderId) + ".pdf");
  };

  // ===== RENDER =====

  return (
    <Box p={6} maxW="860px" mx="auto">
      <Flex justify="space-between" align="center" mb={6}>
        <Text fontSize="xl" fontWeight="semibold">
          Invoice Preview
        </Text>
        {!loading && !error && invoice && (
          <Button colorScheme="teal" onClick={handleDownloadPDF}>
            ⬇ Download PDF
          </Button>
        )}
      </Flex>

      {loading ? (
        <Flex justify="center" mt={10}>
          <Spinner size="xl" />
        </Flex>
      ) : error ? (
        <Text color="red.500">{error}</Text>
      ) : invoice ? (
        <Box
          border="1px solid"
          borderColor="gray.200"
          borderRadius="xl"
          overflow="hidden"
          boxShadow="sm"
        >
          {/* Header */}
          <Box
            bg="gray.50"
            px={6}
            py={5}
            borderBottom="1px solid"
            borderColor="gray.200"
          >
            <Flex align="center" gap={4}>
              <Box
                w="56px"
                h="56px"
                borderRadius="full"
                overflow="hidden"
                flexShrink={0}
                border="1px solid"
                borderColor="gray.200"
              >
                <img
                  src={stampLogo}
                  alt="Viyavar Fashions"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </Box>
              <Box flex={1}>
                <Text fontWeight="semibold" fontSize="lg">
                  {FROM_NAME}
                </Text>
                <Text fontSize="xs" color="gray.500" lineHeight={1.6}>
                  {FROM_ADDRESS.join(", ")}
                  <br />
                  GSTIN: {GST_NUMBER}
                </Text>
              </Box>
              <Box textAlign="right">
                <Text fontSize="sm" fontWeight="medium">
                  INV #{invoice.invoiceNumber || "N/A"}
                </Text>
                <Text fontSize="xs" color="gray.500" mt={1}>
                  {invoice.createdAt
                    ? new Date(invoice.createdAt).toLocaleDateString("en-IN")
                    : ""}
                </Text>
                <Box
                  display="inline-block"
                  mt={2}
                  px={3}
                  py={1}
                  bg="green.50"
                  color="green.600"
                  borderRadius="full"
                  fontSize="11px"
                  fontWeight="medium"
                >
                  ✓ Invoice
                </Box>
              </Box>
            </Flex>
          </Box>

          {/* Body */}
          <Box px={6} py={5}>
            {/* FROM / TO */}
            <Grid templateColumns="1fr 1fr" gap={4} mb={6}>
              <Box bg="gray.50" borderRadius="lg" p={4}>
                <Text
                  fontSize="11px"
                  fontWeight="bold"
                  color="gray.700"
                  letterSpacing="wide"
                  mb={2}
                  textTransform="uppercase"
                >
                  From
                </Text>
                <Text fontSize="sm" fontWeight="bold" color="gray.800">
                  {FROM_NAME}
                </Text>
                <Text fontSize="xs" color="gray.500" lineHeight={1.7}>
                  {FROM_ADDRESS.map((l, i) => (
                    <span key={i}>
                      {l}
                      <br />
                    </span>
                  ))}
                  GSTIN: {GST_NUMBER}
                </Text>
              </Box>
              <Box bg="gray.50" borderRadius="lg" p={4}>
                <Text
                  fontSize="11px"
                  fontWeight="bold"
                  color="gray.700"
                  letterSpacing="wide"
                  mb={2}
                  textTransform="uppercase"
                >
                  To
                </Text>
                <Text fontSize="sm" fontWeight="bold" color="gray.800">
                  {invoice.user?.name || "N/A"}
                </Text>
                <Text fontSize="xs" color="gray.500" lineHeight={1.7}>
                  {invoice.shippingAddress?.doorNo}{" "}
                  {invoice.shippingAddress?.street}
                  <br />
                  {invoice.shippingAddress?.city},{" "}
                  {invoice.shippingAddress?.state} –{" "}
                  {invoice.shippingAddress?.pin}
                  <br />
                  {invoice.shippingAddress?.phoneNumber}
                </Text>
              </Box>
            </Grid>

            {/* Items Table */}
            <Box overflowX="auto" mb={6}>
              <Table size="sm" variant="simple">
                <Thead>
                  <Tr>
                    {["Item", "HSN", "Qty", "Size", "Price", "Total"].map(
                      (h) => (
                        <Th
                          key={h}
                          fontSize="10px"
                          color="white"
                          py={3}
                          bg="gray.800"
                        >
                          {h}
                        </Th>
                      ),
                    )}
                  </Tr>
                </Thead>
                <Tbody>
                  {invoice.orderItems.map((item, i) => (
                    <Tr key={i} bg={i % 2 === 0 ? "white" : "gray.50"}>
                      <Td>
                        <Text fontSize="sm" fontWeight="medium">
                          {item.name}
                        </Text>
                        <Text fontSize="xs" color="gray.400">
                          HSN: {item.hsnCode || "6109"}
                        </Text>
                      </Td>
                      <Td fontSize="sm">{item.hsnCode || "6109"}</Td>
                      <Td fontSize="sm" textAlign="center">
                        {item.qty}
                      </Td>
                      <Td fontSize="sm" textAlign="center">
                        {item.size || "-"}
                      </Td>
                      <Td fontSize="sm" isNumeric>
                        ₹ {formatINR(item.price)}
                      </Td>
                      <Td fontSize="sm" fontWeight="medium" isNumeric>
                        ₹ {formatINR(item.qty * item.price)}
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </Box>

            {/* Summary Table */}
            <Flex justify="flex-end" mb={6}>
              <Box
                w="320px"
                border="1px solid"
                borderColor="gray.200"
                borderRadius="lg"
                overflow="hidden"
              >
                {summaryRows.map((row, i) => (
                  <Flex
                    key={i}
                    justify="space-between"
                    align="center"
                    px={4}
                    py="9px"
                    bg={
                      row.dark
                        ? "gray.800"
                        : row.green
                          ? "green.50"
                          : i % 2 === 0
                            ? "white"
                            : "gray.50"
                    }
                    borderBottom={
                      i < summaryRows.length - 1 ? "1px solid" : "none"
                    }
                    borderColor="gray.100"
                  >
                    <Text
                      fontSize="sm"
                      fontWeight={row.bold ? "bold" : "normal"}
                      color={
                        row.dark
                          ? "white"
                          : row.green
                            ? "green.700"
                            : "gray.600"
                      }
                    >
                      {row.label}
                    </Text>
                    <Text
                      fontSize="sm"
                      fontWeight={row.bold ? "bold" : "medium"}
                      color={
                        row.dark
                          ? "white"
                          : row.green
                            ? "green.700"
                            : "gray.800"
                      }
                    >
                      {row.green ? "- " : ""}₹ {row.value}
                    </Text>
                  </Flex>
                ))}
              </Box>
            </Flex>

            {/* Amount in Words
            <Box pt={4} borderTop="1px solid" borderColor="gray.100">
              <Text fontSize="10px" color="gray.400" letterSpacing="wide" mb={1} textTransform="uppercase">
                Amount in Words
              </Text>
              <Text fontSize="sm" fontWeight="medium">
                {numberToWords(Math.floor(total))}
              </Text>
            </Box> */}
          </Box>

          {/* Footer */}
          <Box
            bg="gray.50"
            borderTop="1px solid"
            borderColor="gray.200"
            py={3}
            textAlign="center"
          >
            <Text fontSize="11px" color="gray.400" letterSpacing="widest">
              Thanks for Shopping
            </Text>
          </Box>
        </Box>
      ) : null}
    </Box>
  );
};

export default InvoiceScreen;
