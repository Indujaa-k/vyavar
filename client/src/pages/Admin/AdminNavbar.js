import React from "react";
import { useRef } from "react";
import { Link as RouterLink } from "react-router-dom";
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

const AdminNavbar = () => {
  const userProfile = useSelector((state) => state.userDetails);
  const { user } = userProfile;

  const cancelRef = useRef();
  const dispatch = useDispatch();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const logoutHandler = () => {
    dispatch(logout());
    onClose();
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
            <RouterLink to="/profile" className="user-profile">
              {user?.profilePicture ? (
                <img
                  src={
                    user.profilePicture.startsWith("http")
                      ? user.profilePicture
                      : `http://localhost:5000${user.profilePicture}`
                  }
                  alt="Profile"
                  className="profile-img"
                  onError={(e) => (e.target.style.display = "none")}
                />
              ) : (
                <CgProfile size="25" className="settingIcon" />
              )}
              <span style={{ color: "black" }}>{user?.name}</span>
            </RouterLink>
          </div>
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
    </Box>
  );
};

export default AdminNavbar;
