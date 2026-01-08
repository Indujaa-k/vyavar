import React from "react";
import { useRef } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import {
  Box,
  Flex,
  Button,
  HStack,
  Link,
  useDisclosure,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
} from "@chakra-ui/react";
import { useDispatch } from "react-redux";
import { logout } from "../../actions/userActions";
import Logo from "../../assets/vyavarlogo-crop.png";
import "./Adminstyling.css";
import { NavLink } from "react-router-dom";
import { CgProfile } from "react-icons/cg";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { getUserDetails } from "../../actions/userActions";
import {
  getActiveOfferBanner,
  clearActiveOfferBanner,
} from "../../actions/bannerActions";
import { useEffect } from "react";

const AdminNavbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const userDetails = useSelector((state) => state.userDetails);
  const { loading, error, user } = userDetails;

  const cancelRef = useRef();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { banner } = useSelector((state) => state.activeOfferBanner || {});

  useEffect(() => {
    dispatch(getUserDetails("profile")); // 🔥 REQUIRED
  }, [dispatch]);

  const logoutHandler = () => {
    dispatch(logout());
    onClose();
  };
  const handleBack = () => {
    dispatch(clearActiveOfferBanner());
    navigate(-1);
  };

  return (
    <Box
      as="nav"
      bg="white"
      px={4}
      py={3}
      color="black"
      position="fixed"
      top={0}
      width="100%"
      zIndex={1000}
      border="1px solid #E2E8F0"
      boxShadow="sm"
    >
      <Flex align="center" justifyContent="space-between">
        {/* Navbar Logo */}
        <Box fontWeight="bold" fontSize="lg">
          <NavLink to="/adminDashboard" className="logoimg">
            <img src={Logo} alt="logo" />
            <span className="logoimg-text">E-Commerce</span>
          </NavLink>
        </Box>

        {/* Navbar Links */}
        <HStack spacing={6} ms={9}>
          <div className="ic_sett_dis">
            <RouterLink
              to="/profile"
              className="user-profile"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                textDecoration: "none",
              }}
            >
              {/* Profile Image */}
              {user?.profilePicture && (
                <img
                  src={
                    user.profilePicture.startsWith("http")
                      ? user.profilePicture
                      : `http://localhost:5000${user.profilePicture}`
                  }
                  alt="Profile"
                  style={{
                    width: "32px",
                    height: "32px",
                    borderRadius: "50%",
                    objectFit: "cover",
                  }}
                  onError={(e) => {
                    e.target.style.display = "none";
                    e.target.nextSibling.style.display = "flex";
                  }}
                />
              )}

              {/* Default Empty Profile Icon */}
              <CgProfile
                size={25}
                style={{
                  display: user?.profilePicture ? "none" : "flex",
                  color: "#666",
                }}
              />

              <span style={{ color: "black", fontWeight: "500" }}>
                {user?.name || "Admin"}
              </span>
            </RouterLink>
          </div>

          <button
            onClick={() => {
              dispatch(getActiveOfferBanner());
              navigate("/");
            }}
            style={{
              padding: "8px 16px",
              backgroundColor: "#000",
              color: "#fff",
              border: "none",
              cursor: "pointer",
              borderRadius: "4px",
            }}
          >
            Preview
          </button>

          <Button
            colorScheme="teal" 
            variant="solid" 
            size="md" 
            borderRadius="md" 
            onClick={handleBack} 
            _hover={{ bg: "teal.600" }} 
          >
            Back
          </Button>

          <Button bg="violet" onClick={onOpen}>
            Logout
          </Button>

          <AlertDialog
            isOpen={isOpen}
            leastDestructiveRef={cancelRef}
            onClose={onClose}
          >
            <AlertDialogOverlay>
              <AlertDialogContent
                borderRadius="12px"
                boxShadow="lg"
                bg="white"
                maxW="320px"
                height={80}
                p={6} /* ⬅️ Added padding */
                animation="fadeIn 0.3s ease-in-out"
              >
                <AlertDialogHeader
                  fontSize="md"
                  fontWeight="bold"
                  textAlign="center"
                  p={4}
                >
                  Logout Confirmation
                </AlertDialogHeader>

                <AlertDialogBody textAlign="center" fontSize="md" p={5}>
                  Are you sure you want to log out? <br />
                </AlertDialogBody>

                <AlertDialogFooter display="flex" justifyContent="center" p={4}>
                  <Button
                    ref={cancelRef}
                    onClick={onClose}
                    borderRadius="8px"
                    bg="gray.300"
                    color="black"
                    px={6}
                    _hover={{ bg: "gray.400" }}
                  >
                    Cancel
                  </Button>
                  <Button
                    colorScheme="red"
                    onClick={logoutHandler}
                    ml={3}
                    px={6}
                    borderRadius="8px"
                    _hover={{ bg: "red.600" }}
                  >
                    Logout
                  </Button>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialogOverlay>
          </AlertDialog>
        </HStack>
      </Flex>
      {banner && (
        <div
          style={{
            backgroundColor: "#fbd983",
            overflow: "hidden",
            whiteSpace: "nowrap",
            padding: "12px 8px",
            position: "sticky",
            top: "70px",
            zIndex: 999,
            fontWeight: "700",
            marginTop: "8px",
          }}
        >
          <div
            style={{
              display: "inline-block",
              paddingLeft: "100%",
              animation:
                "marquee 15s linear infinite, shine 2s linear infinite",
              fontSize: "16px",
              background:
                "linear-gradient(90deg, #000 40%, #fff 50%, #000 60%)",
              backgroundSize: "200% auto",
              color: "transparent",
              WebkitBackgroundClip: "text",
            }}
          >
            {`${banner.offerText} • ${banner.offerText} • ${banner.offerText}`}
          </div>

          <style>
            {`
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-100%); }
        }

        @keyframes shine {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
      `}
          </style>
        </div>
      )}
    </Box>
  );
};

export default AdminNavbar;
