import React, { useRef } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import {
  Box,
  Button,
  VStack,
  Heading,
  Text,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  HStack,
  Divider,
  Image,
} from "@chakra-ui/react";

const InvoicePDF = ({ invoiceData }) => {
  const invoiceRef = useRef();

  const handleDownloadPDF = () => {
    const input = invoiceRef.current;

    html2canvas(input, {
      scale: 2, // Higher quality
      logging: false,
      useCORS: true,
    }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const imgWidth = 210; // A4 width in mm
      const pageHeight = 295; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`invoice_${invoiceData.invoiceNumber}.pdf`);
    });
  };

  return (
    <Box>
      <Button colorScheme="teal" onClick={handleDownloadPDF} mb={4}>
        Download PDF
      </Button>

      {/* This is the invoice template that will be converted to PDF */}
      <Box
        ref={invoiceRef}
        p={8}
        bg="white"
        color="black"
        width="210mm"
        minH="297mm"
        mx="auto"
        boxShadow="md"
      >
        <VStack align="stretch" spacing={6}>
          {/* Header */}
          <HStack justifyContent="space-between" alignItems="flex-start">
            <Image src={invoiceData.logo} alt="Logo" width="120px" />
            <Box textAlign="right">
              <Heading size="lg" color="blue.600">
                INVOICE
              </Heading>
              <Text>Invoice #: {invoiceData.invoiceNumber}</Text>
              <Text>Date: {invoiceData.date}</Text>
            </Box>
          </HStack>

          <Divider borderColor="gray.300" />

          {/* From/To Addresses */}
          <HStack justifyContent="space-between" alignItems="flex-start">
            <Box bg="gray.50" p={4} borderRadius="md" width="48%">
              <Heading size="sm" mb={2}>
                From:
              </Heading>
              <Text fontWeight="bold">{invoiceData.from.name}</Text>
              {invoiceData.from.businessName && (
                <Text>{invoiceData.from.businessName}</Text>
              )}
              <Text>{invoiceData.from.address}</Text>
              <Text>Email: {invoiceData.from.email}</Text>
              <Text>Phone: {invoiceData.from.phone}</Text>
              {invoiceData.from.businessNumber && (
                <Text>Business #: {invoiceData.from.businessNumber}</Text>
              )}
            </Box>

            <Box bg="gray.50" p={4} borderRadius="md" width="48%">
              <Heading size="sm" mb={2}>
                To:
              </Heading>
              <Text fontWeight="bold">{invoiceData.to.name}</Text>
              <Text>{invoiceData.to.address}</Text>
              <Text>Email: {invoiceData.to.email}</Text>
              <Text>Phone: {invoiceData.to.phone}</Text>
              {invoiceData.to.mobile && (
                <Text>Mobile: {invoiceData.to.mobile}</Text>
              )}
              {invoiceData.to.fax && <Text>Fax: {invoiceData.to.fax}</Text>}
            </Box>
          </HStack>

          {/* Items Table */}
          <Box mt={6}>
            <Heading size="sm" mb={2}>
              ITEMS
            </Heading>
            <Table variant="simple">
              <Thead bg="blue.600">
                <Tr>
                  <Th color="white">Description</Th>
                  <Th color="white" isNumeric>
                    Rate
                  </Th>
                  <Th color="white" isNumeric>
                    Qty
                  </Th>
                  <Th color="white" isNumeric>
                    CGST %
                  </Th>
                  <Th color="white" isNumeric>
                    SGST %
                  </Th>
                  <Th color="white" isNumeric>
                    Amount
                  </Th>
                </Tr>
              </Thead>
              <Tbody>
                {invoiceData.items.map((item, index) => (
                  <Tr key={index}>
                    <Td>{item.description}</Td>
                    <Td isNumeric>₹{item.rate.toFixed(2)}</Td>
                    <Td isNumeric>{item.qty}</Td>
                    <Td isNumeric>{item.cgst}%</Td>
                    <Td isNumeric>{item.sgst}%</Td>
                    <Td isNumeric>₹{item.amount.toFixed(2)}</Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </Box>

          {/* Totals */}
          <Box alignSelf="flex-end" width="300px" mt={4}>
            <HStack justifyContent="space-between">
              <Text fontWeight="bold">Subtotal:</Text>
              <Text>₹{invoiceData.subtotal.toFixed(2)}</Text>
            </HStack>
            <HStack justifyContent="space-between">
              <Text fontWeight="bold">CGST:</Text>
              <Text>₹{invoiceData.totalCgst.toFixed(2)}</Text>
            </HStack>
            <HStack justifyContent="space-between">
              <Text fontWeight="bold">SGST:</Text>
              <Text>₹{invoiceData.totalSgst.toFixed(2)}</Text>
            </HStack>
            <Divider borderColor="gray.400" my={2} />
            <HStack justifyContent="space-between">
              <Text fontWeight="bold" fontSize="lg">
                TOTAL:
              </Text>
              <Text fontWeight="bold" fontSize="lg">
                ₹{invoiceData.total.toFixed(2)}
              </Text>
            </HStack>
          </Box>

          {/* Notes */}
          {invoiceData.notes && (
            <Box mt={6}>
              <Heading size="sm" mb={2}>
                NOTES
              </Heading>
              <Box bg="gray.50" p={4} borderRadius="md">
                <Text>{invoiceData.notes}</Text>
              </Box>
            </Box>
          )}

          {/* Footer */}
          <Box mt={10} textAlign="center" fontSize="sm" color="gray.600">
            <Text>Thank you for your business!</Text>
            <Text>
              {invoiceData.from.businessName || "Company Name"} |{" "}
              {invoiceData.from.email} | {invoiceData.from.phone}
            </Text>
          </Box>
        </VStack>
      </Box>
    </Box>
  );
};

export default InvoicePDF;
