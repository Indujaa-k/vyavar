import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  listPendingReviews,
  approveReview,
} from "../../actions/productActions";
import { Box } from "@chakra-ui/react";
import { Button, Table, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/react";

const AdminReviewPage = () => {
  const dispatch = useDispatch();
  const { reviews, loading } = useSelector((state) => state.reviewList);

  useEffect(() => {
    dispatch(listPendingReviews()); // Fetch only unapproved reviews
  }, [dispatch]);

  const handleApprove = async (productId, reviewId) => {
    console.log("Approving Review: ", { productId, reviewId });

    if (!reviewId) {
      console.error("❌ ERROR: Review ID is undefined!");
      return;
    }

    await dispatch(approveReview(productId, reviewId)); // ✅ Wait for approval API
    dispatch(listPendingReviews()); // ✅ Refresh pending reviews
  };
  return (
    <Box mt={20} p={10} borderWidth={1} borderRadius="lg" boxShadow="lg">
      <h1 className="titlepanel"> Reviews </h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <Table variant="striped" bg="pink" color="black" size="md">
          <Thead>
            <Tr>
              <Th>ReviewId</Th>
              <Th>Reviewer</Th>
              <Th>Rating</Th>
              <Th>Comment</Th>
              <Th>Approve</Th>
            </Tr>
          </Thead>
          <Tbody>
            {reviews.map((review) => {
              console.log("🔍 Debugging Review Object:", review);
              return (
                // ✅ FIXED: Added return here!
                <Tr key={review._id}>
                  <Td>{review._id}</Td>
                  <Td>{review.name}</Td>
                  <Td>{review.rating}</Td>
                  <Td>{review.comment}</Td>
                  <Td>
                    <Button
                      colorScheme="green"
                      onClick={() =>
                        handleApprove(review.productId, review._id)
                      }
                    >
                      Approve
                    </Button>
                  </Td>
                </Tr>
              );
            })}
          </Tbody>
        </Table>
      )}
    </Box>
  );
};

export default AdminReviewPage;
