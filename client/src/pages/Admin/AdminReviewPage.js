import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  listAllReviews,
  unapproveReview,
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
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Avatar,
  Image,
} from "@chakra-ui/react";

const AdminReviewPage = () => {
  const dispatch = useDispatch();
  const toast = useToast();

  const { reviews = [], loading } = useSelector((state) => state.reviewList);

  const [localReviews, setLocalReviews] = useState([]);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);
  const API_URL = process.env.REACT_APP_API_URL;

  // Sync Redux reviews to local state
  useEffect(() => {
    setLocalReviews(reviews);

    // ✅ LOG to check what Redux is sending
    console.log("🔹 All reviews from Redux:", reviews);

    const pending = reviews.filter((r) => !r.approved);
    const approved = reviews.filter((r) => r.approved);

    console.log("🔹 Pending Reviews:", pending);
    console.log("🔹 Approved Reviews:", approved);
  }, [reviews]);

  useEffect(() => {
    dispatch(listAllReviews());
  }, [dispatch]);

  const openDeleteModal = (review) => {
    setSelectedReview(review);
    setIsDeleteOpen(true);
  };

  const confirmDelete = () => {
    if (!selectedReview) return;

    dispatch(deleteReview(selectedReview._id));

    // Optimistic update
    setLocalReviews((prev) => prev.filter((r) => r._id !== selectedReview._id));

    toast({
      title: "Review deleted",
      description: "The review has been removed successfully.",
      status: "success",
      duration: 3000,
      position: "top-right",
      isClosable: true,
    });

    setIsDeleteOpen(false);
    setSelectedReview(null);
  };

  const handleApprove = (productId, _id) => {
    if (!_id) return;

    dispatch(approveReview(productId, _id));

    // Optimistic UI update
    setLocalReviews((prev) =>
      prev.map((r) => (r._id === _id ? { ...r, approved: true } : r)),
    );

    toast({
      title: "Review approved",
      status: "success",
      duration: 3000,
      position: "top-right",
      isClosable: true,
    });
  };

  const handleUnapprove = (productId, _id) => {
    if (!_id) return;

    dispatch(unapproveReview(productId, _id));

    // Optimistic UI update
    setLocalReviews((prev) =>
      prev.map((r) => (r._id === _id ? { ...r, approved: false } : r)),
    );

    toast({
      title: "Review unapproved",
      status: "info",
      duration: 3000,
      position: "top-right",
      isClosable: true,
    });
  };

  const pendingReviews = localReviews.filter((r) => !r.approved);
  const approvedReviews = localReviews.filter((r) => r.approved);

  return (
    <Box p={10} borderWidth={1} borderRadius="lg" boxShadow="lg">
      <h1 className="titlepanel">Reviews</h1>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          {/* Pending Reviews */}
          <Text fontSize="2xl" mb={3}>
            Pending Reviews
          </Text>

          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>User</Th>

                <Th>Product</Th>
                <Th>Comment</Th>
                <Th>Rating</Th>
                <Th>Action</Th>
              </Tr>
            </Thead>
            <Tbody>
              {pendingReviews.length > 0 ? (
                pendingReviews.map((review) => (
                  <Tr key={review._id}>
                    <Td>{review.user?.name || "Unknown"}</Td>

                    <Td>
                      <Image
                        src={
                          review.product?.image
                            ? `${API_URL}/${review.product.image.replace(/\\/g, "/")}`
                            : "/placeholder.png"
                        }
                        alt={review.product?.name || "Product"}
                        boxSize="50px"
                        objectFit="cover"
                        borderRadius="md"
                      />
                    </Td>
                    <Td>{review.comment}</Td>
                    <Td>{review.rating} ⭐</Td>
                    <Td>
                      <Flex gap={2}>
                        <Button
                          colorScheme="green"
                          size="sm"
                          onClick={() =>
                            handleApprove(review.productId, review._id)
                          }
                        >
                          Approve
                        </Button>
                        <Button
                          colorScheme="red"
                          size="sm"
                          variant="outline"
                          onClick={() => openDeleteModal(review)}
                        >
                          Delete
                        </Button>
                      </Flex>
                    </Td>
                  </Tr>
                ))
              ) : (
                <Tr>
                  <Td colSpan={4} textAlign="center">
                    No pending reviews
                  </Td>
                </Tr>
              )}
            </Tbody>
          </Table>

          {/* Delete Modal */}
          <Modal
            isOpen={isDeleteOpen}
            onClose={() => setIsDeleteOpen(false)}
            isCentered
          >
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Delete Review</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                Are you sure you want to delete this review?
              </ModalBody>

              <Flex justify="flex-end" gap={3} p={4}>
                <Button
                  variant="outline"
                  onClick={() => setIsDeleteOpen(false)}
                >
                  Cancel
                </Button>

                <Button colorScheme="red" onClick={confirmDelete}>
                  Delete
                </Button>
              </Flex>
            </ModalContent>
          </Modal>

          {/* Approved Reviews */}
          <Text fontSize="2xl" mt={10} mb={3}>
            Approved Reviews
          </Text>

          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>User</Th>

                <Th>Product</Th>
                <Th>Comment</Th>
                <Th>Rating</Th>
                <Th>Action</Th>
              </Tr>
            </Thead>
            <Tbody>
              {approvedReviews.length > 0 ? (
                approvedReviews.map((review) => (
                  <Tr key={review._id}>
                    <Td>{review.user?.name || "Unknown"}</Td>
                    <Td>
                      <Image
                        src={review.product?.image || "/placeholder.png"}
                        alt={review.product?.name || "Product"}
                        boxSize="50px"
                        objectFit="cover"
                        borderRadius="md"
                      />
                    </Td>
                    <Td>{review.comment}</Td>
                    <Td>{review.rating} ⭐</Td>
                    <Td>
                      <Button
                        colorScheme="orange"
                        size="sm"
                        onClick={() =>
                          handleUnapprove(review.productId, review._id)
                        }
                      >
                        Unapprove
                      </Button>
                    </Td>
                  </Tr>
                ))
              ) : (
                <Tr>
                  <Td colSpan={4} textAlign="center">
                    No approved reviews
                  </Td>
                </Tr>
              )}
            </Tbody>
          </Table>
        </>
      )}
    </Box>
  );
};

export default AdminReviewPage;
