import { useState, useEffect } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Box,
  Image,
  Text,
  Flex,
  Stack,
  Badge,
} from "@chakra-ui/react";
const API_URL = process.env.REACT_APP_API_URL;

const ProductViewModal = ({ isOpen, onClose, product }) => {
  const [activeImage, setActiveImage] = useState("");

  console.log("product view:", product);
  useEffect(() => {
    if (product?.images?.length > 0) {
      setActiveImage(product.images[0]);
    }
  }, [product]);

  if (!product) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="4xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Product Details</ModalHeader>
        <ModalCloseButton />

        <ModalBody>
          <Flex gap={6}>
            {/* LEFT – Image Section */}
            <Box w="45%">
              <Image
                src={`${API_URL}/${activeImage}`}
                alt={product.brandname}
                w="100%"
                h="350px"
                objectFit="cover"
                borderRadius="md"
                mb={3}
              />

              <Flex gap={3}>
                {product.images?.map((img, index) => (
                  <Image
                    key={index}
                    src={`${API_URL}/${img}`}
                    alt={`thumb-${index}`}
                    w="70px"
                    h="70px"
                    objectFit="cover"
                    cursor="pointer"
                    borderRadius="md"
                    border={
                      activeImage === img
                        ? "2px solid #3182ce"
                        : "1px solid #e2e8f0"
                    }
                    onClick={() => setActiveImage(img)}
                  />
                ))}
              </Flex>
            </Box>

            {/* RIGHT – Details Section */}
            <Box w="55%" border="2px solid #3182ce" borderRadius="20px" p={5}>
              <Stack spacing={3}>
                <Text fontSize="xl" fontWeight="bold">
                  {product.brandname}
                </Text>

                <Text color="gray.600">{product.description}</Text>

                <Flex align="center" gap={3}>
                  <Text fontSize="xl" fontWeight="bold" color="green.600">
                    ₹{product.price}
                  </Text>
                  <Text
                    fontSize="md"
                    textDecoration="line-through"
                    color="gray.500"
                  >
                    ₹{product.oldPrice}
                  </Text>
                  <Badge colorScheme="red">{product.discount}% OFF</Badge>
                  <Badge colorScheme="yellow">⭐ {product.rating}</Badge>

                  <Text fontSize="sm" color="gray.600">
                    ({product.numReviews} reviews)
                  </Text>
                </Flex>

                <Text>
                  <b>Color:</b> {product.productdetails?.color}
                </Text>

                <Text>
                  <b>Fabric:</b> {product.productdetails?.fabric}
                </Text>

                <Text>
                  <b>Category:</b> {product.productdetails?.category} /{" "}
                  {product.productdetails?.subcategory}
                </Text>

                {/* Sizes */}
                <Box>
                  <Text fontWeight="bold" mb={1}>
                    Sizes
                  </Text>
                  <Flex gap={2} wrap="wrap">
                    {product.productdetails?.sizes?.map((size) => (
                      <Badge key={size} colorScheme="blue">
                        {size}
                      </Badge>
                    ))}
                  </Flex>
                </Box>

                {/* Stock */}
                <Box>
                  <Text fontWeight="bold" mb={1}>
                    Stock
                  </Text>
                  <Stack spacing={1}>
                    {product.productdetails?.stockBySize?.map((s) => (
                      <Text
                        key={s.size}
                        color={
                          s.stock > 10
                            ? "green.600"
                            : s.stock > 0
                              ? "orange.500"
                              : "red.500"
                        }
                      >
                        {s.size}: {s.stock}
                      </Text>
                    ))}
                  </Stack>
                </Box>
              </Stack>
            </Box>
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default ProductViewModal;
