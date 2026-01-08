import React, { useEffect } from "react";
import { useCallback } from "react";
import { VscChromeClose } from "react-icons/vsc";
import {
  addToCart,
  removeFromCart,
  fetchCart,
} from "../../actions/cartActions";
import {
  Box,
  Flex,
  Image,
  Text,
  Select,
  Grid,
  GridItem,
  Button,
  IconButton,
  VStack,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Empty from "../../components/Empty";
import Trust from "../../components/Trustdetails/Trust";
import "./cartcss.css";
import Checkout from "../checkout/Checkout";
import AddressSelection from "./AddressSelection";
import { Spinner } from "@chakra-ui/react";

const CartPage = () => {
  const dispatch = useDispatch();
  const [initialLoading, setInitialLoading] = React.useState(true);

  // const cartItems = useSelector((state) => state.cart?.cartItems || []);
  const cartItems = useSelector((state) => state.cart?.cartItems || []);

  useEffect(() => {
    dispatch(fetchCart()).finally(() => {
      setInitialLoading(false);
    });
  }, [dispatch]);

  const removeFromCartHandler = useCallback(
    (cartItemId) => {
      dispatch(removeFromCart(cartItemId));
    },
    [dispatch]
  );
  if (initialLoading) {
    return (
      <Flex justify="center" align="center" minH="60vh">
        <Spinner size="xl" color="blue.500" />
      </Flex>
    );
  }

  return (
    <>
      <Box
        color="black"
        bg="white"
        mt={{ base: "80px", md: "120px" }}
        ml={{ base: "7px", md: "50px" }}
        mr={{ base: "7px" }}
      >
        {cartItems.length === 0 ? (
          <Empty />
        ) : (
          <Grid
            templateColumns={{ base: "1fr", md: "1fr 1fr   ", lg: "2fr 1fr" }}
            gap={{ base: 1, lg: 3 }}
          >
            {/* Left Side - Cart Items */}
            <GridItem>
              <VStack spacing={4} mt={5}>
                <AddressSelection />
              </VStack>
              <Text fontSize="lg" fontWeight="bold" mt={5}>
                ITEMS({cartItems.length})
              </Text>
              {cartItems.map((item) => {
                const selectedSize = item.size;

                const stock =
                  item.product?.productdetails?.stockBySize?.find(
                    (s) => s.size === selectedSize
                  )?.stock || 0;

                const availableSizes =
                  item.product?.productdetails?.sizes || [];

                return (
                  <Flex
                    key={item._id}
                    border="1px solid #E2E8F0"
                    borderRadius="md"
                    p={4}
                    alignItems="center"
                    mb={3}
                    position="relative"
                  >
                    {/* IMAGE */}
                    <Box
                      w="100px"
                      h="130px"
                      overflow="hidden"
                      borderRadius="md"
                    >
                      <Link to={`/product/${item.product._id}`}>
                        <Image
                          src={item.product.images?.[0]}
                          alt={item.product.name}
                          objectFit="cover"
                          w="full"
                          h="full"
                        />
                      </Link>
                    </Box>

                    {/* DETAILS */}
                    <Box flex="1" ml={4}>
                      <Text fontWeight="bold">{item.product.brandname}</Text>
                      <Text fontSize="sm" color="gray.500">
                        {item.product.name}
                      </Text>
                      <Text fontSize="sm" color="gray.500">
                        {item.product.description}
                      </Text>

                      {/* SIZE + QTY */}
                      <Flex gap={3} mt={2}>
                        {/* SIZE */}
                        <Select
                          value={item.size || ""}
                          onChange={(e) =>
                            dispatch(
                              addToCart(item.product._id, {
                                cartItemId: item._id,
                                qty: item.qty, // ✅ keep same quantity
                                size: e.target.value, // ✅ change size
                                action: "set",
                              })
                            )
                          }
                          w="80px"
                          size="sm"
                        >
                          {item.product.productdetails?.sizes?.map((size) => {
                            const sizeStock =
                              item.product.productdetails.stockBySize?.find(
                                (s) => s.size === size
                              )?.stock || 0;

                            return (
                              <option
                                key={size}
                                value={size}
                                disabled={sizeStock === 0}
                              >
                                {size} {sizeStock === 0 && "(Out)"}
                              </option>
                            );
                          })}
                        </Select>

                        {/* QTY */}
                        <Select
                          value={item.qty}
                          onChange={(e) =>
                            dispatch(
                              addToCart(item.product._id, {
                                qty: Number(e.target.value), // ✅ absolute quantity
                                size: item.size,
                                action: "set",
                              })
                            )
                          }
                          w="80px"
                          size="sm"
                        >
                          {[
                            ...Array(
                              item.product.productdetails.stockBySize?.find(
                                (s) => s.size === item.size
                              )?.stock || 0
                            ).keys(),
                          ].map((x) => (
                            <option key={x + 1} value={x + 1}>
                              {x + 1}
                            </option>
                          ))}
                        </Select>
                      </Flex>
                      {/* PRICE */}
                      <Flex mt={2} align="center" gap={2}>
                        {/* FINAL CART PRICE */}
                        <Text fontWeight="bold" fontSize="lg">
                          ₹{item.price}
                        </Text>

                        {/* STRIKE MRP */}
                        {item.product?.oldPrice && (
                          <Text
                            as="span"
                            fontSize="sm"
                            color="gray.500"
                            textDecoration="line-through"
                          >
                            MRP: ₹{item.product.oldPrice * item.qty}
                          </Text>
                        )}

                        {/* SUBSCRIPTION DISCOUNT TEXT */}
                        {item.product.isSubscriptionApplied && (
                          <Text
                            color="green.500"
                            fontWeight="bold"
                            fontSize="sm"
                          >
                            {item.product.subscriptionDiscountPercent}%
                            Subscriber OFF
                          </Text>
                        )}
                      </Flex> 
                    </Box>

                    {/* REMOVE */}
                    <IconButton
                      icon={<VscChromeClose />}
                      colorScheme="red"
                      variant="ghost"
                      position="absolute"
                      top="10px"
                      right="10px"
                      onClick={() => removeFromCartHandler(item._id)}
                    />
                  </Flex>
                );
              })}
            </GridItem>
            {/* Right Side - Order Summary */}
            <GridItem>
              <Checkout />
            </GridItem>
          </Grid>
        )}
        <Trust />
      </Box>
    </>
  );
};

export default CartPage;
