import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { listUserVideoBanners } from "../../actions/bannerActions";
import { Box, Text, Spinner, Flex } from "@chakra-ui/react";

const UserVideoBanner = () => {
  const dispatch = useDispatch();

  const userVideoBannerList = useSelector((state) => state.userVideoBanners);
  const { loading, error, videos } = userVideoBannerList;

  useEffect(() => {
    dispatch(listUserVideoBanners()); // Fetch all videos
  }, [dispatch]);

  return (
    <Box p={0} w="87vw" mx="auto" mt="40">
      {" "}
      {/* Full width container */}
      {loading ? (
        <Flex justify="center" mt={6}>
          <Spinner size="xl" />
        </Flex>
      ) : error ? (
        <Text color="red.500" mt={4} textAlign="center">
          {error}
        </Text>
      ) : videos.length === 0 ? (
        <Text textAlign="center">No videos available.</Text>
      ) : (
        videos.map((video) => (
          <Box key={video._id} w="87vw" overflow="hidden">
            {" "}
            {/* Ensure full width */}
            <video
              width="100%"
              height="auto"
              autoPlay
              loop
              muted
              playsInline
              style={{
                display: "block",
                objectFit: "cover",
                maxWidth: "100%",
                height: "80vh",
              }}
            >
              <source src={video.videoUrl} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </Box>
        ))
      )}
    </Box>
  );
};

export default UserVideoBanner;
