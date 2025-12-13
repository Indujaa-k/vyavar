import React, { useRef } from "react";
import { Link as RouterLink, NavLink } from "react-router-dom";
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
import Logo from "../../assets/ecommerce-logo.png";

const DeliveryNavbar = () => {
  const dispatch = useDispatch();
  const cancelRef = useRef();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const logoutHandler = () => {
    dispatch(logout());
    onClose();
  };

  return (
    <Box
      as="nav"
      bg="#ffc627"
      px={4}
      py={1}
      color="white"
      position="fixed"
      top={0}
      width="100%"
      zIndex={1000}
      boxShadow="sm"
    >
      <Flex align="center" justifyContent="space-between" h="50px">
        {/* Navbar Logo */}
        <Box fontWeight="bold" fontSize="sm">
          <NavLink
            to="/deliveryhomepage"
            className="logos"
            style={{ display: "flex", alignItems: "center" }}
          >
            <img
              src={Logo}
              alt="logo"
              style={{
                height: "40px" ,// ↓ smaller logo
                marginRight: "6px",
                marginLeft:"20px"
              
              }}
            />
            <span
              className="logo-text"
              style={{ fontSize: "15px", color: "white" }}
            >
              E-Commerce
            </span>
          </NavLink>
        </Box>

        {/* Navbar Links */}
        <HStack spacing={4} ms={9}>
          <Link
            as={RouterLink}
            to="/profile"
            _hover={{ textDecoration: "none" }}
            color="white"
            fontSize="sm"
          >
            Profile
          </Link>
          <Button
            onClick={onOpen}
            size="sm"
            bg="white"
            color="black"
            _hover={{ bg: "gray.200" }}
          >
            Logout
          </Button>

          {/* Logout Confirmation Dialog */}
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
                p={6}
              >
                <AlertDialogHeader
                  fontSize="md"
                  fontWeight="bold"
                  textAlign="center"
                >
                  Logout Confirmation
                </AlertDialogHeader>

                <AlertDialogBody textAlign="center" fontSize="md">
                  Are you sure you want to log out?
                </AlertDialogBody>

                <AlertDialogFooter display="flex" justifyContent="center">
                  <Button
                    ref={cancelRef}
                    onClick={onClose}
                    borderRadius="8px"
                    bg="gray.300"
                    color="black"
                    px={5}
                    size="sm"
                    _hover={{ bg: "gray.400" }}
                  >
                    Cancel
                  </Button>
                  <Button
                    colorScheme="red"
                    onClick={logoutHandler}
                    ml={3}
                    px={5}
                    size="sm"
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

export default DeliveryNavbar;
