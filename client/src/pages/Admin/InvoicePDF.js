// import React, { useRef } from "react";
// import html2canvas from "html2canvas";
// import jsPDF from "jspdf";
// import {
//   Box,
//   Button,
//   VStack,
//   Heading,
//   Text,
//   Table,
//   Thead,
//   Tbody,
//   Tr,
//   Th,
//   Td,
//   HStack,
//   Divider,
//   Image,
// } from "@chakra-ui/react";

// const InvoicePDF = ({ invoiceData }) => {
//   const invoiceRef = useRef();

//   const handleDownloadPDF = () => {
//     const input = invoiceRef.current;

//     html2canvas(input, {
//       scale: 2,
//       logging: false,
//       useCORS: true,
//     }).then((canvas) => {
//       const imgData = canvas.toDataURL("image/png");
//       const pdf = new jsPDF("p", "mm", "a4");
//       const imgWidth = 210;
//       const pageHeight = 295;
//       const imgHeight = (canvas.height * imgWidth) / canvas.width;
//       let heightLeft = imgHeight;
//       let position = 0;

//       pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
//       heightLeft -= pageHeight;

//       while (heightLeft >= 0) {
//         position = heightLeft - imgHeight;
//         pdf.addPage();
//         pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
//         heightLeft -= pageHeight;
//       }

//       pdf.save(`invoice_${invoiceData.invoiceNumber}.pdf`);
//     });
//   };

//   return (
//     <Box>
//       <Button colorScheme="teal" onClick={handleDownloadPDF} mb={4}>
//         Download PDF
//       </Button>

//       {/* Invoice template that will be converted to PDF */}
//       <Box
//         ref={invoiceRef}
//         p={8}
//         bg="white"
//         color="black"
//         width="210mm"
//         minH="297mm"
//         mx="auto"
//         boxShadow="md"
//       >
//         <VStack align="stretch" spacing={6}>
//           {/* Header */}
//           <HStack justifyContent="space-between" alignItems="flex-start">
//             <Image src={invoiceData.logo} alt="Logo" width="120px" />
//             <Box textAlign="right">
//               <Heading size="lg" color="blue.600">
//                 INVOICE
//               </Heading>
//               <Text>Invoice #: {invoiceData.invoiceNumber}</Text>
//               <Text>Date: {invoiceData.date}</Text>
//             </Box>
//           </HStack>

//           <Divider borderColor="gray.300" />

//           {/* From/To Addresses */}
//           <HStack justifyContent="space-between" alignItems="flex-start">
//             <Box bg="gray.50" p={4} borderRadius="md" width="48%">
//               <Heading size="sm" mb={2}>
//                 From:
//               </Heading>
//               <Text fontWeight="bold">{invoiceData.from.name}</Text>
//               {invoiceData.from.businessName && (
//                 <Text>{invoiceData.from.businessName}</Text>
//               )}
//               <Text>{invoiceData.from.address}</Text>
//               <Text>Email: {invoiceData.from.email}</Text>
//               <Text>Phone: {invoiceData.from.phone}</Text>
//               {invoiceData.from.businessNumber && (
//                 <Text>Business #: {invoiceData.from.businessNumber}</Text>
//               )}
//             </Box>

//             <Box bg="gray.50" p={4} borderRadius="md" width="48%">
//               <Heading size="sm" mb={2}>
//                 To:
//               </Heading>
//               <Text fontWeight="bold">{invoiceData.to.name}</Text>
//               <Text>{invoiceData.to.address}</Text>
//               <Text>Email: {invoiceData.to.email}</Text>
//               <Text>Phone: {invoiceData.to.phone}</Text>
//               {invoiceData.to.mobile && (
//                 <Text>Mobile: {invoiceData.to.mobile}</Text>
//               )}
//               {invoiceData.to.fax && <Text>Fax: {invoiceData.to.fax}</Text>}
//             </Box>
//           </HStack>

//           {/* Items Table */}
//           <Box mt={6}>
//             <Heading size="sm" mb={2}>
//               ITEMS
//             </Heading>
//             <Table variant="simple">
//               <Thead bg="blue.600">
//                 <Tr>
//                   <Th color="white">Description</Th>
//                   <Th color="white">HSN Code</Th>
//                   <Th color="white" isNumeric>
//                     Rate
//                   </Th>
//                   <Th color="white" isNumeric>
//                     Qty
//                   </Th>
//                   <Th color="white" isNumeric>
//                     CGST %
//                   </Th>
//                   <Th color="white" isNumeric>
//                     SGST %
//                   </Th>
//                   <Th color="white" isNumeric>
//                     Amount
//                   </Th>
//                 </Tr>
//               </Thead>
//               <Tbody>
//                 {invoiceData.items.map((item, index) => (
//                   <Tr key={index}>
//                     <Td>{item.description}</Td>
//                     <Td>{item.hsnCode || "6109"}</Td>
//                     <Td isNumeric>₹{Number(item.rate).toFixed(2)}</Td>
//                     <Td isNumeric>{item.qty}</Td>
//                     <Td isNumeric>{item.cgst}%</Td>
//                     <Td isNumeric>{item.sgst}%</Td>
//                     <Td isNumeric>₹{Number(item.amount).toFixed(2)}</Td>
//                   </Tr>
//                 ))}
//               </Tbody>
//             </Table>
//           </Box>

