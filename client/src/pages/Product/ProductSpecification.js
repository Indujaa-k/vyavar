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

  const toggleView = () => setShowMore(!showMore);

  return (
    <>
      <Tabs className="product-info-table">
        <TabList>
          <Tab className="product-info-header">SPECIFICATION</Tab>
          <Tab className="product-info-header">DESCRIPTION</Tab>
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
              <Text>Product Description</Text>
              <Text>{product.description}</Text>

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
        </TabPanels>
      </Tabs>
      <div className="product-info-table">
        <div className="product-info-content">
          {/* SKU Code */}

          <div className="info-item">
            <span>Product Code</span>
            <strong>{product?.SKU || "Not available"}</strong>
          </div>
        </div>
        <div className="info-item">
          <span>Origin Country</span>
          <strong>{product?.shippingDetails?.originAddress?.country}</strong>
        </div>

        {/* Origin Address */}

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
      </div>
    </>
  );
};

export default ProductSpecification;
