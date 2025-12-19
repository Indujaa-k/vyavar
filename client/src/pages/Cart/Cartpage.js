// import React, { useEffect } from "react";
// import { useCallback } from "react";
// import { VscChromeClose } from "react-icons/vsc";
// import {
//   addToCart,
//   removeFromCart,
//   fetchCart,
// } from "../../actions/cartActions";
// import {
//   Box,
//   Flex,
//   Image,
//   Text,
//   Select,
//   Grid,
//   GridItem,
//   Button,
//   IconButton,
//   VStack,
// } from "@chakra-ui/react";
// import { Link } from "react-router-dom";
// import { useDispatch, useSelector } from "react-redux";
// import Empty from "../../components/Empty";
// import Trust from "../../components/Trustdetails/Trust";
// import "./cartcss.css";
// import Checkout from "../checkout/Checkout";
// import AddressSelection from "./AddressSelection";

// const CartPage = () => {
//   const dispatch = useDispatch();
//   const cart = useSelector((state) => state.cart);
//   const { cartItems } = cart;

//   useEffect(() => {
//     dispatch(fetchCart());
//   }, [dispatch]);

//   const removeFromCartHandler = useCallback(
//     (cartItemId) => {
//       console.log("Removing cart item:", cartItemId);
//       dispatch(removeFromCart(cartItemId)).then(() => {
//         dispatch(fetchCart()); // Fetch the cart again after removal
//       });
//     },
//     [dispatch]
//   );

//   return (
//     <>
//       <Box mt="120px" color="black" bg="white">
//         {cartItems.length === 0 ? (
//           <Empty />
//         ) : (
//           <Grid templateColumns={{ base: "1fr", md: "2fr 1fr" }} gap={3}>
//             {/* Left Side - Cart Items */}
//             <GridItem>
//               <VStack spacing={4} mt={5}>
//                 <AddressSelection />
//               </VStack>
//               <Text fontSize="lg" fontWeight="bold" mt={5}>
//                 ITEMS({cartItems.length})
//               </Text>
//               {cartItems.map((item) => {
//                 const selectedSize = item.size;

//                 const availableSizes = item.product.productdetails?.sizes || [];

//                 // Get stock for the selected size
//                 const sizeStock =
//                   item.product.productdetails.stockBySize?.find(
//                     (s) => s.size === selectedSize
//                   )?.stock || 0;

//                 return (
//                   <Flex
//                     key={item._id}
//                     border="1px solid #E2E8F0"
//                     borderRadius="md"
//                     p={4}
//                     alignItems="center"
//                     mb={3}
//                     position="relative"
//                   >
//                     {/* Image Section */}
//                     <Box
//                       w="100px"
//                       h="130px"
//                       borderRadius="md"
//                       overflow="hidden"
//                     >
//                       <Link to={`/product/${item.product._id}`}>
//                         <Image
//                           objectFit="cover"
//                           src={item.product.images[0]}
//                           w="full"
//                           h="full"
//                         />
//                       </Link>
//                     </Box>

//                     {/* Details Section */}
//                     <Box flex="1" ml={4}>
//                       <Text fontWeight="bold">{item.product.brandname}</Text>
//                       <Text fontSize="sm" color="gray.500">
//                         {item.product.name}
//                       </Text>
//                       <Text fontSize="sm" color="gray.500">
//                         {item.product.description}
//                       </Text>

//                       <Flex gap={3} mt={2}>
//                         {/* Size Selector */}
//                         <Select
//                           value={selectedSize}
//                           onChange={(e) =>
//                             dispatch(
//                               addToCart(
//                                 item.product._id,
//                                 item.qty,
//                                 e.target.value
//                               )
//                             )
//                           }
//                           w="80px"
//                           size="sm"
//                         >
//                           {availableSizes.map((size) => (
//                             <option
//                               key={size}
//                               value={size}
//                               disabled={
//                                 item.product.productdetails.stockBySize?.find(
//                                   (s) => s.size === size
//                                 )?.stock === 0
//                               }
//                             >
//                               {size}{" "}
//                               {item.product.productdetails.stockBySize?.find(
//                                 (s) => s.size === size
//                               )?.stock === 0 && "(Out of Stock)"}
//                             </option>
//                           ))}
//                         </Select>

//                         {/* Quantity Selector */}
//                         <Select
//                           value={item.qty}
//                           onChange={(e) =>
//                             dispatch(
//                               addToCart(
//                                 item.product._id,
//                                 Number(e.target.value),
//                                 selectedSize
//                               )
//                             )
//                           }
//                           w="80px"
//                           size="sm"
//                         >
//                           {[...Array(sizeStock).keys()].map((x) => (
//                             <option key={x + 1} value={x + 1}>
//                               {x + 1}
//                             </option>
//                           ))}
//                         </Select>
//                       </Flex>

//                       <Flex gap={2} mt={2}>
//                         <Text fontWeight="bold">₹{item.product.price}</Text>
//                         <Text as="s" color="gray.400">
//                           ₹ {item.product.oldPrice}
//                         </Text>
//                         <Text color="yellow.500" fontWeight="bold">
//                           {item.product.discount}% Off
//                         </Text>
//                       </Flex>
//                     </Box>

//                     {/* Remove Icon */}
//                     <IconButton
//                       icon={<VscChromeClose />}
//                       colorScheme="red"
//                       variant="ghost"
//                       aria-label="Remove item"
//                       position="absolute"
//                       top="10px"
//                       right="10px"
//                       onClick={() => removeFromCartHandler(item._id)}
//                     />
//                   </Flex>
//                 );
//               })}
//             </GridItem>
//             {/* Right Side - Order Summary */}
//             <GridItem>
//               <Checkout />
//             </GridItem>
//           </Grid>
//         )}
//         <Trust />
//       </Box>
//     </>
//   );
// };

// export default CartPage;

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

const CartPage = () => {
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart?.cartItems || []);

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  const removeFromCartHandler = useCallback(
    (cartItemId) => {
      dispatch(removeFromCart(cartItemId));
    },
    [dispatch]
  );

  return (
    <>
      <Box mt="120px" color="black" bg="white">
        {cartItems.length === 0 ? (
          <Empty />
        ) : (
          <Grid templateColumns={{ base: "1fr", md: "2fr 1fr" }} gap={3}>
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
                              addToCart(
                                item.product._id,
                                item.qty,
                                e.target.value
                              )
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
                          value={item.qty || 1}
                          onChange={(e) =>
                            dispatch(
                              addToCart(
                                item.product._id,
                                Number(e.target.value),
                                item.size
                              )
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
                      <Flex gap={2} mt={2}>
                        <Text fontWeight="bold">₹{item.product.price}</Text>
                        <Text as="s" color="gray.400">
                          ₹{item.product.oldPrice}
                        </Text>
                        <Text color="yellow.500" fontWeight="bold">
                          {item.product.discount}% Off
                        </Text>
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
