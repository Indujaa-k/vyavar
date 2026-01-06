import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  listPendingReviews,
  approveReview,
  deleteReview,
} from "../../actions/productActions";
import {
  Box,
  Button,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  Text,
  Flex,
} from "@chakra-ui/react";

const AdminReviewPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { reviews = [], loading } = useSelector((state) => state.reviewList);
  const [productImages, setProductImages] = useState({});

  const { success: approveSuccess, loading: approveLoading } = useSelector(
    (state) => state.reviewApprove
  );

  // Load reviews & auto-refresh after approve
  useEffect(() => {
    dispatch(listPendingReviews());
  }, [dispatch, approveSuccess]);
  const { success: deleteSuccess, loading: deleteLoading } = useSelector(
    (state) => state.reviewDelete
  );
  useEffect(() => {
    dispatch(listPendingReviews());
  }, [dispatch, approveSuccess, deleteSuccess]);

  const handleDelete = (_id) => {
    if (window.confirm("Are you sure you want to delete this review?")) {
      dispatch(deleteReview(_id));
    }
  };

  const handleApprove = (productId, _id) => {
    if (!_id) {
      console.error("❌ Review ID missing");
      return;
    }
    dispatch(approveReview(productId, _id));
  };

  return (
    <Box mt={20} p={10} borderWidth={1} borderRadius="lg" boxShadow="lg">
      <h1 className="titlepanel">Reviews</h1>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <Table
          variant="simple"
          size="md"
          bg="white"
          color="black"
          borderRadius="lg"
        >
          <Thead bg="gray.100">
            <Tr>
              <Th textAlign="center">Product</Th>
              <Th textAlign="center">Reviewer</Th>
              <Th textAlign="center">Rating</Th>
              <Th>Comment</Th>
              <Th textAlign="center">Actions</Th>
            </Tr>
          </Thead>

          <Tbody>
            {Array.isArray(reviews) && reviews.length > 0 ? (
              reviews.map((review) => (
                <Tr key={review._id}>
                  {/* PRODUCT */}
                  <Td textAlign="center">
                    <Box
                      display="flex"
                      flexDirection="column"
                      alignItems="center"
                      gap={2}
                    >
                      {review.image ? (
                        <Box
                          width="90px"
                          height="70px"
                          display="flex"
                          alignItems="center"
                          justifyContent="center"
                        >
                          <img
                            src={review.image}
                            alt={review.brandname}
                            style={{
                              maxWidth: "100%",
                              maxHeight: "100%",
                              objectFit: "contain",
                              borderRadius: "6px",
                            }}
                          />
                        </Box>
                      ) : (
                        <Text fontSize="sm" color="gray.500">
                          No Image
                        </Text>
                      )}

                      <Text fontWeight="bold" fontSize="sm" textAlign="center">
                        {review.brandname}
                      </Text>
                    </Box>
                  </Td>

                  {/* REVIEWER */}
                  <Td textAlign="center">{review.name}</Td>

                  {/* RATING */}
                  <Td textAlign="center">
                    <Text fontWeight="semibold">{review.rating} ⭐</Text>
                  </Td>

                  {/* COMMENT + PHOTOS */}
                  <Td maxW="300px">
                    <Text noOfLines={2} mb={2}>
                      {review.comment}
                    </Text>

                    {review.photos && review.photos.length > 0 && (
                      <Flex mt={2} gap={2} wrap="wrap">
                        {review.photos.map((photo, index) => (
                          <img
                            key={index}
                            src={photo}
                            alt="review"
                            style={{
                              width: "60px",
                              height: "60px",
                              objectFit: "cover",
                              borderRadius: "6px",
                            }}
                          />
                        ))}
                      </Flex>
                    )}
                  </Td>

                  {/* ACTIONS */}
                  <Td textAlign="center">
                    <Flex justify="center" gap={3}>
                      <Button
                        colorScheme="green"
                        size="sm"
                        isLoading={approveLoading}
                        onClick={() => {
                          console.log("APPROVE:", review.productId, review._id);
                          handleApprove(review.productId, review._id);
                        }}
                      >
                        Approve
                      </Button>

                      <Button
                        colorScheme="red"
                        size="sm"
                        variant="outline"
                        isLoading={deleteLoading}
                        onClick={() => {
                          console.log("DELETE:", review._id);
                          handleDelete(review._id);
                        }}
                      >
                        Delete
                      </Button>
                    </Flex>
                  </Td>
                </Tr>
              ))
            ) : (
              <Tr>
                <Td colSpan={5} textAlign="center">
                  No pending reviews
                </Td>
              </Tr>
            )}
          </Tbody>
        </Table>
      )}
    </Box>
  );
};

export default AdminReviewPage;
