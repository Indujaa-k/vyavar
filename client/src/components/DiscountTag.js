import React, { useState } from "react";
import { Box, Button, Image, Text, Link, Icon } from "@chakra-ui/react";
import { useNavigate, useLocation } from "react-router-dom";
import DiscountImage from "../assets/discountpopup.png"; // Ensure correct path
import { FaCaretUp } from "react-icons/fa";
const DiscountTag = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Extract gender from query parameters
  const searchParams = new URLSearchParams(location.search);
  const gender = searchParams.get("gender");
  // Toggle Popup
  const toggleDiscount = () => {
    setIsOpen(!isOpen);
  };

  // Navigate to "Upto 50%" Discount Page
  const handleNavigate = () => {
    if (gender === "Men") {
      navigate("/products?offerfilter=upto50&gender=Men");
    } else if (gender === "Women") {
      navigate("/products?offerfilter=upto50&gender=Women");
    }
  };
  return (
    <Box position="fixed" top="40%" right="0" zIndex="2000">
      <Button
        onClick={toggleDiscount}
        bg="#000346"
        color="white"
        transform="rotate(-90deg)"
        transformOrigin="right center"
        position="fixed"
        right="6"
        top="40%"
        width="240px"
        height="50px"
        fontWeight="800"
        fontSize={30}
        borderRadius="0"
        zIndex="2001"
        _hover={{ bg: "#ffb700" }}
        rightIcon={<Icon as={FaCaretUp} />}
      >
        GET 50% OFF
      </Button>
      {/* Popup */}
      {isOpen && (
        <Box
          position="fixed"
          top="61%"
          right="40px"
          transform="translateY(-50%)"
          boxShadow="xl"
          borderRadius="md"
          zIndex="2000"
        >
          <Button onClick={handleNavigate} bg="transparent" p="0">
            <Image src={DiscountImage} alt="Discount Offer" my="4" />
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default DiscountTag;