//           {/* Totals */}
//           <Box alignSelf="flex-end" width="300px" mt={4}>
//             <HStack justifyContent="space-between">
//               <Text fontWeight="bold">Subtotal:</Text>
//               <Text>₹{Number(invoiceData.subtotal).toFixed(2)}</Text>
//             </HStack>
//             <HStack justifyContent="space-between">
//               <Text fontWeight="bold">CGST:</Text>
//               <Text>₹{Number(invoiceData.totalCgst).toFixed(2)}</Text>
//             </HStack>
//             <HStack justifyContent="space-between">
//               <Text fontWeight="bold">SGST:</Text>
//               <Text>₹{Number(invoiceData.totalSgst).toFixed(2)}</Text>
//             </HStack>
//             <Divider borderColor="gray.400" my={2} />
//             <HStack justifyContent="space-between">
//               <Text fontWeight="bold" fontSize="lg">
//                 TOTAL:
//               </Text>
//               <Text fontWeight="bold" fontSize="lg">
//                 ₹{Number(invoiceData.total).toFixed(2)}
//               </Text>
//             </HStack>
//           </Box>

//           {/* Notes */}
//           {invoiceData.notes && (
//             <Box mt={6}>
//               <Heading size="sm" mb={2}>
//                 NOTES
//               </Heading>
//               <Box bg="gray.50" p={4} borderRadius="md">
//                 <Text>{invoiceData.notes}</Text>
//               </Box>
//             </Box>
//           )}

//           {/* Footer */}
//           <Box mt={10} textAlign="center" fontSize="sm" color="gray.600">
//             <Text>Thank you for your business!</Text>
//             <Text>
//               {invoiceData.from.businessName || "Company Name"} |{" "}
//               {invoiceData.from.email} | {invoiceData.from.phone}
//             </Text>
//           </Box>
//         </VStack>
//       </Box>
//     </Box>
//   );
// };

// export default InvoicePDF;


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
  Grid,
  GridItem,
  Flex,
} from "@chakra-ui/react";

