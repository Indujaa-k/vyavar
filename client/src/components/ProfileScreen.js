import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Helmet } from "react-helmet";
import { getUserDetails, updateUserProfile } from "../actions/userActions";
import { listMyOrders } from "../actions/orderActions";
import {
  Box,
  Flex,
  Button,
  Input,
  Table,
  Thead,
  Tbody,
  Tr,
  Icon,
  List,
  ListItem,
  Th,
  Td,
  Text,
  VStack,
  HStack,
  Alert,
  AlertIcon,
  FormControl,
  FormLabel,
  Spinner,
  useToast,
} from "@chakra-ui/react";
import { FaSignOutAlt } from "react-icons/fa";
import { FaCamera } from "react-icons/fa";

import Trust from "../components/Trustdetails/Trust";
import profileimg from "../assets/profile_profile.svg";
import addressimg from "../assets/profile_address.svg";
import ordersimg from "../assets/profile_orders.svg";
import profiletag from "../assets/profiletag.png";

const ProfileScreen = () => {
  const [activeSection, setActiveSection] = useState("profile");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState({});
  const [profilePicture, setProfilePicture] = useState(null);
  const [lastName, setLastName] = useState("");
  const [gender, setGender] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [errors, setErrors] = useState({});

  const toast = useToast();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const userDetails = useSelector((state) => state.userDetails);
  const { error, user } = userDetails;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const userUpdateProfile = useSelector((state) => state.userUpdateProfile);
  const { success } = userUpdateProfile;

  const orderMylist = useSelector((state) => state.orderMylist);
  const { loading: loadingOrders, error: errorOrders, orders } = orderMylist;

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

 useEffect(() => {
  if (!userInfo) {
    navigate("/login");
  } else {
    if (!user || !user.name) {
      dispatch(getUserDetails("profile"));
    } else {
      setName(user.name || "");
      setEmail(user.email || "");
      setAddress(user.address || {});
      setProfilePicture(user.profilePicture || null);
      setGender(user.gender || "");
      setDateOfBirth(
        user.dateOfBirth ? user.dateOfBirth.split("T")[0] : ""
      );
      setLastName(user.lastName || "");
    }
  }
}, [dispatch, navigate, userInfo, user]);

  // Fetch orders when user opens the Orders section
  useEffect(() => {
    if (activeSection === "orders") {
      dispatch(listMyOrders());
    }
  }, [activeSection, dispatch]);

  // ✅ Handle Image Upload
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePicture(file);
    }
  };

  // ✅ Handle Profile Update
  const submitHandler = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("lastName", lastName);
    formData.append("gender", gender);
    formData.append("dateOfBirth", dateOfBirth);
    formData.append("address", JSON.stringify(address));
    if (profilePicture) {
      formData.append("profilePicture", profilePicture);
    }

    dispatch(updateUserProfile(formData));
    toast({
      title: "Profile Updated",
      description: "Your profile has been successfully updated.",
      status: "success",
      duration: 3000,
      isClosable: true,
      position: "top",
    });
  };

  const validateAddress = () => {
    let newErrors = {};

    if (!String(address.doorNo || "").trim()) {
      newErrors.doorNo = "Door number is required";
    }

    if (!String(address.street || "").trim()) {
      newErrors.street = "Street is required";
    }

    if (!String(address.city || "").trim()) {
      newErrors.city = "City is required";
    }

    if (!String(address.state || "").trim()) {
      newErrors.state = "State is required";
    }

    const pin = String(address.pin || "");

    if (!pin.trim()) {
      newErrors.pin = "PIN code is required";
    } else if (!/^\d{6}$/.test(pin)) {
      newErrors.pin = "PIN must be 6 digits";
    }

    const phone = String(address.phoneNumber || "");

    if (!phone.trim()) {
      newErrors.phoneNumber = "Phone number is required";
    } else if (!/^\d{10}$/.test(phone)) {
      newErrors.phoneNumber = "Phone must be 10 digits";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  // ✅ Handle Address Update (separate)
  const handleAddressUpdate = (e) => {
    e.preventDefault();

    if (!validateAddress()) {
      toast({
        title: "Invalid Address",
        description: "Please fill the highlighted fields.",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
      return;
    }
    const formData = new FormData();
    formData.append("address", JSON.stringify(address));

    dispatch(updateUserProfile(formData));
    toast({
      title: "Address Updated",
      description: "Your address has been successfully updated.",
      status: "success",
      duration: 3000,
      isClosable: true,
      position: "top",
    });

    // Optional: refresh details
    dispatch(getUserDetails("profile"));
  };

  const menuOptions = [
    { id: "profile", label: "Profile", image: profileimg },
    { id: "addresses", label: "Address", image: addressimg },
    { id: "orders", label: "My Orders", image: ordersimg },
    { id: "about", label: "About", path: "/About" },
    { id: "contactus", label: "Contact Us", path: "/Contactus" },
    {
      id: "Terms and conditions",
      label: "Terms and Conditions",
      path: "/_blank ",
    },
    {
      id: "Privacy policy",
      label: "Privacy Policy",
      path: "/_blank",
    },
    {
      id: "Return policy",
      label: "Return Policy",
      path: "/_blank",
    },
    {
      id: "logout",
      label: "Logout",
      icon: FaSignOutAlt,
      onClick: handleLogout,
    },
  ];

  const renderProfile = () => (
    <Box
      mx="auto"
      p={0}
      display="flex"
      flexDirection="column"
      alignItems="center"
    >
      <VStack as="form" onSubmit={submitHandler} spacing={4}>
        <FormControl>
          <Box
            position="relative"
            boxSize="100px"
            borderRadius="full"
            overflow="hidden"
            mx="auto"
          >
            <img
              src={
                user?.profilePicture ||
                (profilePicture instanceof File
                  ? URL.createObjectURL(profilePicture)
                  : "https://via.placeholder.com/150")
              }
              alt="Profile"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
            <Box
              position="absolute"
              bottom={2}
              right={2}
              bg="blackAlpha.700"
              p={2}
              borderRadius="full"
              cursor="pointer"
              onClick={() => document.getElementById("imageUpload").click()}
            >
              <Icon as={FaCamera} color="white" boxSize={5} />
            </Box>
            <Input
              id="imageUpload"
              type="file"
              accept="image/*"
              hidden
              onChange={handleImageChange}
            />
          </Box>
        </FormControl>

        <FormControl>
          <FormLabel>First Name</FormLabel>
          <Input
            type="text"
            placeholder="Enter your first name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </FormControl>

        <FormControl>
          <FormLabel>Last Name</FormLabel>
          <Input
            type="text"
            placeholder="Enter your last name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
        </FormControl>

        <FormControl>
          <FormLabel>Email</FormLabel>
          <Input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </FormControl>

        <FormControl>
          <FormLabel>Date of Birth</FormLabel>
          <Input
            type="date"
            value={dateOfBirth}
            onChange={(e) => setDateOfBirth(e.target.value)}
          />
        </FormControl>

        <FormControl>
          <FormLabel>Gender</FormLabel>
          <select
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            style={{
              width: "100%",
              padding: "8px",
              borderRadius: "4px",
              border: "1px solid #ccc",
            }}
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </FormControl>

        <Button bg="black" color="white" type="submit" w="full">
          Update
        </Button>
      </VStack>
    </Box>
  );

  const fieldOrder = [
    "doorNo",
    "street",
    "nearestLandmark",
    "city",
    "state",
    "pin",
    "phoneNumber",
  ];

  const renderAddresses = () => (
    <Box mx="auto" p={6}>
      <VStack spacing={4} align="stretch">
        {fieldOrder.map((field) => (
          <FormControl key={field}>
            <FormLabel>
              {field.replace(/([A-Z])/g, " $1").toUpperCase()}
            </FormLabel>
            <Input
              value={address[field] || ""}
              placeholder={`Enter ${field}`}
              onChange={(e) =>
                setAddress({ ...address, [field]: e.target.value })
              }
            />

            {errors[field] && (
              <Text color="red.500" fontSize="sm" mt={1}>
                {errors[field]}
              </Text>
            )}
          </FormControl>
        ))}
        <Button bg="black" color="white" onClick={handleAddressUpdate}>
          Update
        </Button>
      </VStack>
    </Box>
  );

  const renderOrders = () => (
    <Box overflowX="auto">
      {loadingOrders ? (
        <Flex justify="center" align="center" h="200px">
          <Spinner size="xl" />
        </Flex>
      ) : errorOrders ? (
        <Alert status="error">
          <AlertIcon />
          {errorOrders}
        </Alert>
      ) : orders.length === 0 ? (
        <Text textAlign="center" fontSize="lg" color="gray.500" mt={10}>
          No Orders Found
        </Text>
      ) : (
        <Table>
          <Thead>
            <Tr></Tr>
          </Thead>
          <Tbody>
            {orders.map((order) =>
              order.orderItems.map((item) => (
                <Box
                  key={item._id}
                  p={4}
                  border="1px solid"
                  borderColor="gray.200"
                  borderRadius="md"
                  mb={4}
                >
                  <HStack
                    justifyContent="space-between"
                    spacing={4}
                    alignItems="center"
                  >
                    <Text fontSize="sm" color="gray.600">
                      {order.orderItems.length} Item
                      {order.orderItems.length > 1 ? "s" : ""} • ₹
                      {order.totalPrice.toFixed(2)} •{" "}
                      {new Date(order.createdAt).toLocaleDateString()}
                    </Text>

                    <Link to={`/order/${order._id}`}>
                      <Box textAlign="center">
                        <Box
                          boxSize="60px"
                          overflow="hidden"
                          border="1px solid gray"
                          cursor="pointer"
                        >
                          <img
                            src={item.product.images[0]}
                            alt={item.name}
                            width="60"
                            height="60"
                            style={{ objectFit: "cover" }}
                          />
                        </Box>
                        <Text fontWeight="bold" fontSize="sm" mt={2}>
                          {item.product.brandname}
                        </Text>
                      </Box>
                    </Link>
                  </HStack>
                </Box>
              ))
            )}
          </Tbody>
        </Table>
      )}
    </Box>
  );

  const renderContent = () => {
    switch (activeSection) {
      case "profile":
        return renderProfile();
      case "addresses":
        return renderAddresses();
      case "orders":
        return renderOrders();
      default:
        return null;
    }
  };

  return (
    <Box mt={20} bg="white">
      <Helmet>
        <title>Profile</title>
      </Helmet>

      <Flex
        direction={{ base: "column", md: "row" }}
        gap={8}
        justify="center"
        align="start"
        mx="auto"
        maxW="1000px"
        w="full"
        p={5}
      >
        {/* LEFT SIDE MENU */}
        <Box
          bg="white"
          p={4}
          border="1px solid"
          borderColor="gray.300"
          borderRadius="md"
          minW="450px"
          h="562px"
          overflowY="auto"
          css={{
            scrollbarWidth: "none",
            "&::-webkit-scrollbar": { display: "none" },
          }}
        >
          <Box mb="3">
            <img src={profiletag} alt="Profile" width="full" height="full" />
          </Box>
          <List spacing={3}>
            {menuOptions.map((menu) => (
              <ListItem key={menu.id}>
                <Link to={menu.path} style={{ textDecoration: "none" }}>
                  <HStack
                    p={3}
                    borderRadius="md"
                    cursor="pointer"
                    color={activeSection === menu.id ? "white" : "black"}
                    bg={activeSection === menu.id ? "black" : "gray.100"}
                    onClick={() => setActiveSection(menu.id)}
                  >
                    {menu.image && (
                      <img
                        src={menu.image}
                        alt={menu.label}
                        width="24"
                        height="24"
                        style={{ borderRadius: "5px" }}
                      />
                    )}
                    <Text fontWeight="600">{menu.label}</Text>
                  </HStack>
                </Link>
              </ListItem>
            ))}
          </List>
        </Box>

        {/* RIGHT SIDE CONTENT */}
        <Box
          p={6}
          bg="white"
          rounded="lg"
          shadow="sm"
          border="1px solid"
          borderColor="gray.300"
          flex="1"
          minW="600px"
          h="562px"
          overflow="hidden"
        >
          <Box
            h="100%"
            overflowY="auto"
            pr={2}
            css={{
              scrollbarWidth: "none",
              "&::-webkit-scrollbar": { display: "none" },
            }}
          >
            {renderContent()}
          </Box>
        </Box>
      </Flex>
      <Trust />
    </Box>
  );
};

export default ProfileScreen;
