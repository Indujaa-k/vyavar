import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { uploadBulkProducts } from "../../actions/productActions";
import {
  Button,
  Input,
  Text,
  Box,
  Flex,
  Stack,
  useToast,
  Badge,
} from "@chakra-ui/react";
import HashLoader from "react-spinners/HashLoader";
import { FaCloudUploadAlt, FaFileArchive } from "react-icons/fa";

const SAMPLE_COLUMNS = [
  { key: "SKU", sample1: "SKU12345", sample2: "SKU12346" },
  { key: "productGroupId", sample1: "GRP001", sample2: "GRP001" },
  { key: "brandname", sample1: "Nike", sample2: "Nike" },
  { key: "description", sample1: "Cool T-shirt", sample2: "Cool T-shirt" },
  {
    key: "images (filenames | sep)",
    sample1: "img1.jpg|img2.jpg|img3.jpg",
    sample2: "img4.jpg|img5.jpg|img6.jpg",
  },
  {
    key: "sizeChart (pdf filename)",
    sample1: "chart.pdf",
    sample2: "chart.pdf",
  },
  { key: "gender", sample1: "Men", sample2: "Men" },
  { key: "category", sample1: "Topwear", sample2: "Topwear" },
  { key: "subcategory", sample1: "Regular Tees", sample2: "Plain Tees" },
  { key: "type", sample1: "Casual", sample2: "Casual" },
  { key: "ageRange", sample1: "Adult", sample2: "Adult" },
  { key: "fabric", sample1: "Cotton", sample2: "Cotton Polyester" },
  { key: "color", sample1: "Black", sample2: "White" },
  { key: "sizes", sample1: "S,M,L", sample2: "S,M,L" },
  { key: "stockBySize", sample1: "S:10,M:20,L:15", sample2: "S:5,M:10,L:8" },
  { key: "oldPrice", sample1: "120", sample2: "120" },
  { key: "discount", sample1: "20", sample2: "20" },
  { key: "weight", sample1: "0.5", sample2: "0.5" },
  { key: "length", sample1: "30", sample2: "30" },
  { key: "width", sample1: "20", sample2: "20" },
  { key: "height", sample1: "5", sample2: "5" },
  { key: "street1", sample1: "123 Warehouse Rd", sample2: "123 Warehouse Rd" },
  { key: "city", sample1: "Chennai", sample2: "Chennai" },
  { key: "state", sample1: "Tamil Nadu", sample2: "Tamil Nadu" },
  { key: "zip", sample1: "600001", sample2: "600001" },
  { key: "country", sample1: "India", sample2: "India" },
];

const cellStyle = {
  border: "1px solid #ccc",
  padding: "6px 8px",
  whiteSpace: "nowrap",
  fontSize: "11px",
};
const headerStyle = {
  ...cellStyle,
  background: "#1F4E79",
  color: "#fff",
  fontWeight: 600,
};

