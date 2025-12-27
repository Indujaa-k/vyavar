import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { listProductDetails, UpdateProduct } from "../../actions/productActions";
import {
  Box,
  Button,
  Input,
  FormControl,
  FormLabel,
  Checkbox,
  Stack,
  Heading,
  Text,
} from "@chakra-ui/react";

const EditVariantProduct = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { product, loading } = useSelector(
    (state) => state.productDetails
  );

  const [brandname, setBrandname] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(0);
  const [oldPrice, setOldPrice] = useState(0);
  const [discount, setDiscount] = useState(0);

  const [productdetails, setProductdetails] = useState({
    gender: "",
    category: "",
    subcategory: "",
    type: "",
    ageRange: "",
    color: "",
    fabric: "",
    sizes: [],
    stockBySize: [],
  });

  const [images, setImages] = useState([]);

  /* 🔄 FETCH PRODUCT */
  useEffect(() => {
    dispatch(listProductDetails(id));
  }, [dispatch, id]);

  /* ✍️ PREFILL FORM */
  useEffect(() => {
    if (product) {
      setBrandname(product.brandname);
      setDescription(product.description);
      setPrice(product.price);
      setOldPrice(product.oldPrice);
      setDiscount(product.discount);
      setProductdetails(product.productdetails);
      setImages(product.images);
    }
  }, [product]);

  const submitHandler = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("brandname", brandname);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("oldPrice", oldPrice);
    formData.append("discount", discount);
    formData.append(
      "productdetails",
      JSON.stringify(productdetails)
    );

    dispatch(UpdateProduct(id, formData));
    navigate("/admin/products");
  };

  if (loading) return <Text>Loading...</Text>;

  return (
    <Box maxW="container.md" mx="auto" mt={10}>
      <Heading mb={6}>Edit Variant</Heading>

      <form onSubmit={submitHandler}>
        <FormControl mb={3}>
          <FormLabel>Brand Name</FormLabel>
          <Input value={brandname} onChange={(e) => setBrandname(e.target.value)} />
        </FormControl>

        <FormControl mb={3}>
          <FormLabel>Description</FormLabel>
          <Input value={description} onChange={(e) => setDescription(e.target.value)} />
        </FormControl>

        <FormControl mb={3}>
          <FormLabel>Price</FormLabel>
          <Input type="number" value={price} onChange={(e) => setPrice(e.target.value)} />
        </FormControl>

        <FormControl mb={3}>
          <FormLabel>Color</FormLabel>
          <Input
            value={productdetails.color}
            onChange={(e) =>
              setProductdetails({ ...productdetails, color: e.target.value })
            }
          />
        </FormControl>

        <FormLabel>Sizes</FormLabel>
        <Stack direction="row" mb={4}>
          {["S", "M", "L", "XL", "XXL"].map((size) => (
            <Checkbox
              key={size}
              isChecked={productdetails.sizes.includes(size)}
              onChange={() => {
                const sizes = productdetails.sizes.includes(size)
                  ? productdetails.sizes.filter((s) => s !== size)
                  : [...productdetails.sizes, size];

                setProductdetails({ ...productdetails, sizes });
              }}
            >
              {size}
            </Checkbox>
          ))}
        </Stack>

        <Button type="submit" colorScheme="teal">
          Update Variant
        </Button>
      </form>
    </Box>
  );
};

export default EditVariantProduct;