const InvoicePDF = ({ invoiceData }) => {
  const invoiceRef = useRef();

  const handleDownloadPDF = () => {
    const input = invoiceRef.current;

    html2canvas(input, {
      scale: 2,
      logging: false,
      useCORS: true,
    }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const imgWidth = 210;
      const pageHeight = 295;
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

      {/* Invoice template */}
      <Box
        ref={invoiceRef}
        bg="white"
        color="black"
        width="210mm"
        minH="297mm"
        mx="auto"
        boxShadow="md"
      >
        {/* Header with TAX INVOICE label */}
        <Box bg="white" p={2} borderBottom="1px solid #ddd">
          <HStack spacing={3}>
            <Text fontWeight="bold" fontSize="sm">
              TAX INVOICE
            </Text>
            <Box
              px={3}
              py={1}
              border="1px solid #999"
              borderRadius="sm"
              fontSize="xs"
              color="gray.600"
            >
              ORIGINAL FOR RECIPIENT
            </Box>
          </HStack>
        </Box>

        {/* Company Header with Logo */}
        <HStack
          bg="white"
          p={6}
          spacing={4}
          align="flex-start"
          borderBottom="3px solid black"
        >
          {/* Logo Box */}
          <Box
            bg="black"
            color="white"
            width="120px"
            height="120px"
            display="flex"
            alignItems="center"
            justifyContent="center"
            flexShrink={0}
          >
            {invoiceData.logo ? (
              <img
                src={invoiceData.logo}
                alt="Logo"
                style={{ width: "100%", height: "100%", objectFit: "contain" }}
              />
            ) : (
              <Box fontSize="3xl" fontWeight="bold">
                ←★
              </Box>
            )}
          </Box>

          {/* Company Details */}
          <VStack align="flex-start" spacing={1} flex={1}>
            <Heading size="lg" fontWeight="bold">
              {invoiceData.from.businessName}
            </Heading>
            <Text fontSize="sm">{invoiceData.from.address}</Text>
            <HStack spacing={6} fontSize="sm">
              <Text>
                <b>Mobile:</b> {invoiceData.from.phone}
              </Text>
              <Text>
                <b>GSTIN:</b> {invoiceData.from.gstin}
              </Text>
            </HStack>
            <Text fontSize="sm">
              <b>Email:</b> {invoiceData.from.email}
            </Text>
          </VStack>
        </HStack>

        {/* Invoice Details Row */}
        <Box bg="gray.100" p={4}>
          <HStack justifyContent="space-between" fontSize="sm">
            <Text>
              <b>Invoice No.:</b> {invoiceData.invoiceNumber}
            </Text>
            <Text>
              <b>Invoice Date:</b> {invoiceData.date}
            </Text>
            <Text>
              <b>Due Date:</b> {invoiceData.dueDate}
            </Text>
          </HStack>
        </Box>

        {/* Bill To and Ship To */}
        <Grid templateColumns="1fr 1fr" gap={0} borderBottom="2px solid black">
          <GridItem p={4} borderRight="1px solid #ddd">
            <Text fontWeight="bold" mb={2}>
              BILL TO
            </Text>
            <VStack align="flex-start" spacing={1} fontSize="sm">
              <Text fontWeight="bold">{invoiceData.to.name}</Text>
              <Text>{invoiceData.to.address}</Text>
              <Text>Mobile: {invoiceData.to.mobile}</Text>
              <Text>GSTIN: {invoiceData.to.gstin}</Text>
              <Text>PAN Number: {invoiceData.to.pan}</Text>
              <Text>Place of Supply: {invoiceData.to.placeOfSupply}</Text>
            </VStack>
          </GridItem>

          <GridItem p={4}>
            <Text fontWeight="bold" mb={2}>
              SHIP TO
            </Text>
            <VStack align="flex-start" spacing={1} fontSize="sm">
              <Text fontWeight="bold">{invoiceData.shipTo.name}</Text>
              <Text>{invoiceData.shipTo.address}</Text>
            </VStack>
          </GridItem>
        </Grid>

        {/* Items Table */}
        <Table variant="simple" size="sm">
          <Thead>
            <Tr bg="white" borderBottom="2px solid black">
              <Th
                fontSize="xs"
                fontWeight="bold"
                color="black"
                textTransform="uppercase"
                py={3}
              >
                ITEMS
              </Th>
              <Th
                fontSize="xs"
                fontWeight="bold"
                color="black"
                textTransform="uppercase"
                textAlign="center"
              >
                HSN
              </Th>
              <Th
                fontSize="xs"
                fontWeight="bold"
                color="black"
                textTransform="uppercase"
                textAlign="center"
              >
                QTY.
              </Th>
              <Th
                fontSize="xs"
                fontWeight="bold"
                color="black"
                textTransform="uppercase"
                textAlign="right"
              >
                RATE
              </Th>
              <Th
                fontSize="xs"
                fontWeight="bold"
                color="black"
                textTransform="uppercase"
                textAlign="right"
              >
                TAX
              </Th>
              <Th
                fontSize="xs"
                fontWeight="bold"
                color="black"
                textTransform="uppercase"
                textAlign="right"
              >
                AMOUNT
              </Th>
            </Tr>
          </Thead>
          <Tbody>
            {invoiceData.items.map((item, index) => (
              <Tr key={index} borderBottom="1px solid #eee">
                <Td fontSize="sm" py={3}>
                  {item.description}
                </Td>
                <Td fontSize="sm" textAlign="center">
                  {item.hsnCode}
                </Td>
                <Td fontSize="sm" textAlign="center">
                  {item.qty} PCS
                </Td>
                <Td fontSize="sm" textAlign="right">
                  {item.rate}
                </Td>
                <Td fontSize="sm" textAlign="right">
                  {item.tax.toLocaleString("en-IN")}
                  <br />
                  <Text as="span" fontSize="xs" color="gray.600">
                    ({item.taxPercent}%)
                  </Text>
                </Td>
                <Td fontSize="sm" textAlign="right" fontWeight="medium">
                  {item.amount.toLocaleString("en-IN")}
                </Td>
              </Tr>
            ))}

            {/* Subtotal Row */}
            <Tr borderTop="2px solid black" borderBottom="2px solid black">
              <Td fontWeight="bold" fontSize="sm">
                SUBTOTAL
              </Td>
              <Td></Td>
              <Td fontSize="sm" textAlign="center" fontWeight="bold">
                {invoiceData.totalQty}
              </Td>
              <Td></Td>
              <Td fontSize="sm" textAlign="right" fontWeight="bold">
                ₹ {invoiceData.totalTax.toLocaleString("en-IN")}
              </Td>
              <Td fontSize="sm" textAlign="right" fontWeight="bold">
                ₹ {invoiceData.subtotal.toLocaleString("en-IN")}
              </Td>
            </Tr>
          </Tbody>
        </Table>

        {/* Bottom Section - Bank Details and Summary */}
        <Grid templateColumns="1fr 1fr" gap={0}>
          {/* Left: Bank Details and QR Code */}
          <GridItem p={6} borderRight="1px solid #ddd">
            <VStack align="flex-start" spacing={4}>
              {/* Bank Details */}
              <Box>
                <Text fontWeight="bold" mb={2} fontSize="sm">
                  BANK DETAILS
                </Text>
                <VStack align="flex-start" spacing={1} fontSize="xs">
                  <HStack>
                    <Text width="80px">Name:</Text>
                    <Text fontWeight="medium">
                      {invoiceData.bankDetails.name}
                    </Text>
                  </HStack>
                  <HStack>
                    <Text width="80px">IFSC Code:</Text>
                    <Text fontWeight="medium">
                      {invoiceData.bankDetails.ifsc}
                    </Text>
                  </HStack>
                  <HStack>
                    <Text width="80px">Account No:</Text>
                    <Text fontWeight="medium">
                      {invoiceData.bankDetails.accountNo}
                    </Text>
                  </HStack>
                  <HStack>
                    <Text width="80px">Bank:</Text>
                    <Text fontWeight="medium">
                      {invoiceData.bankDetails.bank}
                    </Text>
                  </HStack>
                </VStack>
              </Box>

              {/* Payment QR Code */}
              <Box>
                <Text fontWeight="bold" mb={2} fontSize="sm">
                  PAYMENT QR CODE
                </Text>
                <Box
                  width="120px"
                  height="120px"
                  bg="gray.200"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  border="1px solid #ccc"
                >
                  {invoiceData.qrCode ? (
                    <img
                      src={invoiceData.qrCode}
                      alt="QR Code"
                      style={{ width: "100%", height: "100%" }}
                    />
                  ) : (
                    <Text fontSize="xs" color="gray.600">
                      QR Code
                    </Text>
                  )}
                </Box>
                <Text fontSize="xs" mt={2}>
                  UPI ID: {invoiceData.upiId}
                </Text>
              </Box>
            </VStack>
          </GridItem>

          {/* Right: Payment Summary */}
          <GridItem p={6}>
            <VStack align="stretch" spacing={2}>
              <HStack justifyContent="space-between" fontSize="sm">
                <Text>Taxable Amount</Text>
                <Text fontWeight="medium">
                  ₹ {invoiceData.taxableAmount.toLocaleString("en-IN")}
                </Text>
              </HStack>
              <HStack justifyContent="space-between" fontSize="sm">
                <Text>CGST @2.5%</Text>
                <Text fontWeight="medium">
                  ₹ {invoiceData.cgst.toLocaleString("en-IN")}
                </Text>
              </HStack>
              <HStack justifyContent="space-between" fontSize="sm">
                <Text>SGST @2.5%</Text>
                <Text fontWeight="medium">
                  ₹ {invoiceData.sgst.toLocaleString("en-IN")}
                </Text>
              </HStack>

              <Box borderTop="1px solid #ddd" pt={2}>
                <HStack justifyContent="space-between" fontSize="sm">
                  <Text fontWeight="bold">Total Amount</Text>
                  <Text fontWeight="bold">
                    ₹ {invoiceData.total.toLocaleString("en-IN")}
                  </Text>
                </HStack>
              </Box>

              <HStack justifyContent="space-between" fontSize="sm">
                <Text>Received Amount</Text>
                <Text fontWeight="medium">
                  ₹ {invoiceData.receivedAmount.toLocaleString("en-IN")}
                </Text>
              </HStack>
              <HStack justifyContent="space-between" fontSize="sm">
                <Text fontWeight="bold">Balance</Text>
                <Text fontWeight="bold">
                  ₹ {invoiceData.balance.toLocaleString("en-IN")}
                </Text>
              </HStack>

              <Box mt={4} pt={3} borderTop="1px solid #ddd">
                <Text fontSize="xs" fontWeight="bold" mb={1}>
                  Total Amount (in words)
                </Text>
                <Text fontSize="sm">{invoiceData.amountInWords}</Text>
              </Box>
            </VStack>
          </GridItem>
        </Grid>

        {/* Signature */}
        <Box p={6} textAlign="right" borderTop="2px solid black">
          <Box display="inline-block" textAlign="center">
            <Box height="60px" mb={2}>
              {invoiceData.signature && (
                <img
                  src={invoiceData.signature}
                  alt="Signature"
                  style={{ height: "100%" }}
                />
              )}
            </Box>
            <Text fontSize="xs" fontWeight="bold">
              AUTHORISED SIGNATORY FOR
            </Text>
            <Text fontSize="xs" fontWeight="bold">
              {invoiceData.from.businessName}
            </Text>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default InvoicePDF;