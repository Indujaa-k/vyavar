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
    <Box className="Users" bg="white" p={4}>
      <Helmet>
        <title>Products</title>
      </Helmet>
      <h1 className="titlepanel">Products</h1>

      {loading || loadingDelete || loadingCreate || bulkLoading ? (
        <div className="loading">
          <HashLoader color={"#1e1e2c"} size={40} />
        </div>
      ) : error || errorDelete || errorCreate || bulkError ? (
        <Text color="red.500">
          {error?.message ||
            errorDelete?.message ||
            errorCreate?.message ||
            bulkError?.message ||
            "An unknown error occurred"}
        </Text>
      ) : (
        <>
          <Flex
            className="button-container"
            align="center"
            justify="space-between"
          >
            <Button
              leftIcon={<CgAdd size="20" />}
              className="ADDBUTTON"
              colorScheme="teal"
              onClick={createproducthandler}
            >
              ADD
            </Button>
            <form className="upload-form" onSubmit={bulkUploadHandler}>
              <Input
                type="file"
                accept=".xlsx,.xls"
                onChange={(e) => setFile(e.target.files[0])}
                size="sm"
              />
              <Button type="submit" colorScheme="teal" size="lg">
                Bulk Upload
              </Button>
            </form>
          </Flex>

          {bulkMessage && <Text color="green.500">{bulkMessage}</Text>}

          <Box overflowX="auto">
            <Table className="productusers" variant="striped">
              <Thead>
                <Tr>
                  <Th>ID</Th>
                  <Th>Name</Th>
                  <Th>Price</Th>
                  <Th>Category</Th>
                  <Th>Stock Status</Th>
                  <Th>ProductDetails</Th>
                  <Th>Actions</Th>
                </Tr>
              </Thead>
              <Tbody>
                {products.map((product) => {
                  const totalStock =
                    product.productdetails?.stockBySize?.reduce(
                      (sum, s) => sum + s.stock,
                      0
                    ) || 0;

                  return (
                    <Tr key={product._id}>
                      <Td>{product._id}</Td>
                      <Td>{product.brandname}</Td>
                      <Td isNumeric>{product.price}</Td>
                      <Td>
                        {product.productdetails?.gender} |{" "}
                        {product.productdetails?.category} |{" "}
                        {product.productdetails?.subcategory} |
                        {Array.isArray(product.productdetails?.sizes)
                          ? product.productdetails.sizes.join(" | ")
                          : product.productdetails?.sizes || "N/A"}
                      </Td>
                      <Td>
                        {product.productdetails?.stockBySize &&
                        product.productdetails.stockBySize.length > 0 ? (
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
                          <Text color="gray.500">No stock data</Text>
                        )}
                      </Td>

                      {/* Display Product Images */}
                      <Td>
                        <Stack spacing={2} align="center">
                          {product.images && product.images.length > 0 ? (
                            <img
                              src={product.images[0]} // Access the first image
                              alt={product.brandname}
                              style={{
                                width: "80px",
                                height: "80px",
                                objectFit: "cover",
                                borderRadius: "5px",
                              }}
                            />
                          ) : (
                            <Text>No Image</Text>
                          )}
                          {/* Product Link */}
                          <Link to={`/product/${product._id}`}>
                            <Button colorScheme="blue" size="xs">
                              View Product
                            </Button>
                          </Link>
                        </Stack>
                      </Td>

                      <Td>
                        <Stack>
                          <Link to={`/admin/product/${product._id}/edit`}>
                            <Button
                              leftIcon={<AiOutlineEdit size="16" />}
                              colorScheme="blue"
                              size="xs"
                            >
                              EDIT
                            </Button>
                          </Link>
                          <Button
                            colorScheme="red"
                            leftIcon={<AiFillDelete size="16" />}
                            size="xs"
                            onClick={() => deletehandler(product._id)}
                          >
                            DELETE
                          </Button>
                        </Stack>
                      </Td>
                    </Tr>
                  );
                })}
              </Tbody>
            </Table>
          </Box>
        </>
      )}
    </Box>
  );
};

export default Products;
