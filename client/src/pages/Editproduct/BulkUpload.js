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
        description: "Your products have been uploaded.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    }

    if (error) {
      toast({
        title: "Upload Failed",
        description:
          typeof error === "string"
            ? error
            : error.message || "Something went wrong",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  }, [success, error, toast]);

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
    error && (
      <Text color="red.500" textAlign="center">
        {typeof error === "string"
          ? error
          : error?.message
          ? error.message
          : JSON.stringify(error)}
      </Text>
    );
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

        {loading ? (
          <div className="loading">
            <HashLoader color={"#1e1e2c"} size={40} />
          </div>
        ) : error ? (
          <Text color="red.500" textAlign="center">
            {error.message}
          </Text>
        ) : success ? (
          <Text color="green.500" textAlign="center">
            {message}
          </Text>
        ) : (
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
                isDisabled={!file}
                w="full"
              >
                Upload
              </Button>
            </Flex>
          </form>
        )}
      </Box>
    </Flex>
  );
};

export default BulkUploadPage;
