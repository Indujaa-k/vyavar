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
} from "@chakra-ui/react";
import { useState } from "react";
import { ChevronUpIcon, ChevronDownIcon } from "@chakra-ui/icons";

const ProductSpecification = ({ product }) => {
  const [showMore, setShowMore] = useState(false);
  const [showMobileSizeChart, setShowMobileSizeChart] = useState(false);

  const toggleView = () => setShowMore(!showMore);

  return (
    <>
      <Tabs className="product-info-table">
        <TabList>
          <Tab className="product-info-header">SPECIFICATION</Tab>
          <Tab className="product-info-header">DESCRIPTION</Tab>
          <Tab className="product-info-header desktop-only">SIZE CHART</Tab>
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
                  {product?.productdetails?.sizes || "Not available"}
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
          {/* Size Chart Tab */}
          <TabPanel className="desktop-only">
            <SizeChart product={product} />
          </TabPanel>
        </TabPanels>
      </Tabs>

      <Button
        display={{ base: "block", md: "none" }}
        width="100%"
        mt={4}
        colorScheme="gray"
        onClick={() => setShowMobileSizeChart(true)}
      >
        View Size Chart
      </Button>

      {showMobileSizeChart && (
        <Box className="mobile-size-chart" position="relative">
          {/* Close Button */}
          <Button
            size="sm"
            position="absolute"
            top="8px"
            right="8px"
            zIndex="10"
            onClick={() => setShowMobileSizeChart(false)}
          >
            ✕
          </Button>

          <SizeChart product={product} />
        </Box>
      )}

      {/* <div className="product-info-table">
        <div className="product-info-content">
    
          <span>Product Code</span>
          <strong>{product?.SKU || "Not available"}</strong>
          <div className="info-item">
            <span>Product Code</span>
            <strong>{product?.SKU || "Not available"}</strong>
          </div>
        </div>
        <div className="info-item">
          <span>Origin Country</span>
          <strong>{product?.shippingDetails?.originAddress?.country}</strong>
        </div>

       

        <div className="info-item">
          <span>Origin Address</span>
          <strong>
            {product?.shippingDetails?.originAddress?.street1
              ? `${product.shippingDetails.originAddress.street1}, 
               ${product.shippingDetails.originAddress.city}, 
               ${product.shippingDetails.originAddress.state}, 
               ${product.shippingDetails.originAddress.zip}, 
               ${product.shippingDetails.originAddress.country}`
              : "Not available"}
          </strong>
        </div>
      </div> */}
    </>
  );
};

export default ProductSpecification;

const SizeChart = ({ product }) => {
  if (!product?.sizeChart) {
    return <Text fontWeight="bold">Size Chart: Not Available</Text>;
  }

  return (
    <Box mt={4}>
      <Text fontSize="lg" fontWeight="bold" mb={3}>
        Size Chart
      </Text>

      <iframe
        src={`https://docs.google.com/gview?url=${encodeURIComponent(
          product.sizeChart
        )}&embedded=true`}
        width="100%"
        height="400px"
        style={{ border: "1px solid #ccc", borderRadius: "8px" }}
        title="Size Chart"
      />
    </Box>
  );
};
