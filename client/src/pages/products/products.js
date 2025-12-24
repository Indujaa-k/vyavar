import React, { useEffect, useState } from "react";
import {
  DeleteProduct,
  listProducts,
  uploadBulkProducts,
} from "../../actions/productActions";
import { useDispatch, useSelector } from "react-redux";
import HashLoader from "react-spinners/HashLoader";
import {
  PRODUCT_CREATE_RESET,
  PRODUCT_BULK_UPLOAD_RESET,
} from "../../constants/productConstants";
import "./products.css";
import {
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Stack,
  Box,
  Input,
  Text,
  Flex,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { AiFillDelete, AiOutlineEdit } from "react-icons/ai";
import { CgAdd } from "react-icons/cg";
import { Helmet } from "react-helmet";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";

const Products = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const dispatch = useDispatch();
  const productList = useSelector((state) => state.productList);
  const { loading, error, products } = productList;

  const productDelete = useSelector((state) => state.productDelete);
  const {
    loading: loadingDelete,
    error: errorDelete,
    success: successDelete,
  } = productDelete;

  const productCreate = useSelector((state) => state.productCreate);
  const {
    loading: loadingCreate,
    error: errorCreate,
    success: successCreate,
    product: createdproduct,
  } = productCreate;

  const productBulkUpload = useSelector((state) => state.productBulkUpload);
  const {
    loading: bulkLoading,
    error: bulkError,
    success: bulkSuccess,
    message: bulkMessage,
  } = productBulkUpload;
  // Group products by productGroupId
  const groupedProducts = products.reduce((acc, product) => {
    const groupId = product.productGroupId || product._id;
    if (!acc[groupId]) acc[groupId] = [];
    acc[groupId].push(product);
    return acc;
  }, {});
  const groupedProductsArray = Object.entries(groupedProducts).map(
    ([groupId, products]) => ({
      groupId,
      products,
    })
  );

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  useEffect(() => {
    dispatch({ type: PRODUCT_CREATE_RESET });

    if (bulkSuccess) {
      alert("Products uploaded successfully!");
      dispatch({ type: PRODUCT_BULK_UPLOAD_RESET });
    }

    if (!userInfo.isAdmin) {
      navigate("/login");
    }

    if (successCreate) {
      navigate(`/admin/product/create`);
    } else {
      dispatch(listProducts());
    }
  }, [
    dispatch,
    userInfo,
    successDelete,
    successCreate,
    createdproduct,
    bulkSuccess,
  ]);

  const deletehandler = (id) => {
    if (window.confirm("Are You Sure?")) {
      dispatch(DeleteProduct(id));
    }
  };

  const createproducthandler = () => {
    navigate("/admin/product/create");
  };

  const bulkUploadHandler = (e) => {
    e.preventDefault();
    if (file) {
      dispatch(uploadBulkProducts(file));
    }
  };

  return (
    <Box bg="white" p={4}>
      <Helmet>
        <title>Products</title>
      </Helmet>

      <h1 className="titlepanel">Products</h1>

      {groupedProductsArray.map((group) => (
        <Box
          key={group.groupId}
          border="1px solid"
          borderColor="gray.200"
          borderRadius="md"
          p={2}
          mb={6}
        >
          {/* Add Variant button – right aligned */}
          <Flex justify="flex-end" mb={3}>
            <Button
              size="sm"
              colorScheme="teal"
              leftIcon={<CgAdd />}
              onClick={() =>
                navigate(`/admin/product/${group.groupId}/add-variant`)
              }
            >
              Add Variant
            </Button>
          </Flex>

          <Table variant="simple" size="sm">
            <Thead>
              <Tr>
                <Th>Group ID</Th>
                <Th>Name</Th>
                <Th>Price</Th>
                <Th>Category</Th>
                <Th>Stock</Th>
                <Th>Image</Th>
                <Th>Actions</Th>
              </Tr>
            </Thead>

            <Tbody>
              {group.products.map((product, index) => (
                <Tr key={product._id}>
                  <Td>{index === 0 ? group.groupId : ""}</Td>
                  <Td>{product.brandname}</Td>
                  <Td isNumeric>{product.price}</Td>
                  <Td>
                    {product.productdetails?.gender} |{" "}
                    {product.productdetails?.category} |{" "}
                    {product.productdetails?.subcategory}
                  </Td>
                  <Td>
                    {product.productdetails?.stockBySize?.length > 0 ? (
                      <Stack spacing={1}>
                        {product.productdetails.stockBySize.map((s) => (
                          <Text
                            key={s.size}
                            color={
                              s.stock > 10
                                ? "green"
                                : s.stock > 0
                                ? "orange"
                                : "red"
                            }
                          >
                            {s.size}: {s.stock}
                          </Text>
                        ))}
                      </Stack>
                    ) : (
                      <Text color="gray.500">No stock</Text>
                    )}
                  </Td>
                  <Td>
                    {product.images?.length > 0 ? (
                      <img
                        src={product.images[0]}
                        alt={product.brandname}
                        style={{
                          width: "70px",
                          height: "70px",
                          objectFit: "cover",
                        }}
                      />
                    ) : (
                      "No Image"
                    )}
                    <Link to={`/product/${product._id}`}>
                      <Button
                        size="xs"
                        fontSize="xs"
                        variant="ghost"
                        colorScheme="blue"
                      >
                        View Product
                      </Button>
                    </Link>
                  </Td>
                  <Td>
                    <Stack spacing={2}>
                      <Link to={`/admin/product/${product._id}/edit`}>
                        <Button size="xs" colorScheme="blue">
                          Edit
                        </Button>
                      </Link>
                      <Button
                        size="xs"
                        colorScheme="red"
                        onClick={() => deletehandler(product._id)}
                      >
                        Delete
                      </Button>
                    </Stack>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
      ))}
    </Box>
  );
};

export default Products;
