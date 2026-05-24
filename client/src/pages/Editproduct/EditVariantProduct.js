import React, { useEffect, useState, useRef, useCallback } from "react";
import {
  Box,
  Flex,
  Input,
  Text,
  Button,
  Stack,
  Image,
  Heading,
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
import { AddIcon } from "@chakra-ui/icons";
import WashCareInput from "../../components/WashCareInput";
const API = (process.env.REACT_APP_API_URL || "").replace(/\/$/, "");
const MAX_IMAGES = 5;

// ✅ Display-only helper — result is NEVER written back to state or DB
// blob: URLs are VALID here — they are live previews of newly picked files
const getImageSrc = (img) => {
  if (!img || img.startsWith("data:")) {
    return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(
      `<svg xmlns="http://www.w3.org/2000/svg" width="70" height="70"><rect width="70" height="70" fill="#f0f0f0"/><text x="35" y="40" text-anchor="middle" font-size="9" fill="#999" font-family="sans-serif">No Image</text></svg>`,
    )}`;
  }
  if (img.startsWith("blob:") || img.startsWith("http")) return img;
  return `${API}/${img.replace(/\\/g, "/")}`;
};

const CATEGORY_DATA = [
  {
    name: "Topwear",
    subcategories: ["T-Shirts", "Regular", "Oversized", "Full Sleeve"],
  },
  { name: "Hoodies", subcategories: ["Hooded Sweatshirts", "Zip Hoodies"] },
];

const OPTIONS = {
  gender: ["Men", "Women", "Unisex"],
  type: ["Casual", "Formal", "Sports"],
  ageRange: ["Kids", "Teen", "Adult"],
  fabric: ["Cotton", "Polyester", "Leather"],
  sizes: ["S", "M", "L", "XL", "XXL"],
};

const EditVariantProduct = () => {
  const { groupId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const toast = useToast();

  const fileInputRefs = useRef({});
  // ✅ Ref not state — avoids stale closure inside file input onChange
  const activeImageRef = useRef({ variantId: null, index: null, isNew: false });

  const productGroup = useSelector((state) => state.productGroup);
  const { loading, error, common, variants } = productGroup;
  const groupUpdate = useSelector((state) => state.productGroupUpdate);
  const { success: groupUpdateSuccess, error: groupUpdateError } = groupUpdate;
  const variantUpdate = useSelector((state) => state.productVariantUpdate);
  const { success: variantUpdateSuccess, error: variantUpdateError } =
    variantUpdate;
  const [savingVariantId, setSavingVariantId] = useState(null);

  const [commonState, setCommonState] = useState({
    brandname: "",
    description: "",
    hsnCode: "6109",
    sizeChart: "",
    sizeChartFile: null,
    washCare: [],
    shippingDetails: {
      weight: "",
      dimensions: { length: "", width: "", height: "" },
      originAddress: {
        street1: "",
        city: "",
        state: "",
        zip: "",
        country: "India",
      },
    },
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

  const disableNumberScroll = (e) => e.target.blur();

  const calculatePrice = (oldPrice, discount) => {
    if (!oldPrice || discount < 0) return 0;
    return Math.round(oldPrice - (oldPrice * Math.min(discount, 100)) / 100);
  };
  const calculateDiscount = (oldPrice, price) => {
    if (!oldPrice || !price || price > oldPrice) return 0;
    return Math.round(((oldPrice - price) / oldPrice) * 100);
  };

  // ✅ Replace an existing image slot
  const openImagePicker = (variantId, index) => {
    activeImageRef.current = { variantId, index, isNew: false };
    const input = fileInputRefs.current[variantId];
    if (input) {
      input.value = "";
      input.click();
    }
  };

  // ✅ Add a new image slot (appended to end)
  const openAddImagePicker = (variantId) => {
    activeImageRef.current = { variantId, index: null, isNew: true };
    const input = fileInputRefs.current[variantId];
    if (input) {
      input.value = "";
      input.click();
    }
  };

  const handleImageChange = useCallback((e) => {
    const file = e.target.files[0];
    if (!file) return;
    const { variantId, index, isNew } = activeImageRef.current;
    if (variantId === null) return;

    const previewUrl = URL.createObjectURL(file);

    setVariantState((prev) =>
      prev.map((v) => {
        if (v._id !== variantId) return v;
        if (isNew) {
          // Append to end
          const newIndex = v.images.length;
          return {
            ...v,
            images: [...v.images, previewUrl],
            replacedImages: { ...(v.replacedImages || {}), [newIndex]: file },
          };
        } else {
          // Replace existing slot
          const updatedImages = [...v.images];
          updatedImages[index] = previewUrl;
          return {
            ...v,
            images: updatedImages,
            replacedImages: { ...(v.replacedImages || {}), [index]: file },
          };
        }
      }),
    );
  }, []);

  const toggleSize = (variantId, size) => {
    setVariantState((prev) =>
      prev.map((v) => {
        if (v._id !== variantId) return v;
        const sizes = v.productdetails.sizes || [];
        const stockBySize = v.productdetails.stockBySize || [];
        const stockValue = stockBySize.find((s) => s.size === size)?.stock || 0;
        if (sizes.includes(size)) {
          if (
            stockValue > 0 &&
            !window.confirm(`Stock for size ${size} is ${stockValue}. Remove?`)
          )
            return v;
          return {
            ...v,
            productdetails: {
              ...v.productdetails,
              sizes: sizes.filter((s) => s !== size),
              stockBySize: stockBySize.filter((s) => s.size !== size),
            },
          };
        }
        return {
          ...v,
          productdetails: {
            ...v.productdetails,
            sizes: [...sizes, size],
            stockBySize: [...stockBySize, { size, stock: 0 }],
          },
        };
      }),
    );
  };

  useEffect(() => {
    dispatch(getProductGroup(groupId));
  }, [dispatch, groupId]);

  useEffect(() => {
    if (common) {
      setCommonState({
        brandname: common.brandname || "",
        description: common.description || "",
        hsnCode: common.hsnCode || "6109",
        sizeChart: common.sizeChart || "",
        washCare: common.washCare || [],
        sizeChartFile: null,
        shippingDetails: common.shippingDetails || {
          weight: "",
          dimensions: { length: "", width: "", height: "" },
          originAddress: {
            street1: "",
            city: "",
            state: "",
            zip: "",
            country: "India",
          },
        },
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
    }
    if (variants) {
      setVariantState(
        variants.map((v) => ({
          ...v,
          // Strip data: URIs only — blob: and server paths are valid for display
          images: (v.images || []).map((img) =>
            img && !img.startsWith("data:") ? img : null,
          ),
          productdetails: {
            ...v.productdetails,
            sizes: v.productdetails?.sizes || [],
            stockBySize: Array.isArray(v.productdetails?.stockBySize)
              ? v.productdetails.stockBySize
              : [],
          },
          replacedImages: {},
        })),
      );
    }
  }, [common, variants]);

  useEffect(() => {
    if (groupUpdateSuccess)
      toast({ title: "Group updated", status: "success" });
    if (groupUpdateError) toast({ title: groupUpdateError, status: "error" });
    if (variantUpdateSuccess) {
      toast({ title: "Variant updated", status: "success" });
      setSavingVariantId(null);
      dispatch(getProductGroup(groupId));
    }
    if (variantUpdateError) {
      toast({ title: variantUpdateError, status: "error" });
      setSavingVariantId(null);
    }
  }, [
    groupUpdateSuccess,
    groupUpdateError,
    variantUpdateSuccess,
    variantUpdateError,
  ]);

  const updateGroupHandler = () => {
    const fd = new FormData();
    fd.append("brandname", commonState.brandname);
    fd.append("description", commonState.description);
    fd.append("hsnCode", commonState.hsnCode);
    fd.append("isFeatured", commonState.isFeatured);
    fd.append("shippingDetails", JSON.stringify(commonState.shippingDetails));
    fd.append("gender", commonState.productdetails.gender);
    fd.append("category", commonState.productdetails.category);
    fd.append("subcategory", commonState.productdetails.subcategory);
    fd.append("type", commonState.productdetails.type);
    fd.append("ageRange", commonState.productdetails.ageRange);
    fd.append("fabric", commonState.productdetails.fabric);
    fd.append("washCare", JSON.stringify(commonState.washCare));
    if (commonState.sizeChartFile)
      fd.append("sizeChart", commonState.sizeChartFile);
    dispatch(updateProductGroupCommon(groupId, fd));
  };

  const updateVariantField = (id, field, value) =>
    setVariantState((prev) =>
      prev.map((v) => (v._id === id ? { ...v, [field]: value } : v)),
    );

  const updateVariantDetails = (id, field, value) =>
    setVariantState((prev) =>
      prev.map((v) =>
        v._id === id
          ? { ...v, productdetails: { ...v.productdetails, [field]: value } }
          : v,
      ),
    );

  const updateStockBySize = (variantId, size, value) =>
    setVariantState((prev) =>
      prev.map((v) =>
        v._id !== variantId
          ? v
          : {
              ...v,
              productdetails: {
                ...v.productdetails,
                stockBySize: v.productdetails.stockBySize.map((item) =>
                  item.size === size ? { ...item, stock: Number(value) } : item,
                ),
              },
            },
      ),
    );

  const saveVariantHandler = (variant) => {
    setSavingVariantId(variant._id);
    const fd = new FormData();
    fd.append("price", variant.price);
    fd.append("oldPrice", variant.oldPrice);
    fd.append("discount", variant.discount);
    fd.append("color", variant.productdetails.color);
    fd.append("sizes", JSON.stringify(variant.productdetails.sizes));
    fd.append(
      "stockBySize",
      JSON.stringify(variant.productdetails.stockBySize),
    );
    if (
      variant.replacedImages &&
      Object.keys(variant.replacedImages).length > 0
    ) {
      Object.entries(variant.replacedImages).forEach(([index, file]) => {
        fd.append("images", file);
        fd.append("imageIndexes", index);
      });
    }
    dispatch(updateProductVariant(variant._id, fd));
  };

  if (loading)
    return (
      <Flex justify="center" mt={20}>
        <Spinner size="xl" />
      </Flex>
    );
  if (error)
    return (
      <Text color="red.500" textAlign="center">
        {error}
      </Text>
    );

  return (
    <Box p={6}>
      {/* GROUP COMMON */}
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
            <FormLabel>Brand Name</FormLabel>
            <Input
              value={commonState.brandname}
              onChange={(e) =>
                setCommonState({ ...commonState, brandname: e.target.value })
              }
            />
          </FormControl>
          <FormControl>
            <FormLabel>Description</FormLabel>
            <Input
              value={commonState.description}
              onChange={(e) =>
                setCommonState({ ...commonState, description: e.target.value })
              }
            />
          </FormControl>
          <FormControl>
            <FormLabel>HSN Code</FormLabel>
            <Input
              value={commonState.hsnCode}
              onChange={(e) =>
                setCommonState({ ...commonState, hsnCode: e.target.value })
              }
              placeholder="e.g. 6109"
            />
          </FormControl>
          <FormControl gridColumn="1 / -1">
            <WashCareInput
              value={commonState.washCare}
              onChange={(val) =>
                setCommonState({ ...commonState, washCare: val })
              }
            />
          </FormControl>

          {[
            { label: "Gender", key: "gender", opts: OPTIONS.gender },
            { label: "Type", key: "type", opts: OPTIONS.type },
            { label: "Age Range", key: "ageRange", opts: OPTIONS.ageRange },
            { label: "Fabric", key: "fabric", opts: OPTIONS.fabric },
          ].map(({ label, key, opts }) => (
            <FormControl key={key}>
              <FormLabel>{label}</FormLabel>
              <Input
                as="select"
                value={commonState.productdetails[key]}
                onChange={(e) =>
                  setCommonState({
                    ...commonState,
                    productdetails: {
                      ...commonState.productdetails,
                      [key]: e.target.value,
                    },
                  })
                }
              >
                <option value="">Select {label}</option>
                {opts.map((o) => (
                  <option key={o} value={o}>
                    {o}
                  </option>
                ))}
              </Input>
            </FormControl>
          ))}

          <FormControl>
            <FormLabel>Category</FormLabel>
            <Input
              as="select"
              value={commonState.productdetails.category}
              onChange={(e) =>
                setCommonState({
                  ...commonState,
                  productdetails: {
                    ...commonState.productdetails,
                    category: e.target.value,
                    subcategory: "",
                  },
                })
              }
            >
              <option value="">Select Category</option>
              {CATEGORY_DATA.map((c) => (
                <option key={c.name} value={c.name}>
                  {c.name}
                </option>
              ))}
            </Input>
          </FormControl>

          <FormControl>
            <FormLabel>Subcategory</FormLabel>
            <Input
              as="select"
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
            >
              <option value="">Select Subcategory</option>
              {CATEGORY_DATA.find(
                (c) => c.name === commonState.productdetails.category,
              )?.subcategories.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </Input>
          </FormControl>

          <FormControl gridColumn="1 / -1">
            <FormLabel>Size Chart</FormLabel>
            {commonState.sizeChart && (
              <Box mb={2}>
                <Text fontSize="sm" color="gray.500">
                  Current:
                </Text>
                <Text fontWeight="bold">
                  {commonState.sizeChartFile
                    ? commonState.sizeChartFile.name
                    : commonState.sizeChart.split("/").pop()}
                </Text>
              </Box>
            )}
            <Input
              type="file"
              accept="application/pdf,image/*"
              onChange={(e) => {
                const file = e.target.files[0];
                if (!file) return;
                setCommonState((prev) => ({
                  ...prev,
                  sizeChartFile: file,
                  sizeChart: URL.createObjectURL(file),
                }));
              }}
            />
          </FormControl>
        </SimpleGrid>

        <Heading size="md" mt={6} mb={3}>
          🚚 Shipping Details
        </Heading>
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
          <FormControl>
            <FormLabel>Weight (kg)</FormLabel>
            <Input
              type="number"
              onWheel={disableNumberScroll}
              value={commonState.shippingDetails.weight}
              onChange={(e) =>
                setCommonState({
                  ...commonState,
                  shippingDetails: {
                    ...commonState.shippingDetails,
                    weight: e.target.value,
                  },
                })
              }
            />
          </FormControl>
          <SimpleGrid columns={3} spacing={3}>
            {["length", "width", "height"].map((dim) => (
              <FormControl key={dim}>
                <FormLabel>
                  {dim.charAt(0).toUpperCase() + dim.slice(1)} (cm)
                </FormLabel>
                <Input
                  type="number"
                  onWheel={disableNumberScroll}
                  value={commonState.shippingDetails.dimensions[dim]}
                  onChange={(e) =>
                    setCommonState({
                      ...commonState,
                      shippingDetails: {
                        ...commonState.shippingDetails,
                        dimensions: {
                          ...commonState.shippingDetails.dimensions,
                          [dim]: e.target.value,
                        },
                      },
                    })
                  }
                />
              </FormControl>
            ))}
          </SimpleGrid>
        </SimpleGrid>

        <Heading size="md" mt={6} mb={3}>
          📍 Origin Address
        </Heading>
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
          {[
            { label: "Street", key: "street1" },
            { label: "City", key: "city" },
            { label: "State", key: "state" },
            { label: "ZIP", key: "zip" },
          ].map(({ label, key }) => (
            <FormControl key={key}>
              <FormLabel>{label}</FormLabel>
              <Input
                value={commonState.shippingDetails.originAddress[key]}
                onChange={(e) =>
                  setCommonState({
                    ...commonState,
                    shippingDetails: {
                      ...commonState.shippingDetails,
                      originAddress: {
                        ...commonState.shippingDetails.originAddress,
                        [key]: e.target.value,
                      },
                    },
                  })
                }
              />
            </FormControl>
          ))}
        </SimpleGrid>

        <Flex justify="space-between" align="center" mt={6}>
          <Button colorScheme="blue" onClick={updateGroupHandler}>
            Save Group Details
          </Button>
          <Button
            size="sm"
            leftIcon={<AddIcon />}
            colorScheme="green"
            onClick={() => navigate(`/admin/product/${groupId}/add-variant`)}
          >
            Add Variant
          </Button>
        </Flex>
      </Box>

      {/* VARIANTS */}
      <Box
        border="1px solid"
        borderColor="gray.200"
        borderRadius="lg"
        p={4}
        bg="white"
        boxShadow="sm"
      >
        <Heading size="md" mb={4}>
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
                <Flex justify="space-between" align="center">
                  <Text fontWeight="bold">
                    Color: {variant.productdetails?.color || "N/A"}
                  </Text>
                  <Text fontSize="xs" color="gray.500">
                    SKU: {variant.SKU || "--"}
                  </Text>
                </Flex>

                {/* Images */}
                <Box>
                  <FormLabel fontSize="sm">
                    Images ({variant.images?.filter(Boolean).length || 0}/
                    {MAX_IMAGES}) — click to replace
                  </FormLabel>
                  <Flex gap={2} flexWrap="wrap" align="center">
                    {(variant.images || []).map((img, index) => (
                      <Box key={index} position="relative">
                        <Image
                          src={getImageSrc(img)}
                          boxSize="70px"
                          objectFit="cover"
                          borderRadius="md"
                          cursor="pointer"
                          border="2px solid"
                          borderColor={
                            variant.replacedImages?.[index]
                              ? "orange.400"
                              : "gray.200"
                          }
                          _hover={{ borderColor: "blue.400" }}
                          onClick={() => openImagePicker(variant._id, index)}
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = getImageSrc(null);
                          }}
                        />
                        <Text
                          position="absolute"
                          bottom="0"
                          right="0"
                          bg="blackAlpha.600"
                          color="white"
                          fontSize="9px"
                          px={1}
                          borderTopLeftRadius="md"
                        >
                          {index + 1}
                        </Text>
                      </Box>
                    ))}

                    {/* ✅ + button — only shown when image count < MAX_IMAGES */}
                    {(variant.images?.length || 0) < MAX_IMAGES && (
                      <Box
                        boxSize="70px"
                        borderRadius="md"
                        border="2px dashed"
                        borderColor="gray.300"
                        display="flex"
                        flexDirection="column"
                        alignItems="center"
                        justifyContent="center"
                        cursor="pointer"
                        bg="gray.50"
                        _hover={{ borderColor: "blue.400", bg: "blue.50" }}
                        onClick={() => openAddImagePicker(variant._id)}
                      >
                        <AddIcon color="gray.400" boxSize={4} />
                        <Text fontSize="9px" color="gray.400" mt={1}>
                          Add
                        </Text>
                      </Box>
                    )}
                  </Flex>

                  {/* Single hidden file input per variant — shared for both replace and add */}
                  <input
                    type="file"
                    accept="image/*"
                    style={{ display: "none" }}
                    ref={(el) => {
                      if (el) fileInputRefs.current[variant._id] = el;
                    }}
                    onChange={handleImageChange}
                  />

                  {variant.replacedImages &&
                    Object.keys(variant.replacedImages).length > 0 && (
                      <Text fontSize="xs" color="orange.500" mt={1}>
                        {Object.keys(variant.replacedImages).length} image(s)
                        pending save
                      </Text>
                    )}
                </Box>

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
                          e.target.value,
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
                        const op = Number(e.target.value);
                        updateVariantField(variant._id, "oldPrice", op);
                        updateVariantField(
                          variant._id,
                          "price",
                          calculatePrice(op, variant.discount || 0),
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
                        const d = Number(e.target.value);
                        updateVariantField(variant._id, "discount", d);
                        updateVariantField(
                          variant._id,
                          "price",
                          calculatePrice(variant.oldPrice || 0, d),
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
                        const p = Number(e.target.value);
                        updateVariantField(variant._id, "price", p);
                        updateVariantField(
                          variant._id,
                          "discount",
                          calculateDiscount(variant.oldPrice || 0, p),
                        );
                      }}
                    />
                  </FormControl>
                </SimpleGrid>

                <Box>
                  <FormLabel fontSize="sm">Sizes</FormLabel>
                  <Stack direction="row" wrap="wrap" mb={3}>
                    {OPTIONS.sizes.map((size) => (
                      <Checkbox
                        key={size}
                        isChecked={variant.productdetails.sizes.includes(size)}
                        onChange={() => toggleSize(variant._id, size)}
                      >
                        {size}
                      </Checkbox>
                    ))}
                  </Stack>
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
                              e.target.value,
                            )
                          }
                        />
                      </FormControl>
                    ))}
                  </Stack>
                </Box>

                <Button
                  size="sm"
                  colorScheme="green"
                  isLoading={savingVariantId === variant._id}
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
