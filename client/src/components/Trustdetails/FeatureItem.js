import React from "react";
import { Box, Flex, Text, Image, SimpleGrid } from "@chakra-ui/react";
import img1 from "../../assets/featuredimg1.svg";
import img2 from "../../assets/featuredimg2.svg";
import img3 from "../../assets/featuredimg3.svg";
import img4 from "../../assets/featuredimg4.svg";

const FeaturesSection = () => {
  const features = [
    { img: img1, text: "Secure Payments" },
    { img: img2, text: "Genuine Product" },
    { img: img3, text: "Try & Buy" },
    { img: img4, text: "7 Day Return" },
  ];

  return (
    <SimpleGrid columns={{ base: 2, md: 4 }} spacing={4}>
      {features.map((feature, index) => (
        <Flex
          key={index}
          direction="column"
          align="center"
          textAlign="center"
        >
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            h="40px"
            mb={1}
          >
            <Image
              src={feature.img}
              alt={feature.text}
              w="100%"
              h="100%"
              objectFit="contain"
            />
          </Box>
          <Text fontSize="10px" fontWeight="600" whiteSpace="nowrap">
            {feature.text}
          </Text>
        </Flex>
      ))}
    </SimpleGrid>
  );
};

export default FeaturesSection;
