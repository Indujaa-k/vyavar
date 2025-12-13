import React, { useEffect, useState } from "react";
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
} from "@chakra-ui/react";
import { MdDelete } from "react-icons/md";

const AdminVideoBanner = () => {
  const dispatch = useDispatch();
  const toast = useToast();

  // Renamed state variables for clarity
  const [inputProductId, setInputProductId] = useState("");
  const [selectedVideoFile, setSelectedVideoFile] = useState(null);

  // Redux States
  const {
    loading,
    error,
    videos = [],
  } = useSelector((state) => state.getvideoBanners) || {};
  const {
    loading: uploading,
    error: uploadError,
    success: uploadSuccess,
  } = useSelector((state) => state.addvideoBanners);
  const { success: deleteSuccess } = useSelector(
    (state) => state.deletevideoBanners
  );

  // Helper for current ID
  const trimmedProductId = inputProductId.trim();

  // 1. Toast & Cleanup Effect
  useEffect(() => {
    if (uploadSuccess) {
      toast({
        title: "Success",
        description: "Video banner uploaded successfully!",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      // Clear state on success
      setSelectedVideoFile(null);
      setInputProductId("");
    }

    if (uploadError) {
      toast({
        title: "Upload Failed",
        description: uploadError,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  }, [uploadSuccess, uploadError, toast]);

  // 2. Re-fetch Effect
  useEffect(() => {
    if (uploadSuccess || deleteSuccess) {
      // Use the trimmed ID to refresh the list if we have an ID
      if (trimmedProductId) {
        dispatch(listVideoBanners(trimmedProductId));
      }
    }
  }, [dispatch, uploadSuccess, deleteSuccess, trimmedProductId]);

  // --- Handlers ---

  const uploadHandler = (e) => {
    setSelectedVideoFile(e.target.files[0]);
  };

  const submitHandler = (e) => {
    e.preventDefault();

    if (!selectedVideoFile || !trimmedProductId) {
      toast({
        title: "Error",
        description: "Please enter a Product ID and select a video file.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const formData = new FormData();
    formData.append("video", selectedVideoFile);
    formData.append("productId", trimmedProductId);

    dispatch(uploadVideoBanner(formData));
  };

  const deleteHandler = (videoId) => {
    if (window.confirm("Are you sure you want to delete this video?")) {
      dispatch(deleteVideoBanner(trimmedProductId, videoId));
    }
  };

  const handleFetchVideos = () => {
    if (trimmedProductId) {
      dispatch(listVideoBanners(trimmedProductId));
    } else {
      toast({
        title: "Error",
        description: "Please enter a Product ID to fetch videos.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  // 🎯 CORE LOGIC: Button is disabled if either state is missing
  const isUploadDisabled = !trimmedProductId || !selectedVideoFile;

  // --- Render ---

  return (
    <Box mt={10} p={6} maxW="800px" mx="auto">
      <h1 className="titlepanel">Video Banners</h1>

      {/* Product ID Input (CONTROLLED) */}
      <FormControl mb={4}>
        <FormLabel>Enter Product ID</FormLabel>
        <Input
          type="text"
          placeholder="Enter Product ID"
          value={inputProductId} // ⬅️ Controlled State
          onChange={(e) => setInputProductId(e.target.value)} // ⬅️ Updates State (guaranteed re-render)
        />
        <Button mt={2} colorScheme="blue" onClick={handleFetchVideos}>
          Fetch Videos
        </Button>
      </FormControl>

      {/* Upload Form */}
      <Box bg="gray.100" p={4} borderRadius="md" mb={6}>
        <form onSubmit={submitHandler}>
          <FormControl>
            <FormLabel>
              Upload Video (MP4, AVI, MOV)
              {selectedVideoFile && (
                <Text fontSize="sm" color="green.600">
                  : **{selectedVideoFile.name}** selected
                </Text>
              )}
            </FormLabel>
            <Input
              type="file"
              accept="video/mp4,video/avi,video/mov"
              onChange={uploadHandler}
              // Key ensures visual reset on file input when state is cleared
              key={selectedVideoFile || "fileInputKey"}
            />
          </FormControl>
          <Button
            mt={4}
            colorScheme="blue"
            type="submit"
            isLoading={uploading}
            loadingText="Uploading..."
            disabled={isUploadDisabled} // ⬅️ Uses the combined state check
          >
            Upload Video
          </Button>
        </form>
      </Box>

      {/* Errors */}
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
                <source src={video.videoUrl} type="video/mp4" />
              </video>
              <Flex justify="space-between" mt={2}>
                <Text fontSize="sm" color="gray.600">
                  Uploaded on: {new Date(video.createdAt).toLocaleDateString()}
                </Text>
                <IconButton
                  aria-label="Delete Video"
                  icon={<MdDelete />}
                  colorScheme="red"
                  size="sm"
                  onClick={() => deleteHandler(video._id)}
                />
              </Flex>
            </Box>
          ))}
        </VStack>
      ) : (
        <Text color="gray.500" mt={4}>
          No videos found for this Product ID. **Click "Fetch Videos" to load
          them.**
        </Text>
      )}
    </Box>
  );
};

export default AdminVideoBanner;
