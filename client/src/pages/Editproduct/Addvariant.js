import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { addVariantToGroup } from "../../actions/productActions";
import { useEffect } from "react";

import {
  Box,
  Input,
  FormControl,
  FormLabel,
  Text,
  Stack,
  Checkbox,
  Heading,
  Flex,
  Button,
} from "@chakra-ui/react";
import { FaTrash } from "react-icons/fa";

const sizesList = ["S", "M", "L", "XL", "XXL"];

const AddVariant = () => {
  const [colorVariants, setColorVariants] = useState([
    {
      color: "",
      sizes: [],
      stockBySize: sizesList.map((s) => ({ size: s, stock: 0 })),
      images: [],
      oldPrice: 0,
      discount: 0,
      price: 0,
    },
  ]);
  const { groupId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const variantAdd = useSelector((state) => state.productVariantAdd);
  const { loading, success, error } = variantAdd;

  useEffect(() => {
    if (success) {
      navigate("/admin/productlist");
    }
  }, [success, navigate]);

  // ➕ Add another color variant
  const addColorVariant = () => {
    setColorVariants((prev) => [
      ...prev,
      {
        color: "",
        sizes: [],
        stockBySize: sizesList.map((s) => ({ size: s, stock: 0 })),
        images: [],
        oldPrice: 0,
        discount: 0,
        price: 0,
      },
    ]);
  };

  // 🗑 Remove color variant (UI only)
  const removeColorVariant = (index) => {
    if (colorVariants.length <= 1) return;
    setColorVariants((prev) => prev.filter((_, i) => i !== index));
  };
  const disableNumberScroll = (e) => {
    e.target.blur();
  };

  const calculateVariantPrice = (oldPrice, discount) => {
    if (!oldPrice || oldPrice <= 0) return 0;
    const finalPrice = oldPrice - (oldPrice * discount) / 100;
    return Math.round(finalPrice);
  };

  // 💾 Save (for now just console)
  const saveVariants = async () => {
    for (const variant of colorVariants) {
      if (!variant.color) {
        alert("Color is required");
        return;
      }

      if (variant.images.length !== 3) {
        alert("Each variant must have exactly 3 images");
        return;
      }

      const formData = new FormData();
      formData.append("color", variant.color);

      // Send sizes as JSON string
      formData.append("sizes", JSON.stringify(variant.sizes));

      // stockBySize filtered by selected sizes
      formData.append(
        "stockBySize",
        JSON.stringify(
          variant.stockBySize.filter((s) => variant.sizes.includes(s.size))
        )
      );
      formData.append("oldPrice", variant.oldPrice);
      formData.append("discount", variant.discount);
      formData.append("price", variant.price);
      // images
      variant.images.forEach((img) => formData.append("images", img));

      await dispatch(addVariantToGroup(groupId, formData));
    }
  };

  return (
    <Box maxW="container.md" mx="auto" mt={10} p={4}>
      <Heading size="lg" mb={6}>
        Add Variants
      </Heading>

      {colorVariants.map((variant, index) => (
        <Box
          key={index}
          border="1px solid #CBD5E0"
          p={4}
          borderRadius="md"
          mt={4}
        >
          {/* Header */}
          <Flex justify="space-between" align="center" mb={3}>
            <Heading size="sm">Color {index + 1}</Heading>

            <Box
              cursor={colorVariants.length <= 1 ? "not-allowed" : "pointer"}
              onClick={() => removeColorVariant(index)}
            >
              <FaTrash
                size={18}
                color={colorVariants.length <= 1 ? "gray" : "red"}
              />
            </Box>
          </Flex>

          {/* Color Name */}
          <FormControl mb={3}>
            <FormLabel>Color</FormLabel>
            <Input
              value={variant.color}
              placeholder="Enter color name"
              onChange={(e) => {
                const updated = [...colorVariants];
                updated[index].color = e.target.value;
                setColorVariants(updated);
              }}
            />
          </FormControl>

          {/* Sizes */}
          <FormLabel>Sizes</FormLabel>
          <Stack direction="row" mb={3}>
            {sizesList.map((size) => (
              <Checkbox
                key={size}
                isChecked={variant.sizes.includes(size)}
                onChange={() => {
                  const updated = [...colorVariants];
                  updated[index].sizes = variant.sizes.includes(size)
                    ? variant.sizes.filter((s) => s !== size)
                    : [...variant.sizes, size];
                  setColorVariants(updated);
                }}
              >
                {size}
              </Checkbox>
            ))}
          </Stack>

          {/* Stock by size */}
          {variant.sizes.map((size) => (
            <Flex key={size} gap={2} mb={2} align="center">
              <Text w="40px">{size}</Text>
              <Input
                type="number"
                min={0}
                placeholder={`Stock for ${size}`}
                onChange={(e) => {
                  const updated = [...colorVariants];
                  updated[index].stockBySize = updated[index].stockBySize.map(
                    (stk) =>
                      stk.size === size
                        ? { ...stk, stock: Number(e.target.value) }
                        : stk
                  );
                  setColorVariants(updated);
                }}
              />
            </Flex>
          ))}
          <Flex justify="space-between" gap={4} mb={3}>
            <FormControl isRequired>
              <FormLabel>Old Price</FormLabel>
              <Input
                type="number"
                onWheel={disableNumberScroll}
                value={variant.oldPrice}
                placeholder="Enter old price"
                onChange={(e) => {
                  const num = parseFloat(e.target.value) || 0;
                  setColorVariants((prev) =>
                    prev.map((v, idx) =>
                      idx === index
                        ? {
                            ...v,
                            oldPrice: num,
                            price: calculateVariantPrice(num, v.discount),
                          }
                        : v
                    )
                  );
                }}
              />
            </FormControl>

            <FormControl>
              <FormLabel>Discount (%)</FormLabel>
              <Input
                type="number"
                onWheel={disableNumberScroll}
                value={variant.discount}
                placeholder="Discount %"
                onChange={(e) => {
                  const num = parseFloat(e.target.value) || 0;
                  setColorVariants((prev) =>
                    prev.map((v, idx) =>
                      idx === index
                        ? {
                            ...v,
                            discount: num,
                            price: calculateVariantPrice(v.oldPrice, num),
                          }
                        : v
                    )
                  );
                }}
              />
            </FormControl>

            <FormControl>
              <FormLabel>New Price</FormLabel>
              <Input type="number" value={variant.price} readOnly />
            </FormControl>
          </Flex>
          {/* Images */}
          <FormControl mt={4}>
            <FormLabel>
              Images for {variant.color || `Color ${index + 1}`}
            </FormLabel>

            <Flex gap={4}>
              {[0, 1, 2].map((imgIndex) => (
                <Box
                  key={imgIndex}
                  w="100px"
                  h="100px"
                  border="2px dashed #CBD5E0"
                  borderRadius="md"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  cursor="pointer"
                  position="relative"
                  onClick={() =>
                    document
                      .getElementById(`images-${index}-${imgIndex}`)
                      .click()
                  }
                >
                  {variant.images?.[imgIndex] ? (
                    <img
                      src={URL.createObjectURL(variant.images[imgIndex])}
                      alt="preview"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        borderRadius: "6px",
                      }}
                    />
                  ) : (
                    <Text fontSize="xs" color="gray.500" textAlign="center">
                      Upload
                      <br />
                      Image {imgIndex + 1}
                    </Text>
                  )}

                  <Input
                    type="file"
                    accept="image/*"
                    hidden
                    id={`images-${index}-${imgIndex}`}
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (!file) return;

                      const updated = [...colorVariants];
                      const imgs = updated[index].images || [];
                      imgs[imgIndex] = file;
                      updated[index].images = imgs;
                      setColorVariants(updated);
                    }}
                  />
                </Box>
              ))}
            </Flex>

            <Text fontSize="xs" color="gray.500" mt={2}>
              Upload exactly 3 images for this color
            </Text>
          </FormControl>
        </Box>
      ))}

      {/* Action Buttons */}
      <Flex mt={6} gap={4}>
        <Button colorScheme="blue" onClick={addColorVariant}>
          + Add Another Variant
        </Button>

        <Button colorScheme="green" onClick={saveVariants} isLoading={loading}>
          Save Variants
        </Button>
      </Flex>

      {error && (
        <Text color="red.500" mt={3}>
          {error}
        </Text>
      )}
    </Box>
  );
};

export default AddVariant;
