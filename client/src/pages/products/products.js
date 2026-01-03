import React, { useEffect, useState, useRef } from "react";
import { useLocation } from "react-router-dom";

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
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { AiFillDelete, AiOutlineEdit } from "react-icons/ai";
import { CgAdd } from "react-icons/cg";
import { Helmet } from "react-helmet";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { ViewIcon, DeleteIcon, EditIcon, AddIcon } from "@chakra-ui/icons";
import ProductViewModal from "./ProductViewModal";

import { Tooltip } from "@chakra-ui/react";
const Products = () => {
  const { id } = useParams();
  const { groupId } = useParams();

  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const dispatch = useDispatch();
  const productList = useSelector((state) => state.productList);
  const { loading, error, products } = productList;
  const {
    isOpen: isDeleteOpen,
    onOpen: onDeleteOpen,
    onClose: onDeleteClose,
  } = useDisclosure();

  const {
    isOpen: isViewOpen,
    onOpen: onViewOpen,
    onClose: onViewClose,
  } = useDisclosure();

  const [selectedProduct, setSelectedProduct] = useState(null);

  const cancelRef = useRef();

  const [deleteId, setDeleteId] = useState(null);
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
  const location = useLocation();
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  useEffect(() => {
    dispatch({ type: PRODUCT_CREATE_RESET });

    if (!userInfo?.isAdmin) {
      navigate("/login");
      return;
    }

    if (bulkSuccess) {
      alert("Products uploaded successfully!");
      dispatch({ type: PRODUCT_BULK_UPLOAD_RESET });
    }

    // 🔥 ALWAYS refetch products when page is hit
    dispatch(listProducts());
  }, [
    dispatch,
    navigate,
    userInfo,
    successDelete,
    bulkSuccess,
    location.key, // 👈 THIS IS THE MAGIC
  ]);

  const deletehandler = (id) => {
    setDeleteId(id);
    onDeleteOpen();
  };

  const confirmDelete = () => {
    dispatch(DeleteProduct(deleteId));
    onDeleteClose();
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
    <>
      <Box bg="white" p={4}>
        <Helmet>
          <title>Products</title>
        </Helmet>

        <h1 className="titlepanel">Products</h1>
        <Flex
          justify="space-between"
          align="center"
          mb={6}
          wrap="wrap"
          gap={3}
          mt={6}
        >
          <Text fontSize="lg" fontWeight="bold">
            Product Management
          </Text>

          <Flex gap={3}>
            {/* Create Product */}
            <Button
              colorScheme="purple"
              leftIcon={<CgAdd />}
              onClick={createproducthandler}
            >
              Create Product
            </Button>

            {/* Bulk Upload */}
            <Button colorScheme="blue" as="label" cursor="pointer">
              Bulk Upload
              <Input
                type="file"
                accept=".xlsx,.xls"
                hidden
                onChange={(e) => setFile(e.target.files[0])}
              />
            </Button>
          </Flex>
        </Flex>

        {bulkMessage && <Text color="green.500">{bulkMessage}</Text>}

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
            <Flex justify="flex-end" mb={3} gap={8}>
              <Tooltip
                label="Edit"
                placement="top"
                background="rgb(7, 59, 116)"
              >
                <EditIcon
                  boxSize={6}
                  cursor="pointer"
                  color="blue.600"
                  _hover={{ color: "blue.800" }}
                  onClick={() =>
                    navigate(`/admin/product/${group.groupId}/edit`)
                  }
                />
              </Tooltip>
              <Tooltip
                label="Add Variant"
                placement="top"
                background="rgb(7, 59, 116)"
              >
                <AddIcon
                  boxSize={6}
                  cursor="pointer"
                  color="green.600"
                  _hover={{ color: "green.800" }}
                  onClick={() =>
                    navigate(`/admin/product/${group.groupId}/add-variant`)
                  }
                />
              </Tooltip>
            </Flex>

            <Table variant="simple" size="sm">
              <Thead>
                <Tr>
                  <Th>Product ID</Th>
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
                    <Td>{product._id}</Td>
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
                      <Link to={`/product/${product._id}`}>
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
                      </Link>
                    </Td>
                    <Td>
                      <Stack spacing={2}>
                        <Tooltip
                          label="View"
                          placement="top"
                          background="rgb(7, 59, 116)"
                        >
                          <ViewIcon
                            boxSize={5}
                            cursor="pointer"
                            color="rgb(7, 59, 116)"
                            onClick={() => {
                              setSelectedProduct(product);
                              onViewOpen();
                            }}
                          />
                        </Tooltip>
                        <Tooltip
                          label="delete"
                          placement="top"
                          background="rgba(248, 0, 0, 1)"
                        >
                          <DeleteIcon
                            boxSize={5}
                            cursor="pointer"
                            color="red.500"
                            onClick={() => deletehandler(product._id)}
                          />
                        </Tooltip>
                      </Stack>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </Box>
        ))}
      </Box>

      <AlertDialog
        isOpen={isDeleteOpen}
        leastDestructiveRef={cancelRef}
        onClose={onDeleteClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete Product
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure? This product will be permanently deleted.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onDeleteClose}>
                Cancel
              </Button>
              <Button colorScheme="red" onClick={confirmDelete} ml={3}>
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>

      {/* view modal */}
      <ProductViewModal
        isOpen={isViewOpen}
        onClose={onViewClose}
        product={selectedProduct}
      />
    </>
  );
};

export default Products;
