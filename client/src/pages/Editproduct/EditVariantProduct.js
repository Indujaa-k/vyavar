import React, { useEffect, useState, useRef } from "react";
import {
  Box,
  Flex,
  Input,
  Text,
  Button,
  Stack,
  Image,
  Heading,
  Card,
  CardBody,
  useToast,
  Spinner,
  FormLabel,
  FormControl,
  SimpleGrid,
  Checkbox,
} from "@chakra-ui/react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  getProductGroup,
  updateProductGroupCommon,
  updateProductVariant,
} from "../../actions/productActions";

const EditVariantProduct = () => {
  const { groupId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const toast = useToast();
  const fileInputRefs = useRef({});

  // ================= REDUX STATES =================
  const productGroup = useSelector((state) => state.productGroup);
  const { loading, error, common, variants } = productGroup;

  const groupUpdate = useSelector((state) => state.productGroupUpdate);
  const { success: groupUpdateSuccess, error: groupUpdateError } = groupUpdate;

  const variantUpdate = useSelector((state) => state.productVariantUpdate);
  const { success: variantUpdateSuccess, error: variantUpdateError } =
    variantUpdate;

  // ================= LOCAL STATES =================
  const [commonState, setCommonState] = useState({
    brandname: "",
    description: "",
    shippingDetails: "",
    isFeatured: false,
    productdetails: {
      gender: "",
      category: "",
      subcategory: "",
      type: "",
      ageRange: "",
      fabric: "",
    },
  });

  const [variantState, setVariantState] = useState([]);
  const openImagePicker = (variantId) => {
    if (fileInputRefs.current[variantId]) {
      fileInputRefs.current[variantId].click();
    }
  };
  const options = {
    gender: ["Men", "Women", "Unisex"],
    category: [
      "Clothing",
      "Topwear",
      "Bottomwear",
      "Shirts",
      "Hoodies",
      "Innerwear",
      "Footwear",
      "Accessories",
    ],
    subcategory: ["Shirts", "Jeans", "Pants", "Shorts", "SweatPants", "Sets"],
    type: ["Casual", "Formal", "Sports"],
    ageRange: ["Kids", "Teen", "Adult"],
    color: ["Red", "Blue", "Black", "White"],
    fabric: ["Cotton", "Polyester", "Leather"],
    sizes: ["S", "M", "L", "XL", "XXL"],
  };
  const calculatePrice = (oldPrice, discount) => {
    if (!oldPrice || discount < 0) return 0;
    if (discount > 100) discount = 100;

    const price = oldPrice - (oldPrice * discount) / 100;
    return Math.round(price);
  };

  const calculateDiscount = (oldPrice, price) => {
    if (!oldPrice || !price || price > oldPrice) return 0;

    const discount = ((oldPrice - price) / oldPrice) * 100;
    return Math.round(discount);
  };

  const toggleSize = (variantId, size) => {
    setVariantState((prev) =>
      prev.map((v) => {
        if (v._id !== variantId) return v;

        const sizes = v.productdetails.sizes || [];
        const stockBySize = v.productdetails.stockBySize || [];

        const existingStock = stockBySize.find((s) => s.size === size);
        const stockValue = existingStock?.stock || 0;

        // ===== UNCHECK =====
        if (sizes.includes(size)) {
          if (stockValue > 0) {
            const confirmRemove = window.confirm(
              `Stock for size ${size} is ${stockValue}. Remove this size and reset stock?`
            );
            if (!confirmRemove) return v;
          }

          return {
            ...v,
            productdetails: {
              ...v.productdetails,
              sizes: sizes.filter((s) => s !== size),
              stockBySize: stockBySize.filter((s) => s.size !== size),
            },
          };
        }

        // ===== CHECK =====
        return {
          ...v,
          productdetails: {
            ...v.productdetails,
            sizes: [...sizes, size],
            stockBySize: [...stockBySize, { size, stock: 0 }],
          },
        };
      })
    );
  };
  const [activeImage, setActiveImage] = useState({
    variantId: null,
    index: null,
  });

  // ================= FETCH GROUP =================
  useEffect(() => {
    dispatch(getProductGroup(groupId));
  }, [dispatch, groupId]);

  // ================= SET DATA FROM REDUX =================
  useEffect(() => {
    if (common) {
      setCommonState({
        brandname: common.brandname || "",
        description: common.description || "",
        shippingDetails: common.shippingDetails || "",
        isFeatured: common.isFeatured || false,
        productdetails: {
          gender: common.productdetails?.gender || "",
          category: common.productdetails?.category || "",
          subcategory: common.productdetails?.subcategory || "",
          type: common.productdetails?.type || "",
          ageRange: common.productdetails?.ageRange || "",
          fabric: common.productdetails?.fabric || "",
        },
      });
      if (variants) {
        const normalized = variants.map((v) => ({
          ...v,
          productdetails: {
            ...v.productdetails,
            sizes: v.productdetails.sizes || [],
            stockBySize: Array.isArray(v.productdetails.stockBySize)
              ? v.productdetails.stockBySize
              : [],
          },
        }));

        setVariantState(normalized);
      }
    }
  }, [common, variants]);
  const disableNumberScroll = (e) => {
    e.target.blur();
  };

  // ================= TOAST HANDLERS =================
  useEffect(() => {
    if (groupUpdateSuccess) {
      toast({
        title: "Group updated successfully",
        status: "success",
      });
    }

    if (groupUpdateError) {
      toast({
        title: groupUpdateError,
        status: "error",
      });
    }

    if (variantUpdateSuccess) {
      toast({
        title: "Variant updated successfully",
        status: "success",
      });
    }

    if (variantUpdateError) {
      toast({
        title: variantUpdateError,
        status: "error",
      });
    }
  }, [
    groupUpdateSuccess,
    groupUpdateError,
    variantUpdateSuccess,
    variantUpdateError,
    toast,
  ]);

  // ================= GROUP UPDATE =================
  const updateGroupHandler = () => {
    dispatch(updateProductGroupCommon(groupId, commonState));
  };

  // ================= VARIANT HELPERS =================
  const updateVariantField = (id, field, value) => {
    setVariantState((prev) =>
      prev.map((v) => (v._id === id ? { ...v, [field]: value } : v))
    );
  };

  const updateVariantDetails = (id, field, value) => {
    setVariantState((prev) =>
      prev.map((v) =>
        v._id === id
          ? {
              ...v,
              productdetails: {
                ...v.productdetails,
                [field]: value,
              },
            }
          : v
      )
    );
  };
  const updateStockBySize = (variantId, size, value) => {
    setVariantState((prev) =>
      prev.map((v) => {
        if (v._id !== variantId) return v;

        const stockBySize = v.productdetails.stockBySize.map((item) =>
          item.size === size ? { ...item, stock: value } : item
        );

        return {
          ...v,
          productdetails: {
            ...v.productdetails,
            stockBySize,
          },
        };
      })
    );
  };

  // ================= SAVE VARIANT =================
  const saveVariantHandler = (variant) => {
    const formData = new FormData();

    formData.append("price", variant.price);
    formData.append("oldPrice", variant.oldPrice);
    formData.append("discount", variant.discount);
    formData.append("color", variant.productdetails.color);

    formData.append("sizes", JSON.stringify(variant.productdetails.sizes));
    formData.append(
      "stockBySize",
      JSON.stringify(variant.productdetails.stockBySize)
    );

    if (variant.replacedImages) {
      Object.entries(variant.replacedImages).forEach(([index, file]) => {
        formData.append("images", file);
        formData.append("imageIndexes", index);
      });
    }

    dispatch(updateProductVariant(variant._id, formData));
  };

  // ================= UI STATES =================
  if (loading) {
    return (
      <Flex justify="center" mt={20}>
        <Spinner size="xl" />
      </Flex>
    );
  }

  if (error) {
    return (
      <Text color="red.500" textAlign="center">
        {error}
      </Text>
    );
  }

  // ================= JSX =================
  return (
    <Box p={6}>
      {/* ================= GROUP COMMON ================= */}
      <Box
        border="1px solid"
        borderColor="gray.200"
        borderRadius="lg"
        p={5}
        mb={8}
        bg="white"
        boxShadow="sm"
      >
        <Heading mb={4} mt={3}>
          Edit Product Group
        </Heading>

        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} mb={6}>
          <FormControl>
            <FormLabel>Brand Name :</FormLabel>
            <Input
              value={commonState.brandname}
              onChange={(e) =>
                setCommonState({ ...commonState, brandname: e.target.value })
              }
            />
          </FormControl>

          <FormControl>
            <FormLabel>Description :</FormLabel>
            <Input
              value={commonState.description}
              onChange={(e) =>
                setCommonState({ ...commonState, description: e.target.value })
              }
            />
          </FormControl>

          <FormControl>
            <FormLabel>Gender :</FormLabel>
            <Input
              value={commonState.productdetails.gender}
              onChange={(e) =>
                setCommonState({
                  ...commonState,
                  productdetails: {
                    ...commonState.productdetails,
                    gender: e.target.value,
                  },
                })
              }
            />
          </FormControl>

          <FormControl>
            <FormLabel>Category :</FormLabel>
            <Input
              value={commonState.productdetails.category}
              onChange={(e) =>
                setCommonState({
                  ...commonState,
                  productdetails: {
                    ...commonState.productdetails,
                    category: e.target.value,
                  },
                })
              }
            />
          </FormControl>

          <FormControl>
            <FormLabel>Subcategory :</FormLabel>
            <Input
              value={commonState.productdetails.subcategory}
              onChange={(e) =>
                setCommonState({
                  ...commonState,
                  productdetails: {
                    ...commonState.productdetails,
                    subcategory: e.target.value,
                  },
                })
              }
            />
          </FormControl>

          <FormControl>
            <FormLabel>Type :</FormLabel>
            <Input
              value={commonState.productdetails.type}
              onChange={(e) =>
                setCommonState({
                  ...commonState,
                  productdetails: {
                    ...commonState.productdetails,
                    type: e.target.value,
                  },
                })
              }
            />
          </FormControl>

          <FormControl>
            <FormLabel>Age Range :</FormLabel>
            <Input
              value={commonState.productdetails.ageRange}
              onChange={(e) =>
                setCommonState({
                  ...commonState,
                  productdetails: {
                    ...commonState.productdetails,
                    ageRange: e.target.value,
                  },
                })
              }
            />
          </FormControl>

          <FormControl>
            <FormLabel>Fabric :</FormLabel>
            <Input
              value={commonState.productdetails.fabric}
              onChange={(e) =>
                setCommonState({
                  ...commonState,
                  productdetails: {
                    ...commonState.productdetails,
                    fabric: e.target.value,
                  },
                })
              }
            />
          </FormControl>
        </SimpleGrid>

        <Button colorScheme="blue" onClick={updateGroupHandler}>
          Save Group Details
        </Button>
      </Box>

      {/* ================= VARIANTS ================= */}
      <Box
        minW="340px"
        border="1px solid"
        borderColor="gray.200"
        borderRadius="lg"
        p={4}
        bg="white"
        boxShadow="sm"
      >
        <Heading size="md" mb={3} mt={6}>
          Variants
        </Heading>

        <Flex gap={4} overflowX="auto" pb={4}>
          {variantState.map((variant) => (
            <Box
              key={variant._id}
              minW="340px"
              border="1px solid"
              borderColor="gray.200"
              borderRadius="lg"
              p={4}
              bg="white"
              boxShadow="sm"
            >
              <Stack spacing={3}>
                {/* Header */}
                <Flex justify="space-between" align="center">
                  <Text fontWeight="bold">
                    Color: {variant.productdetails?.color || "N/A"}
                  </Text>
                  <Text fontSize="xs" color="gray.500">
                    SKU: {variant.SKU || "--"}
                  </Text>
                </Flex>

                {/* Images */}
                <Flex gap={2}>
                  {(variant.images || []).slice(0, 5).map((img, index) => (
                    <Image
                      key={index}
                      src={img}
                      boxSize="70px"
                      objectFit="cover"
                      borderRadius="md"
                      cursor="pointer"
                      onClick={() => {
                        setActiveImage({ variantId: variant._id, index });
                        openImagePicker(variant._id);
                      }}
                    />
                  ))}

                  {variant.images?.length > 5 && (
                    <Flex
                      boxSize="70px"
                      align="center"
                      justify="center"
                      bg="gray.100"
                      borderRadius="md"
                      cursor="pointer"
                      onClick={() => openImagePicker(variant._id)}
                    >
                      +{variant.images.length - 5}
                    </Flex>
                  )}
                </Flex>

                {/* Hidden file input */}
                <Input
                  type="file"
                  hidden
                  ref={(el) => (fileInputRefs.current[variant._id] = el)}
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (!file) return;

                    const previewUrl = URL.createObjectURL(file);

                    setVariantState((prev) =>
                      prev.map((v) => {
                        if (v._id !== activeImage.variantId) return v;

                        const updatedImages = [...v.images];
                        updatedImages[activeImage.index] = previewUrl;

                        return {
                          ...v,
                          images: updatedImages,
                          replacedImages: {
                            ...(v.replacedImages || {}),
                            [activeImage.index]: file, // 👈 track by index
                          },
                        };
                      })
                    );
                  }}
                />

                {/* Inputs */}
                <SimpleGrid columns={2} spacing={2}>
                  <FormControl>
                    <FormLabel fontSize="xs">Color</FormLabel>
                    <Input
                      size="sm"
                      value={variant.productdetails?.color || ""}
                      onChange={(e) =>
                        updateVariantDetails(
                          variant._id,
                          "color",
                          e.target.value
                        )
                      }
                    />
                  </FormControl>

                  <FormControl>
                    <FormLabel fontSize="xs">Old Price</FormLabel>
                    <Input
                      size="sm"
                      type="number"
                      onWheel={disableNumberScroll}
                      min={0}
                      value={variant.oldPrice || ""}
                      onChange={(e) => {
                        const oldPrice = Number(e.target.value);
                        const discount = variant.discount || 0;

                        updateVariantField(variant._id, "oldPrice", oldPrice);
                        updateVariantField(
                          variant._id,
                          "price",
                          calculatePrice(oldPrice, discount)
                        );
                      }}
                    />
                  </FormControl>

                  <FormControl>
                    <FormLabel fontSize="xs">Discount (%)</FormLabel>
                    <Input
                      size="sm"
                      type="number"
                      onWheel={disableNumberScroll}
                      min={0}
                      max={100}
                      value={variant.discount || ""}
                      onChange={(e) => {
                        const discount = Number(e.target.value);
                        const oldPrice = variant.oldPrice || 0;

                        updateVariantField(variant._id, "discount", discount);
                        updateVariantField(
                          variant._id,
                          "price",
                          calculatePrice(oldPrice, discount)
                        );
                      }}
                    />
                  </FormControl>

                  <FormControl>
                    <FormLabel fontSize="xs">Price</FormLabel>
                    <Input
                      size="sm"
                      type="number"
                      onWheel={disableNumberScroll}
                      min={0}
                      value={variant.price || ""}
                      onChange={(e) => {
                        const price = Number(e.target.value);
                        const oldPrice = variant.oldPrice || 0;

                        updateVariantField(variant._id, "price", price);
                        updateVariantField(
                          variant._id,
                          "discount",
                          calculateDiscount(oldPrice, price)
                        );
                      }}
                    />
                  </FormControl>

                  {/* ===== Sizes & Stock ===== */}
                  {/* Sizes */}
                  <Box>
                    <FormLabel fontSize="sm">Sizes</FormLabel>

                    <Stack direction="row" wrap="wrap" mb={3}>
                      {options.sizes.map((size) => (
                        <Checkbox
                          key={size}
                          isChecked={variant.productdetails.sizes.includes(
                            size
                          )}
                          onChange={() => toggleSize(variant._id, size)}
                        >
                          {size}
                        </Checkbox>
                      ))}
                    </Stack>

                    {/* Stock inputs */}
                    <Stack spacing={2}>
                      {variant.productdetails.stockBySize.map((item) => (
                        <FormControl key={item.size}>
                          <FormLabel fontSize="xs">
                            Stock for {item.size}
                          </FormLabel>
                          <Input
                            size="sm"
                            type="number"
                            onWheel={disableNumberScroll}
                            min={0}
                            value={item.stock}
                            onChange={(e) =>
                              updateStockBySize(
                                variant._id,
                                item.size,
                                Number(e.target.value)
                              )
                            }
                          />
                        </FormControl>
                      ))}
                    </Stack>
                  </Box>
                </SimpleGrid>

                <Button
                  size="sm"
                  colorScheme="green"
                  isLoading={variantUpdate.loading}
                  onClick={() => saveVariantHandler(variant)}
                >
                  Save Variant
                </Button>
              </Stack>
            </Box>
          ))}
        </Flex>
      </Box>

      <Button mt={6} variant="outline" onClick={() => navigate(-1)}>
        Back
      </Button>
    </Box>
  );
};

export default EditVariantProduct;
