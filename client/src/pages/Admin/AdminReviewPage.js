import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

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
  Flex
} from "@chakra-ui/react";

const AdminReviewPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { reviews = [], loading } = useSelector((state) => state.reviewList);

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

  const handleDelete = (reviewId) => {
    if (window.confirm("Are you sure you want to delete this review?")) {
      dispatch(deleteReview(reviewId));
    }
  };

  const handleApprove = (productId, reviewId) => {
    if (!reviewId) {
      console.error("❌ Review ID missing");
      return;
    }
    dispatch(approveReview(productId, reviewId));
  };

  return (
    <Box mt={20} p={10} borderWidth={1} borderRadius="lg" boxShadow="lg">
      <h1 className="titlepanel">Reviews</h1>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <Table variant="striped" bg="pink" color="black" size="md">
          <Thead>
            <Tr>
              <Th>Product</Th>
              <Th>Reviewer</Th>
              <Th>Rating</Th>
              <Th>Comment</Th>
              <Th>Actions</Th>
            </Tr>
          </Thead>

          <Tbody>
            {Array.isArray(reviews) && reviews.length > 0 ? (
              reviews.map((review) => (
                <Tr key={review.reviewId}>
                  <Td>
                    <Box>
                      <Text fontWeight="bold">{review.productName}</Text>
                      {review.productImage && (
                        <img
                          src={review.productImage}
                          alt={review.productName}
                          style={{ width: "60px", borderRadius: "6px" }}
                        />
                      )}
                      <Button
                        size="xs"
                        mt={2}
                        colorScheme="blue"
                        variant="outline"
                        onClick={() => navigate(`/product/${review.productId}`)}
                      >
                        View Product
                      </Button>
                    </Box>
                  </Td>

                  <Td>{review.reviewerName}</Td>
                  <Td>{review.rating}</Td>
                  <Td>{review.comment}</Td>

                  <Td>
                    <Flex gap={3}>
                      <Button
                        colorScheme="green"
                        isLoading={approveLoading}
                        onClick={() =>
                          handleApprove(review.productId, review.reviewId)
                        }
                      >
                        Approve
                      </Button>
                      <Button
                        colorScheme="red"
                        size="sm"
                        variant="outline"
                        isLoading={deleteLoading}
                        onClick={() => handleDelete(review.reviewId)}
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
