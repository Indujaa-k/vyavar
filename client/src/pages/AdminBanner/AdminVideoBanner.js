import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  listVideoBanners,
  uploadVideoBanner,
  deleteVideoBanner,
} from "../../actions/bannerActions";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Spinner,
  Text,
  useToast,
  Flex,
  IconButton,
  useDisclosure,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
} from "@chakra-ui/react";
import { MdDelete } from "react-icons/md";

const AdminVideoBanner = () => {
  const dispatch = useDispatch();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef();
  const [deleteVideoId, setDeleteVideoId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [selectedVideoFile, setSelectedVideoFile] = useState(null);

  // Redux states
  const {
    loading,
    error,
    videos = [],
  } = useSelector((state) => state.getvideoBanners);

  const {
    loading: uploading,
    error: uploadError,
    success: uploadSuccess,
  } = useSelector((state) => state.addvideoBanners);
  const [productId, setProductId] = useState("");

  const { success: deleteSuccess } = useSelector(
    (state) => state.deletevideoBanners,
  );

  // ✅ Only one video allowed
  const isVideoExists = videos.length > 0;

  // Fetch all videos
  useEffect(() => {
    dispatch(listVideoBanners());
  }, [dispatch, uploadSuccess, deleteSuccess]);

  // Toasts
  useEffect(() => {
    if (uploadSuccess && isSubmitting) {
      toast({
        title: "Success",
        description: "Video uploaded successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      setSelectedVideoFile(null);
      setProductId("");
      setIsSubmitting(false); // reset
    }

    if (uploadError && isSubmitting) {
      toast({
        title: "Upload Failed",
        description: uploadError,
        status: "error",
        duration: 4000,
        isClosable: true,
      });

      setIsSubmitting(false); // reset
    }
  }, [uploadSuccess, uploadError, isSubmitting, toast]);

  // Handlers
  const uploadHandler = (e) => {
    setSelectedVideoFile(e.target.files[0]);
  };

  const submitHandler = (e) => {
    e.preventDefault();

    if (!productId.trim()) {
      toast({
        title: "Error",
        description: "Please enter a Product ID",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (!selectedVideoFile) {
      toast({
        title: "Error",
        description: "Please select a video file",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const formData = new FormData();
    formData.append("video", selectedVideoFile);
    formData.append("productId", productId); // ✅ important
    setIsSubmitting(true);
    dispatch(uploadVideoBanner(formData));
  };

  const openDeleteConfirm = (videoId) => {
    setDeleteVideoId(videoId);
    onOpen();
  };

  const confirmDelete = () => {
    dispatch(deleteVideoBanner(deleteVideoId));
    setDeleteVideoId(null);
    onClose();
  };
const API_URL = process.env.REACT_APP_API_URL;
  // Render
  return (
    <Box mt={10} p={6} maxW="800px" mx="auto">
      <h1 className="titlepanel">Video Banner</h1>
      <FormControl mb={3} isRequired>
        <FormLabel>Product ID</FormLabel>
        <Input
          type="text"
          placeholder="Enter Product ID"
          value={productId}
          onChange={(e) => setProductId(e.target.value)}
        />
      </FormControl>

      {/* Upload */}
      <Box bg="gray.100" p={4} borderRadius="md" mb={6}>
        <form onSubmit={submitHandler}>
          <FormControl>
            <FormLabel>
              Upload Video
              {selectedVideoFile && (
                <Text fontSize="sm" color="green.600">
                  : {selectedVideoFile.name}
                </Text>
              )}
            </FormLabel>
            <Input
              type="file"
              accept="video/mp4,video/avi,video/mov"
              onChange={uploadHandler}
              key={selectedVideoFile || "video-input"}
            />
          </FormControl>

          <Button
            mt={4}
            colorScheme="blue"
            type="submit"
            isLoading={uploading}
            loadingText="Uploading..."
            disabled={isVideoExists || isSubmitting}
          >
            Upload Video
          </Button>

          {isVideoExists && (
            <Text mt={2} fontSize="sm" color="red.500">
              Only one video is allowed. Delete existing video to upload a new
              one.
            </Text>
          )}
        </form>
      </Box>

      {/* Error */}
      {error && <Text color="red.500">{error}</Text>}

      {/* Video List */}
      {loading ? (
        <Flex justify="center" mt={6}>
          <Spinner size="xl" />
        </Flex>
      ) : videos.length > 0 ? (
        <VStack spacing={6} align="stretch">
          {videos.map((video) => (
            <Box
              key={video._id}
              p={4}
              border="1px solid gray"
              borderRadius="md"
            >
              <video width="100%" controls>
                <source src={`${API_URL}${video.videoUrl}`} type="video/mp4" />
              </video>
              <Flex justify="space-between" mt={2}>
                <Text fontSize="sm" color="gray.600">
                  Uploaded on {new Date(video.createdAt).toLocaleDateString()}
                </Text>
                <IconButton
                  aria-label="Delete Video"
                  icon={<MdDelete />}
                  colorScheme="red"
                  size="sm"
                  onClick={() => openDeleteConfirm(video._id)}
                />
              </Flex>
            </Box>
          ))}
        </VStack>
      ) : (
        <Text color="gray.500" mt={4}>
          No videos found
        </Text>
      )}
      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
        isCentered
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete Video Banner
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure? This action cannot be undone.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                Cancel
              </Button>
              <Button colorScheme="red" onClick={confirmDelete} ml={3}>
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Box>
  );
};

export default AdminVideoBanner;
