import React, { useState, useEffect } from "react";
import { Box, Button, Image, Icon } from "@chakra-ui/react";
import { useNavigate, useLocation } from "react-router-dom";
import DiscountImage from "../assets/discountpopup.png";
import { FaCaretUp } from "react-icons/fa";

const DiscountTag = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Get gender from URL
  const searchParams = new URLSearchParams(location.search);
  const gender = searchParams.get("gender");
  const toggleDiscount = () => {
    setIsOpen((prev) => !prev);
  };

  // 🔔 Auto popup after 1 minute (for both login & non-login)
  useEffect(() => {
    const openTimer = setTimeout(() => {
      setIsOpen(true);

      // 👇 auto close after 2 seconds
      const closeTimer = setTimeout(() => {
        setIsOpen(false);
      }, 5000);

      return () => clearTimeout(closeTimer);
    }, 5000); // popup open after 5 sec (testing)

    return () => clearTimeout(openTimer);
  }, []);

  
  const handleNavigate = () => {
    if (gender === "Men") {
      navigate("/products?offerfilter=upto50&gender=Men");
    } else if (gender === "Women") {
      navigate("/products?offerfilter=upto50&gender=Women");
    } else {
      navigate("/products?offerfilter=upto50");
    }
  };

  return (
    <Box position="fixed" top="40%" right="0" zIndex="2000">
      {/* Side Button */}
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
        GET 90% OFF
      </Button>

      {/* Popup */}
      {isOpen && (
        <Box
          position="fixed"
          top="60%"
          right="40px"
          transform="translateY(-50%)"
          boxShadow="xl"
          borderRadius="md"
          zIndex="2000"
        >
          <Button onClick={handleNavigate} bg="transparent" p="0">
            <Image src={DiscountImage} alt="Discount Offer" />
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default DiscountTag;
