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
} from "@chakra-ui/react";
import HashLoader from "react-spinners/HashLoader";
import { FaCloudUploadAlt } from "react-icons/fa";

const SAMPLE_COLUMNS = [
  { key: "SKU", sample1: "SKU12345", sample2: "SKU12346" },
  { key: "productGroupId", sample1: "GRP001", sample2: "GRP001" },
  { key: "brandname", sample1: "Nike", sample2: "Nike" },
  { key: "description", sample1: "Cool T-shirt", sample2: "Cool T-shirt" },
  {
    key: "images (| separated paths)",
    sample1: "D:/images/img1.jpg|D:/images/img2.jpg",
    sample2: "D:/images/img3.jpg|D:/images/img4.jpg",
  },
  {
    key: "sizeChart (pdf path)",
    sample1: "D:/sizecharts/chart1.pdf",
    sample2: "D:/sizecharts/chart1.pdf",
  },
  { key: "gender", sample1: "Men", sample2: "Men" },
  { key: "category", sample1: "Topwear", sample2: "Topwear" },
  { key: "subcategory", sample1: "Regular Tees", sample2: "Plain Tees" },
  { key: "type", sample1: "Casual", sample2: "Casual" },
  { key: "ageRange", sample1: "Adult", sample2: "Adult" },
  { key: "fabric", sample1: "Cotton", sample2: "Cotton Polyester" },
  { key: "color", sample1: "Black", sample2: "White" },
  { key: "sizes (comma separated)", sample1: "S,M,L", sample2: "S,M,L" },
  {
    key: "stockBySize (size:qty)",
    sample1: "S:10,M:20,L:15",
    sample2: "S:5,M:10,L:8",
  },
  { key: "oldPrice", sample1: "120", sample2: "120" },
  { key: "discount", sample1: "20", sample2: "20" },
];

const cellStyle = {
  border: "1px solid #ccc",
  padding: "6px 8px",
  whiteSpace: "nowrap",
};
const headerStyle = {
  ...cellStyle,
  background: "#4A90E2",
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
      setTimeout(() => {
        dispatch({ type: "PRODUCT_BULK_UPLOAD_RESET" });
      }, 500);
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
        description: "Please select a file to upload.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }
    dispatch(uploadBulkProducts(file));
    toast({
      title: "Uploading...",
      description: "Your file is being uploaded.",
      status: "info",
      duration: 5000,
      isClosable: true,
    });
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) setFile(selectedFile);
  };

  const clearFile = () => setFile(null);

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
          style={{ color: "black", textAlign: "center", marginBottom: "20px" }}
        >
          Bulk Upload
        </h1>

        {/* ── Sample Table ── */}
        <Box mb={6} w="full" overflowX="auto">
          <Text fontWeight="bold" mb={2} textAlign="center">
            Sample Excel Format
          </Text>
          <table
            style={{
              borderCollapse: "collapse",
              fontSize: "12px",
              width: "100%",
            }}
          >
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

          {/* Legend */}
          <Box mt={3} p={3} bg="blue.50" borderRadius="md" fontSize="12px">
            <Text fontWeight="bold" mb={1}>
              📋 Field Notes:
            </Text>
            <Text>
              • <b>productGroupId</b> — same value groups color variants under
              one product
            </Text>
            <Text>
              • <b>images</b> — full disk paths separated by <b>|</b> (min 3,
              max 5)
            </Text>
            <Text>
              • <b>sizeChart</b> — full disk path to a single <b>.pdf</b> file
              (optional)
            </Text>
            <Text>
              • <b>gender</b> — Men / Women / Unisex
            </Text>
            <Text>
              • <b>category</b> — Topwear / Hoodies / Bottomwear / Innerwear /
              Gym Wears
            </Text>
            <Text>
              • <b>subcategory</b> — e.g. Regular Tees / Plain Tees / Embroidery
              Tees / Oversized …
            </Text>
            <Text>
              • <b>type</b> — Casual / Formal / Sports
            </Text>
            <Text>
              • <b>ageRange</b> — Kids / Teen / Adult
            </Text>
            <Text>
              • <b>fabric</b> — Cotton / Polyester / Cotton Lycra …{" "}
            </Text>
            <Text>
              • <b>sizes</b> — comma separated: S,M,L,XL,XXL
            </Text>
            <Text>
              • <b>stockBySize</b> — size:qty pairs: S:10,M:20,L:15
            </Text>
            <Text>
              • <b>discount</b> — percentage number e.g. 20 (means 20%)
            </Text>
          </Box>
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
            bg="rgba(255, 255, 255, 0.7)"
            zIndex="9999"
            justify="center"
            align="center"
          >
            <HashLoader size={60} />
          </Flex>
        )}

        {/* ── Error / Success messages ── */}
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
          </Box>
        )}

        {/* ── Upload Form ── */}
        <form
          onSubmit={bulkUploadHandler}
          style={{ width: "100%", maxWidth: "400px" }}
        >
          <Flex direction="column" align="center" mb={4}>
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
            >
              <FaCloudUploadAlt size={40} color="#4A90E2" />
              <Text mt={4} fontSize="lg" color="#4A90E2" textAlign="center">
                Drag & Drop your file here, or click to select
              </Text>

              <Input
                type="file"
                accept=".xlsx,.xls"
                onChange={handleFileChange}
                disabled={loading}
                display="none"
                id="file-input"
              />

              <Button
                as="label"
                htmlFor="file-input"
                colorScheme="teal"
                variant="outline"
                mt={4}
              >
                Choose File
              </Button>
            </Flex>

            {file && (
              <Stack spacing={2} align="center" mb={4}>
                <Text fontWeight="bold">Selected File:</Text>
                <Text>{file.name}</Text>
                <Text fontSize="sm" color="gray.500">
                  Size: {Math.round(file.size / 1024)} KB
                </Text>
                <Button size="sm" colorScheme="red" onClick={clearFile}>
                  Clear File
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
              Upload
            </Button>
          </Flex>
        </form>
      </Box>
    </Flex>
  );
};

export default BulkUploadPage;