const BulkUploadPage = () => {
  const [file, setFile] = useState(null);
  const dispatch = useDispatch();
  const toast = useToast();

  const productBulkUpload = useSelector((state) => state.productBulkUpload);
  const { loading, error, success, message } = productBulkUpload;

  useEffect(() => {
    if (success) {
      toast({
        title: "Upload Successful!",
        description: message?.message || "Your products have been uploaded.",
        status: "success",
        duration: 4000,
        isClosable: true,
      });
      setFile(null);
      setTimeout(() => dispatch({ type: "PRODUCT_BULK_UPLOAD_RESET" }), 500);
    }
    if (error) {
      toast({
        title: "Upload Failed",
        description:
          typeof error === "string"
            ? error
            : error.message || "Something went wrong",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    }
  }, [success, error, message, dispatch, toast]);

  const bulkUploadHandler = (e) => {
    e.preventDefault();
    if (!file) {
      toast({
        title: "No file selected.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    dispatch(uploadBulkProducts(file));
  };

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected) setFile(selected);
  };

  return (
    <Flex
      direction="column"
      justify="center"
      align="center"
      minHeight="100vh"
      bg="gray.50"
      p={4}
    >
      <Box
        w="full"
        maxWidth="95vw"
        p={6}
        bg="white"
        borderRadius="md"
        boxShadow="lg"
        display="flex"
        flexDirection="column"
        alignItems="center"
      >
        <h1
          className="titlepanel"
          style={{ color: "black", textAlign: "center", marginBottom: "8px" }}
        >
          Bulk Upload
        </h1>

        {/* ── How to prepare ZIP ── */}
        <Box
          w="full"
          mb={6}
          p={4}
          bg="blue.50"
          borderRadius="md"
          border="1px solid"
          borderColor="blue.200"
        >
          <Text fontWeight="bold" fontSize="md" mb={2} color="blue.800">
            📦 How to prepare your ZIP file
          </Text>
          <Stack spacing={1} fontSize="sm" color="blue.900">
            <Text>1. Fill in the Excel template with your product data.</Text>
            <Text>
              2. In the <b>images</b> column use <b>just the filenames</b>{" "}
              separated by <b>|</b> — e.g.{" "}
              <code>img1.jpg|img2.jpg|img3.jpg</code>
            </Text>
            <Text>
              3. In the <b>sizeChart</b> column use just the <b>PDF filename</b>{" "}
              — e.g. <code>chart.pdf</code>
            </Text>
            <Text>
              4. Put the Excel file <b>and all image/PDF files</b> together in
              one folder.
            </Text>
            <Text>
              5. <b>Select all files</b> → right-click →{" "}
              <b>Compress / Send to ZIP</b>.
            </Text>
            <Text>
              6. Upload the <b>.zip</b> file below. ✅
            </Text>
          </Stack>

          {/* ZIP structure visual */}
          <Box
            mt={3}
            p={3}
            bg="white"
            borderRadius="md"
            fontFamily="mono"
            fontSize="12px"
            color="gray.700"
            border="1px solid"
            borderColor="gray.200"
          >
            <Text fontWeight="bold" mb={1}>
              📁 your-upload.zip
            </Text>
            <Text pl={4}>📄 products.xlsx</Text>
            <Text pl={4}>🖼️ img1.jpg</Text>
            <Text pl={4}>🖼️ img2.jpg</Text>
            <Text pl={4}>🖼️ img3.jpg</Text>
            <Text pl={4}>🖼️ img4.jpg</Text>
            <Text pl={4}>📄 chart.pdf</Text>
            <Text pl={4} color="gray.400">
              … all your images
            </Text>
          </Box>
        </Box>

        {/* ── Sample Table ── */}
        <Box mb={6} w="full" overflowX="auto">
          <Text fontWeight="bold" mb={2} textAlign="center">
            Sample Excel Format
          </Text>
          <table style={{ borderCollapse: "collapse", width: "100%" }}>
            <thead>
              <tr>
                {SAMPLE_COLUMNS.map((col) => (
                  <th key={col.key} style={headerStyle}>
                    {col.key}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                {SAMPLE_COLUMNS.map((col) => (
                  <td key={col.key} style={cellStyle}>
                    {col.sample1}
                  </td>
                ))}
              </tr>
              <tr style={{ background: "#f9f9f9" }}>
                {SAMPLE_COLUMNS.map((col) => (
                  <td key={col.key} style={cellStyle}>
                    {col.sample2}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </Box>

        <Button
          colorScheme="blue"
          variant="outline"
          mb={6}
          onClick={() =>
            window.open(
              "/templates/Bulk_Product_Upload_Template.xlsx",
              "_blank",
            )
          }
        >
          Download Excel Template
        </Button>

        {/* ── Loader ── */}
        {loading && (
          <Flex
            position="fixed"
            top="0"
            left="0"
            width="100vw"
            height="100vh"
            bg="rgba(255,255,255,0.7)"
            zIndex="9999"
            justify="center"
            align="center"
          >
            <HashLoader size={60} />
          </Flex>
        )}

        {error && (
          <Text color="red.500" textAlign="center" mb={4}>
            {typeof error === "string" ? error : error?.message}
          </Text>
        )}
        {success && (
          <Box textAlign="center" mb={4}>
            <Text color="green.500">{message?.message}</Text>
            <Text color="gray.600" fontSize="sm">
              Products created: {message?.productsCreated}
            </Text>
            {message?.warning && (
              <Text color="orange.500" fontSize="sm">
                {message.warning}
              </Text>
            )}
          </Box>
        )}

        {/* ── Upload Form ── */}
        <form
          onSubmit={bulkUploadHandler}
          style={{ width: "100%", maxWidth: "420px" }}
        >
          <Flex direction="column" align="center">
            <Flex
              direction="column"
              align="center"
              justify="center"
              border="2px dashed #4A90E2"
              borderRadius="8px"
              p={8}
              width="100%"
              mb={4}
              _hover={{ cursor: "pointer", borderColor: "#0074D9" }}
              onClick={() => document.getElementById("zip-file-input").click()}
            >
              <FaFileArchive size={44} color="#4A90E2" />
              <Text mt={3} fontSize="lg" color="#4A90E2" textAlign="center">
                Click to select your <b>.zip</b> file
              </Text>
              <Badge mt={2} colorScheme="blue">
                .zip only
              </Badge>
              <Input
                type="file"
                accept=".zip,application/zip,application/x-zip-compressed"
                onChange={handleFileChange}
                disabled={loading}
                display="none"
                id="zip-file-input"
              />
            </Flex>

            {file && (
              <Stack spacing={1} align="center" mb={4}>
                <Text fontWeight="bold">Selected:</Text>
                <Text>{file.name}</Text>
                <Text fontSize="sm" color="gray.500">
                  Size: {(file.size / (1024 * 1024)).toFixed(2)} MB
                </Text>
                <Button
                  size="sm"
                  colorScheme="red"
                  onClick={() => setFile(null)}
                >
                  Remove
                </Button>
              </Stack>
            )}

            <Button
              type="submit"
              colorScheme="teal"
              size="lg"
              isDisabled={!file || loading}
              w="full"
            >
              Upload ZIP
            </Button>
          </Flex>
        </form>
      </Box>
    </Flex>
  );
};

export default BulkUploadPage;
