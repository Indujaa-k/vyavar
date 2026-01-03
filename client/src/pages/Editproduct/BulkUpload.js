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
  Center,
} from "@chakra-ui/react";
import HashLoader from "react-spinners/HashLoader";
import { FaCloudUploadAlt } from "react-icons/fa";

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

  {
    {
      error && (
        <Text color="red.500" textAlign="center" mb={4}>
          {typeof error === "string" ? error : error.message}
        </Text>
      );
    }
  }

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const clearFile = () => {
    setFile(null);
  };

  return (
    <Flex
      direction="column"
      justify="center"
      align="center"
      height="100vh"
      bg="gray.50"
      p={4}
    >
      <Box
        w="full"
        maxWidth="600px"
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
        <Box mb={6} w="full" overflowX="auto">
          <Text fontWeight="bold" mb={2} textAlign="center">
            Sample Excel Format
          </Text>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              fontSize: "12px",
            }}
          >
            <thead>
              <tr style={{ background: "#4A90E2", color: "#fff" }}>
                <th style={{ border: "1px solid #ccc", padding: "4px" }}>
                  SKU
                </th>
                <th style={{ border: "1px solid #ccc", padding: "4px" }}>
                  productGroupId
                </th>
                <th style={{ border: "1px solid #ccc", padding: "4px" }}>
                  brandname
                </th>
                <th style={{ border: "1px solid #ccc", padding: "4px" }}>
                  description
                </th>
                <th style={{ border: "1px solid #ccc", padding: "4px" }}>
                  images (disk path | separated)
                </th>
                <th style={{ border: "1px solid #ccc", padding: "4px" }}>
                  color
                </th>
                <th style={{ border: "1px solid #ccc", padding: "4px" }}>
                  sizes (comma separated)
                </th>
                <th style={{ border: "1px solid #ccc", padding: "4px" }}>
                  stockBySize (size:qty comma separated)
                </th>
                <th style={{ border: "1px solid #ccc", padding: "4px" }}>
                  oldPrice
                </th>
                <th style={{ border: "1px solid #ccc", padding: "4px" }}>
                  discount
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ border: "1px solid #ccc", padding: "4px" }}>
                  SKU12345
                </td>
                <td style={{ border: "1px solid #ccc", padding: "4px" }}>
                  GRP001
                </td>
                <td style={{ border: "1px solid #ccc", padding: "4px" }}>
                  Nike
                </td>
                <td style={{ border: "1px solid #ccc", padding: "4px" }}>
                  Cool T-shirt
                </td>
                <td style={{ border: "1px solid #ccc", padding: "4px" }}>
                  D:/images/tshirt1.jpg|D:/images/tshirt2.jpg
                </td>
                <td style={{ border: "1px solid #ccc", padding: "4px" }}>
                  Black
                </td>
                <td style={{ border: "1px solid #ccc", padding: "4px" }}>
                  S,M,L
                </td>
                <td style={{ border: "1px solid #ccc", padding: "4px" }}>
                  S:10,M:20,L:15
                </td>
                <td style={{ border: "1px solid #ccc", padding: "4px" }}>
                  120
                </td>
                <td style={{ border: "1px solid #ccc", padding: "4px" }}>20</td>
              </tr>
              <tr>
                <td style={{ border: "1px solid #ccc", padding: "4px" }}>
                  SKU12346
                </td>
                <td style={{ border: "1px solid #ccc", padding: "4px" }}>
                  GRP001
                </td>
                <td style={{ border: "1px solid #ccc", padding: "4px" }}>
                  Nike
                </td>
                <td style={{ border: "1px solid #ccc", padding: "4px" }}>
                  Cool T-shirt
                </td>
                <td style={{ border: "1px solid #ccc", padding: "4px" }}>
                  D:/images/tshirt3.jpg|D:/images/tshirt4.jpg
                </td>
                <td style={{ border: "1px solid #ccc", padding: "4px" }}>
                  White
                </td>
                <td style={{ border: "1px solid #ccc", padding: "4px" }}>
                  S,M,L
                </td>
                <td style={{ border: "1px solid #ccc", padding: "4px" }}>
                  S:5,M:10,L:8
                </td>
                <td style={{ border: "1px solid #ccc", padding: "4px" }}>
                  120
                </td>
                <td style={{ border: "1px solid #ccc", padding: "4px" }}>20</td>
              </tr>
            </tbody>
          </table>
        </Box>
        <Button
          colorScheme="blue"
          variant="outline"
          mb={4}
          onClick={() =>
            window.open(
              "/templates/Bulk_Product_Upload_Template.xlsx",
              "_blank"
            )
          }
        >
          Download Excel Template
        </Button>
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

        <form onSubmit={bulkUploadHandler}>
          <Flex direction="column" align="center" mb={4}>
            {/* File input section */}
            <Flex
              direction="column"
              align="center"
              justify="center"
              border="2px dashed #4A90E2"
              borderRadius="8px"
              p={8}
              width="100%"
              maxWidth="400px"
              mb={4}
              _hover={{ cursor: "pointer", borderColor: "#0074D9" }}
            >
              <FaCloudUploadAlt size={40} color="#4A90E2" />
              <Text mt={4} fontSize="lg" color="#4A90E2" textAlign="center">
                Drag & Drop your file here, or click to select
              </Text>

              {/* Hidden file input */}
              <Input
                type="file"
                accept=".xlsx,.xls"
                onChange={handleFileChange}
                disabled={loading}
                display="none"
                id="file-input"
              />

              {/* Custom button to trigger file input */}
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

            {/* File details display */}
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

            {/* Upload button */}
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
