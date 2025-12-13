import React, { useState, useEffect } from "react";
import { Box, IconButton } from "@chakra-ui/react";
import { ChevronUpIcon, ChevronDownIcon } from "@chakra-ui/icons";

const ScrollButton = () => {
  const [isAtTop, setIsAtTop] = useState(true);

  // Check scroll position
  useEffect(() => {
    const handleScroll = () => {
      setIsAtTop(window.scrollY < 200); // If scrolled down 200px, change button
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Scroll function
  const handleScroll = () => {
    if (isAtTop) {
      window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <Box position="fixed" bottom="20px" right="20px" zIndex="1000">
      <IconButton
        onClick={handleScroll}
        icon={isAtTop ? <ChevronDownIcon /> : <ChevronUpIcon />}
        aria-label="Scroll Button"
        size="lg"
        borderRadius="full"
        bg="white"
        boxShadow="md"
        _hover={{ bg: "gray.100" }}
      />
    </Box>
  );
};

export default ScrollButton;
