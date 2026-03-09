import React from "react";
import "./ProductSpecification.css";
import {
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Button,
  Collapse,
  Box,
  Text,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  useDisclosure,
} from "@chakra-ui/react";
import { useState } from "react";
import { ChevronUpIcon, ChevronDownIcon } from "@chakra-ui/icons";

const ProductSpecification = ({ product }) => {
  const [showMore, setShowMore] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const toggleView = () => setShowMore(!showMore);

  return (
    <>
      <Tabs className="product-info-table" isFitted={false} variant="unstyled">
        <TabList>
          <Tab className="product-info-header">SPECIFICATION</Tab>
          <Tab className="product-info-header">DESCRIPTION</Tab>
          <Tab className="product-info-header">SIZE CHART</Tab>
        </TabList>

        <TabPanels>
          {/* Specification Tab */}
          <TabPanel>
            <div className="product-info-content two-column-layout">
              <div className="info-item">
                <span>Category</span>
                <strong>
                  {product?.productdetails?.category || "Not available"}
                </strong>
              </div>
              <div className="info-item">
                <span>Sub Category</span>
                <strong>
                  {product?.productdetails?.subcategory || "Not available"}
                </strong>
              </div>
              <div className="info-item">
                <span>Age Range</span>
                <strong>
                  {product?.productdetails?.ageRange || "Not available"}
                </strong>
              </div>
              <div className="info-item">
                <span>Gender</span>
                <strong>
                  {product?.productdetails?.gender || "Not available"}
                </strong>
              </div>
              <div className="info-item">
                <span>Product Type</span>
                <strong>
                  {product?.productdetails?.type || "Not available"}
                </strong>
              </div>
              <div className="info-item">
                <span>Size</span>
                <strong>
                  {Array.isArray(product?.productdetails?.sizes)
                    ? product.productdetails.sizes.join(", ")
                    : product?.productdetails?.sizes || "Not available"}
                </strong>
              </div>
            </div>

            <Collapse in={showMore}>
              <div className="product-info-column">
                <div className="info-item">
                  <span>Fabric</span>
                  <strong>
                    {product?.productdetails?.fabric || "Not available"}
                  </strong>
                </div>
                <div className="info-item">
                  <span>Color</span>
                  <strong>
                    {product?.productdetails?.color || "Not available"}
                  </strong>
                </div>
              </div>
            </Collapse>

            <Button
              size="md"
              mt="4"
              colorScheme="gray"
              onClick={toggleView}
              width="100%"
            >
              {showMore ? (
                <>
                  View Less <ChevronUpIcon boxSize={5} ml={2} />
                </>
              ) : (
                <>
                  View More <ChevronDownIcon boxSize={5} ml={2} />
                </>
              )}
            </Button>
          </TabPanel>

          {/* Description Tab */}
          <TabPanel>
            <Box>
              <Text fontWeight="bold">Product Description</Text>
              <Text>{product.description}</Text>
              <Text fontWeight="bold">Product Code</Text>
              <Text>{product?.SKU || "Not available"}</Text>

              <Text fontSize="lg" fontWeight="bold" mt={4}>
                Manufactured By:
              </Text>
              <Text>
                {product?.shippingDetails?.originAddress
                  ? `${product.shippingDetails.originAddress.street1}, 
           ${product.shippingDetails.originAddress.city}, 
           ${product.shippingDetails.originAddress.state}, 
           ${product.shippingDetails.originAddress.zip}, 
           ${product.shippingDetails.originAddress.country}`
                  : "Manufacturer details not available"}
              </Text>
              <Collapse in={showMore}>
                <Text>
                  Country Of Origin:{" "}
                  {product?.shippingDetails?.originAddress?.country ||
                    "Not available"}
                </Text>
                <Text>Net Quantity: 1N</Text>
                <Text>
                  Color shown in the picture may vary from the actual product
                  due to different lighting.
                </Text>
              </Collapse>

              <Button
                size="md"
                mt="4"
                colorScheme="gray"
                onClick={toggleView}
                width="100%"
              >
                {showMore ? (
                  <>
                    View Less <ChevronUpIcon boxSize={5} ml={2} />
                  </>
                ) : (
                  <>
                    View More <ChevronDownIcon boxSize={5} ml={2} />
                  </>
                )}
              </Button>
            </Box>
          </TabPanel>

          {/* Size Chart Tab — shows button that opens modal */}
          <TabPanel>
            <Box textAlign="center" py={6}>
              {product?.sizeChart ? (
                <>
                  <Text mb={4} color="gray.600" fontSize="sm">
                    Click below to view the size chart
                  </Text>
                  <Button
                    colorScheme="blackAlpha"
                    bg="black"
                    color="white"
                    size="md"
                    px={8}
                    _hover={{ bg: "gray.800" }}
                    onClick={onOpen}
                  >
                    View Size Chart
                  </Button>
                </>
              ) : (
                <Text color="gray.500" fontWeight="medium">
                  Size Chart not available for this product
                </Text>
              )}
            </Box>
          </TabPanel>
        </TabPanels>
      </Tabs>

      {/* ── Size Chart Modal ── */}
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        size="4xl"
        scrollBehavior="inside"
      >
        <ModalOverlay bg="blackAlpha.700" backdropFilter="blur(4px)" />
        <ModalContent mx={4} borderRadius="xl" overflow="hidden">
          <ModalHeader bg="black" color="white" fontSize="md" py={4}>
            Size Chart
          </ModalHeader>
          <ModalCloseButton color="white" top={3} />
          <ModalBody p={0}>
            <SizeChart product={product} />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ProductSpecification;

/* ── Size Chart Viewer — handles both PDF and image ── */
const SizeChart = ({ product }) => {
  if (!product?.sizeChart) {
    return (
      <Box p={6}>
        <Text fontWeight="bold">Size Chart: Not Available</Text>
      </Box>
    );
  }

  const API_URL = (process.env.REACT_APP_API_URL || "").replace(/\/$/, "");
  const cleanPath = product.sizeChart.replace(/\\/g, "/");
  const fileUrl = `${API_URL}/${cleanPath}`;
  const isPdf = cleanPath.toLowerCase().endsWith(".pdf");

  if (isPdf) {
    return (
      <Box height="80vh">
        <iframe
          src={`${fileUrl}#toolbar=0&navpanes=0&scrollbar=1`}
          width="100%"
          height="100%"
          style={{ border: "none", display: "block" }}
          title="Size Chart PDF"
        />
      </Box>
    );
  }

  // ✅ Image — contain inside modal, no zoom, no crop
  return (
    <Box
      p={4}
      display="flex"
      justifyContent="center"
      alignItems="center"
      maxH="80vh"
      overflowY="auto"
    >
      <img
        src={fileUrl}
        alt="Size Chart"
        style={{
          maxWidth: "100%",
          maxHeight: "75vh",
          objectFit: "contain",
          display: "block",
        }}
      />
    </Box>
  );
};
