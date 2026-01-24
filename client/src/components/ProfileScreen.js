import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Helmet } from "react-helmet";
import axios from "axios";
import {
  getUserDetails,
  updateUserProfile,
  logout,
} from "../actions/userActions";
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
  Radio,
  RadioGroup,
  IconButton,
} from "@chakra-ui/react";
import {
  FaUser,
  FaMapMarkerAlt,
  FaShoppingBag,
  FaInfoCircle,
  FaPhoneAlt,
  FaFileContract,
  FaShieldAlt,
  FaUndo,
  FaSignOutAlt,
  FaCamera,
  FaTrash,
  FaBoxOpen,
} from "react-icons/fa";
import { CloseIcon } from "@chakra-ui/icons";
import Trust from "../components/Trustdetails/Trust";
import profileimg from "../assets/profile_profile.svg";
import addressimg from "../assets/profile_address.svg";
import ordersimg from "../assets/profile_orders.svg";
import profiletag from "../assets/profiletag.png";
import { getShippingSettings } from "../actions/shippingActions";
const ProfileScreen = () => {
  const [activeSection, setActiveSection] = useState("profile");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [addresses, setAddresses] = useState([]); // For multiple addresses
  const [editingAddress, setEditingAddress] = useState(null); // Address being edited
  const [newAddress, setNewAddress] = useState({
    doorNo: "",
    street: "",
    nearestLandmark: "",
    city: "",
    state: "",
    pin: "",
    phoneNumber: "",
    isDefault: false,
  });

  const [profilePicture, setProfilePicture] = useState(null);
  const [lastName, setLastName] = useState("");
  const [gender, setGender] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  // const [errors, setErrors] = useState({});
  const [orderTab, setOrderTab] = useState("all");
  const [showForm, setShowForm] = useState(false);

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

  // useEffect(() => {
  //   if (!userInfo) {
  //     navigate("/login");
  //   } else {
  //     if (!user || !user.name) {
  //       dispatch(getUserDetails("profile"));
  //     } else {
  //       setName(user.name || "");
  //       setEmail(user.email || "");
  //       if (user?.addresses) {
  //         setAddresses(Array.isArray(user?.addresses) ? user.addresses : []);
  //       }
  //       setProfilePicture(
  //         user.profilePicture &&
  //           user.profilePicture !== "/images/default-profile.png"
  //           ? user.profilePicture
  //           : null
  //       );

  //       setGender(user.gender || "");
  //       setDateOfBirth(user.dateOfBirth ? user.dateOfBirth.split("T")[0] : "");
  //       setLastName(user.lastName || "");
  //     }
  //   }
  // }, [dispatch, navigate, userInfo, user]);
  const shipping = useSelector((state) => state.checkoutShipping);
  const { shippingRules = [], loading: loadingShipping } = shipping || {};
  const isAdmin = user?.isAdmin === true;
  const isSeller = user?.role === "seller";
  const isRestrictedUser = isAdmin || isSeller;

  useEffect(() => {
    if (userInfo) {
      dispatch(getShippingSettings());
    }
  }, [dispatch, userInfo]);

  useEffect(() => {
    if (!userInfo) {
      navigate("/login");
    } else {
      if (!user || !user.name) {
        dispatch(getUserDetails("profile"));
      } else {
        setName(user.name || "");
        setLastName(user.lastName || "");
        setEmail(user.email || "");
        setGender(user.gender || "");
        setDateOfBirth(user.dateOfBirth ? user.dateOfBirth.split("T")[0] : "");
        setAddresses(Array.isArray(user.addresses) ? user.addresses : []);
        setProfilePicture(
          user.profilePicture &&
            user.profilePicture !== "/images/default-profile.png"
            ? user.profilePicture
            : null,
        );
      }
    }
  }, [dispatch, navigate, userInfo, user]);

  // Fetch orders when user opens the Orders section
  useEffect(() => {
    if (activeSection === "orders") {
      dispatch(listMyOrders());
    }
  }, [activeSection, dispatch]);
  const [errors, setErrors] = useState({}); // Already exists

  // Save / Update address
  const handleSaveAddress = async () => {
    let updatedAddresses = [];

    if (editingAddress !== null) {
      // Replace by index
      updatedAddresses = addresses.map((addr, i) =>
        i === editingAddress ? { ...newAddress } : addr,
      );
    } else {
      // Add new address
      updatedAddresses = [...addresses, newAddress];
    }

    // Ensure only one default
    if (newAddress.isDefault) {
      updatedAddresses = updatedAddresses.map((a, i) => ({
        ...a,
        isDefault:
          editingAddress !== null
            ? i === editingAddress
            : i === updatedAddresses.length - 1,
      }));
    }

    // Fallback default
    if (
      !updatedAddresses.some((a) => a.isDefault) &&
      updatedAddresses.length > 0
    ) {
      updatedAddresses[0].isDefault = true;
    }

    const formData = new FormData();
    formData.append("addresses", JSON.stringify(updatedAddresses));

    await dispatch(updateUserProfile(formData));
    dispatch(getUserDetails("profile"));

    setAddresses(updatedAddresses); // 🔹 Update UI instantly
    setShowForm(false);
    setEditingAddress(null);
    setNewAddress({
      doorNo: "",
      street: "",
      nearestLandmark: "",
      city: "",
      state: "",
      pin: "",
      phoneNumber: "",
      isDefault: false,
    });
  };

  const handleDeleteAddress = async (index) => {
    const updated = addresses.filter((_, i) => i !== index);

    // default fallback
    if (!updated.some((a) => a.isDefault) && updated.length > 0) {
      updated[0].isDefault = true;
    }

    const formData = new FormData();
    formData.append("addresses", JSON.stringify(updated));

    await dispatch(updateUserProfile(formData));
    dispatch(getUserDetails("profile"));
  };

  const handleSetDefault = async (index) => {
    const updated = addresses.map((addr, i) => ({
      ...addr,
      isDefault: i === index,
    }));

    const formData = new FormData();
    formData.append("addresses", JSON.stringify(updated));

    await dispatch(updateUserProfile(formData));
    dispatch(getUserDetails("profile"));
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setProfilePicture(file); // UI instant preview

    const formData = new FormData();
    formData.append("profilePicture", file);

    try {
      await dispatch(updateUserProfile(formData));
      dispatch(getUserDetails("profile"));

      toast({
        title: "Profile picture updated",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (err) {
      toast({
        title: "Image upload failed",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleDeleteProfilePicture = async () => {
    try {
      await axios.delete(
        `${process.env.REACT_APP_API_URL}/api/users/profile/picture`,
        {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        },
      );

      // 🔄 Clear image instantly
      setProfilePicture(null);

      // 🔄 Refresh user data
      dispatch(getUserDetails("profile"));

      // ✅ Snackbar
      toast({
        title: "Profile Photo Deleted",
        description: "Your profile photo has been removed.",
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
    } catch (error) {
      toast({
        title: "Delete Failed",
        description: "Unable to delete profile photo.",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", name);
    formData.append("lastName", lastName);
    formData.append("email", email);
    formData.append("gender", gender);
    formData.append("dateOfBirth", dateOfBirth ? dateOfBirth : null);
    formData.append("addresses", JSON.stringify(addresses));

    // if (profilePicture instanceof File) {
    //   formData.append("profilePicture", profilePicture);
    // }

    try {
      await dispatch(updateUserProfile(formData));
      toast({
        title: "Profile Updated",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      dispatch(getUserDetails("profile"));
    } catch (error) {
      console.error("Update failed:", error);
    }
  };

  const menuOptions = [
    // ✅ Profile for ALL users
    { id: "profile", label: "Profile", icon: FaUser },

    // ✅ Only NORMAL users
    ...(!isRestrictedUser
      ? [
          {
            id: "subscription",
            label: "Subscriptions",
            path: "/subscription",
            icon: FaBoxOpen,
          },
          {
            id: "addresses",
            label: "Address",
            icon: FaMapMarkerAlt,
          },
          {
            id: "orders",
            label: "My Orders",
            icon: FaShoppingBag,
          },
          {
            id: "about",
            label: "About",
            path: "/About",
            icon: FaInfoCircle,
          },
          {
            id: "contactus",
            label: "Contact Us",
            path: "/Contactus",
            icon: FaPhoneAlt,
          },
        ]
      : []),

    // ✅ Logout for ALL
    ...(!isRestrictedUser
      ? [
          {
            id: "logout",
            label: "Logout",
            icon: FaSignOutAlt,
            onClick: handleLogout,
          },
        ]
      : []),
  ];

  const renderProfile = () => (
    <Box
      mx="auto"
      p={0}
      display="flex"
      flexDirection="column"
      alignItems="center"
    >
      <VStack
        as="form"
        onSubmit={submitHandler}
        spacing={4}
        w="100%"
        maxW="500px"
        mx="auto"
      >
        <FormControl>
          <Box position="relative" width="110px" height="110px" mx="auto">
            {/* PROFILE IMAGE */}
            <Box
              boxSize="100px"
              borderRadius="full"
              overflow="hidden"
              bg="gray.300"
              display="flex"
              alignItems="center"
              justifyContent="center"
              fontSize="3xl"
              fontWeight="bold"
              color="white"
            >
              {profilePicture ? (
                <img
                  src={
                    profilePicture instanceof File
                      ? URL.createObjectURL(profilePicture)
                      : user?.profilePicture ||
                        "https://via.placeholder.com/150"
                  }
                  alt="Profile"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              ) : user?.profilePicture &&
                user.profilePicture !== "/images/default-profile.png" ? (
                <Box
                  w="40px"
                  h="40px"
                  borderRadius="full"
                  bg="rgb(3,156,195)"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  overflow="hidden"
                >
                  {user?.profilePicture &&
                  user.profilePicture !== "/images/default-profile.png" ? (
                    <img
                      src={user.profilePicture}
                      alt="Profile"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  ) : (
                    <Text color="white" fontWeight="bold">
                      {user?.name?.charAt(0)?.toUpperCase() || "U"}
                    </Text>
                  )}
                </Box>
              ) : (
                <Text fontSize="3xl" fontWeight="bold" color="white">
                  {user?.name?.charAt(0)?.toUpperCase() || "U"}
                </Text>
              )}
            </Box>

            {/* CAMERA ICON (NEAR IMAGE) */}
            <Box
              position="absolute"
              bottom="0"
              right="0"
              bg="black"
              p={2}
              borderRadius="full"
              cursor="pointer"
              boxShadow="md"
              onClick={() => document.getElementById("imageUpload").click()}
            >
              <Icon as={FaCamera} color="white" boxSize={4} />
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
          <FormLabel fontSize={{ base: "sm", md: "md" }} mb={1}>
            First Name
          </FormLabel>

          <Input
            type="text"
            fontSize={{ base: "sm", md: "md" }}
            h={{ base: "40px", md: "44px" }}
            placeholder="Enter your first name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </FormControl>

        <FormControl>
          <FormLabel>Last Name</FormLabel>
          <Input
            type="text"
            fontSize={{ base: "sm", md: "md" }}
            h={{ base: "40px", md: "44px" }}
            placeholder="Enter your last name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
        </FormControl>

        <FormControl>
          <FormLabel>Email</FormLabel>
          <Input
            type="email"
            fontSize={{ base: "sm", md: "md" }}
            h={{ base: "40px", md: "44px" }}
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </FormControl>

        <FormControl>
          <FormLabel>Date of Birth</FormLabel>
          <Input
            type="date"
            fontSize={{ base: "sm", md: "md" }}
            h={{ base: "40px", md: "44px" }}
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

        <HStack spacing={3} w="full">
          <Button bg="black" color="white" type="submit" flex="1">
            Update
          </Button>
          {user?.profilePicture &&
            user.profilePicture !== "/images/default-profile.png" && (
              <Button
                leftIcon={<FaTrash />}
                colorScheme="red"
                onClick={handleDeleteProfilePicture}
                flex="1"
              >
                Delete Picture
              </Button>
            )}
        </HStack>
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

  const renderAddresses = () => {
    return (
      <Box mx="auto" p={6}>
        {/* ADDRESS LIST */}
        {!showForm && (
          <HStack w="100%" justify="space-between" mb={4}>
            <Button colorScheme="blue" onClick={() => setShowForm(true)}>
              Add Address
            </Button>

            <Button
              colorScheme="red"
              onClick={() => {
                setShowForm(false);
                setEditingAddress(null);
              }}
            >
              Cancel
            </Button>
          </HStack>
        )}

        <RadioGroup
          value={String(addresses.findIndex((a) => a.isDefault))}
          onChange={(val) => handleSetDefault(Number(val))}
        >
          <VStack spacing={4} align="stretch" mb={6}>
            {addresses.map((addr, index) => (
              <Box
                key={addr._id || index}
                p={4}
                border="1px solid"
                borderRadius="md"
                borderColor={addr.isDefault ? "green.400" : "gray.300"}
              >
                <Flex
                  direction={{ base: "column", md: "row" }}
                  align={{ base: "flex-start", md: "center" }}
                  gap={3}
                >
                  <Radio
                    value={String(index)}
                    colorScheme="green"
                    alignItems="flex-start"
                  >
                    <Box ml={2}>
                      <Text fontWeight="600" fontSize="sm">
                        {addr.doorNo}, {addr.street}
                      </Text>
                      <Text fontSize="xs">
                        {addr.city}, {addr.state} - {addr.pin}
                      </Text>
                      <Text fontSize="xs">Phone: {addr.phoneNumber}</Text>
                    </Box>
                  </Radio>
                  <HStack
                    spacing={2}
                    w="full"
                    justify={{ base: "flex-end", md: "flex-start" }}
                  >
                    <Button
                      size="sm"
                      onClick={() => {
                        setEditingAddress(index);
                        const { _id, ...rest } = addr;
                        setNewAddress(rest);
                        setShowForm(true);
                      }}
                    >
                      Edit
                    </Button>

                    <Button
                      size="sm"
                      colorScheme="red"
                      onClick={() => handleDeleteAddress(index)}
                    >
                      Delete
                    </Button>
                  </HStack>
                </Flex>
              </Box>
            ))}
          </VStack>
        </RadioGroup>

        {/* FORM */}
        {showForm && (
          <Box
            p={4}
            border="1px solid"
            borderRadius="md"
            w="100%"
            maxW="500px"
            mx="auto"
            position="relative"
          >
            <IconButton
              type="button"
              icon={<CloseIcon />}
              size="sm"
              position="absolute"
              top="10px"
              right="10px"
              zIndex={10}
              bg="white"
              _hover={{ bg: "gray.100" }}
              aria-label="Close"
              onClick={(e) => {
                e.stopPropagation();
                setShowForm(false);
                setEditingAddress(null);
                setNewAddress({
                  doorNo: "",
                  street: "",
                  nearestLandmark: "",
                  city: "",
                  state: "",
                  pin: "",
                  phoneNumber: "",
                  isDefault: false,
                });
                setErrors({});
              }}
            />

            <VStack spacing={3} align="stretch">
              {Object.keys(newAddress)
                .filter((k) => k !== "isDefault")
                .map((field) => (
                  <FormControl key={field}>
                    <FormLabel>
                      {field.replace(/([A-Z])/g, " $1").toUpperCase()}
                    </FormLabel>

                    {field === "state" ? (
                      <select
                        value={newAddress.state}
                        onChange={(e) =>
                          setNewAddress({
                            ...newAddress,
                            state: e.target.value,
                          })
                        }
                        style={{
                          width: "100%",
                          padding: "8px",
                          borderRadius: "6px",
                          border: "1px solid #ccc",
                        }}
                      >
                        <option value="">Select State</option>

                        {shippingRules.map((rule) => (
                          <option key={rule._id} value={rule.state}>
                            {rule.state}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <Input
                        value={newAddress[field]}
                        placeholder={`Enter ${field}`}
                        onChange={(e) =>
                          setNewAddress({
                            ...newAddress,
                            [field]: e.target.value,
                          })
                        }
                      />
                    )}
                  </FormControl>
                ))}

              {/* LEFT & RIGHT BUTTONS */}
              <HStack justify="space-between">
                <Button
                  type="button"
                  colorScheme="red"
                  onClick={() => {
                    setShowForm(false);
                    setEditingAddress(null);
                  }}
                >
                  Cancel
                </Button>

                <Button
                  colorScheme="blue"
                  onClick={() => {
                    handleSaveAddress(); // Save or update
                    setShowForm(false); // Close form after saving
                  }}
                >
                  {editingAddress ? "Update Address" : "Add Address"}
                </Button>
              </HStack>
            </VStack>
          </Box>
        )}
      </Box>
    );
  };
  const getStatusLabel = (status) => {
    switch (status) {
      case "DELIVERED":
        return "Delivered";
      case "OUT_FOR_DELIVERY":
        return "Dispatched";
      case "CONFIRMED":
      case "PACKED":
        return "Active";
      default:
        return "Active";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "DELIVERED":
        return "green.500";
      case "OUT_FOR_DELIVERY":
        return "blue.500";
      default:
        return "orange.500";
    }
  };

  const renderOrders = () => {
    const filteredOrders = (orders || []).filter((order) => {
      if (orderTab === "all") return true;

      if (orderTab === "active")
        return (
          order.orderStatus === "CONFIRMED" || order.orderStatus === "PACKED"
        );

      if (orderTab === "dispatched")
        return order.orderStatus === "OUT_FOR_DELIVERY";

      return true;
    });

    return (
      <Box mb={4} flexShrink={0}>
        {/* ✅ NEW WRAPPER */}
        <Flex
          direction={{ base: "column", md: "row" }}
          gap={3}
          mb={4} // 👈 THIS LINE (under space)
        >
          <Button
            w={{ base: "100%", md: "auto" }}
            variant={orderTab === "all" ? "solid" : "outline"}
            colorScheme="blue"
            onClick={() => setOrderTab("all")}
          >
            All Orders
          </Button>

          <Button
            w={{ base: "100%", md: "auto" }}
            variant={orderTab === "active" ? "solid" : "outline"}
            colorScheme="blue"
            onClick={() => setOrderTab("active")}
          >
            Active Orders
          </Button>

          <Button
            variant={orderTab === "dispatched" ? "solid" : "outline"}
            colorScheme="blue"
            onClick={() => setOrderTab("dispatched")}
          >
            Dispatched
          </Button>
        </Flex>
        {/* Orders List */}
        {loadingOrders ? (
          <Flex justify="center" align="center" h="200px">
            <Spinner size="xl" />
          </Flex>
        ) : errorOrders ? (
          <Alert status="error">
            <AlertIcon />
            {errorOrders}
          </Alert>
        ) : filteredOrders.length === 0 ? (
          <Flex
            direction="column"
            align="center"
            justify="center"
            h="200px"
            color="gray.500"
          >
            <Text fontSize="lg" mb={2}>
              No orders found
            </Text>
            <Text fontSize="sm">
              Looks like you haven’t placed any {orderTab} orders yet.
            </Text>
          </Flex>
        ) : (
          <VStack spacing={4} align="stretch">
            {filteredOrders.map((order) => (
              <Box
                key={order._id}
                p={4}
                border="1px solid"
                borderColor="gray.200"
                borderRadius="md"
                shadow="sm"
              >
                <Flex
                  justify="space-between"
                  align="center"
                  mb={2}
                  display={{ base: "none", md: "flex" }} // DESKTOP ONLY
                >
                  {/* LEFT SIDE */}
                  <Box>
                    <Text fontSize="sm" color="gray.600">
                      Order ID: {order._id}
                    </Text>

                    <Text fontWeight="bold">
                      ₹{order.totalPrice.toFixed(2)} •{" "}
                      {new Date(order.createdAt).toLocaleDateString()}
                    </Text>

                    {/* ✅ STATUS – LEFT SIDE */}
                    <Text
                      mt={1}
                      fontSize="sm"
                      fontWeight="600"
                      color={getStatusColor(order.orderStatus)}
                    >
                      {getStatusLabel(order.orderStatus)}
                    </Text>
                  </Box>

                  {/* RIGHT SIDE */}
                  <Link to={`/order/${order._id}`}>
                    <Button size="sm" colorScheme="blue">
                      View Details
                    </Button>
                  </Link>
                </Flex>

                <Flex
                  mt={4}
                  pt={3}
                  mb={2}
                  borderTop="1px solid"
                  borderColor="gray.200"
                  justify="space-between"
                  align="center"
                  display={{ base: "flex", md: "none" }} // 📱 MOBILE ONLY
                >
                  <Text
                    fontSize="sm"
                    fontWeight="600"
                    color={getStatusColor(order.orderStatus)}
                  >
                    {getStatusLabel(order.orderStatus)}
                  </Text>

                  <Link to={`/order/${order._id}`}>
                    <Button size="sm" colorScheme="blue">
                      View Details
                    </Button>
                  </Link>
                </Flex>
                <Box display={{ base: "block", md: "none" }} mb={2}>
                  <Text fontSize="sm" color="gray.600">
                    Order ID: {order._id}
                  </Text>

                  <Text fontSize="sm" fontWeight="600">
                    ₹{order.totalPrice.toFixed(2)} •{" "}
                    {new Date(order.createdAt).toLocaleDateString()}
                  </Text>
                </Box>

                {/* Order Items */}
                <VStack spacing={3} align="stretch">
                  {order.orderItems.map((item) => {
                    console.log("Order Items:", order.orderItems);
                    // moved inside function body
                    return (
                      <Flex
                        key={item._id}
                        align="center"
                        gap={3}
                        direction={{ base: "row", sm: "row" }} // 🔥 ALWAYS row
                      >
                        {/* IMAGE */}
                        <Box w="60px" h="60px" flexShrink={0}>
                          <img
                            src={item.product?.images?.[0]}
                            alt={item.name}
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                              borderRadius: "6px",
                            }}
                          />
                        </Box>

                        {/* NAME + QTY */}
                        <Box flex="1">
                          <Text fontWeight="600">{item.name}</Text>
                          <Text fontSize="sm" color="gray.600">
                            Qty: {item.qty} • ₹{item.price.toFixed(2)}
                          </Text>
                        </Box>
                      </Flex>
                    );
                  })}
                </VStack>
              </Box>
            ))}
          </VStack>
        )}
      </Box>
    );
  };

  const renderContent = () => {
    // 🔒 Admin & Seller → Profile ONLY
    if (isRestrictedUser) {
      return renderProfile();
    }

    // 👤 Normal users
    switch (activeSection) {
      case "profile":
        return renderProfile();
      case "addresses":
        return renderAddresses();
      case "orders":
        return renderOrders();
      default:
        return renderProfile();
    }
  };

  return (
    <Box mt={20} bg="white">
      <Helmet>
        <title>Profile</title>
      </Helmet>

      <Flex
        direction={{ base: "column", md: isRestrictedUser ? "column" : "row" }}
        gap={8}
        justify="center"
        align="stretch"
        mx="auto"
        maxW={isRestrictedUser ? "520px" : "1000px"}
        w="full"
        p={5}
        minH="520px"
      >
        {/* LEFT SIDE MENU → ONLY NORMAL USER */}
        {!isRestrictedUser && (
          <Box
            bg="white"
            p={4}
            border="1px solid"
            borderColor="gray.300"
            borderRadius="md"
            w={{ base: "100%", md: "360px" }}
            minW="unset"
            flex="1"
            overflowY="visible"
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
                  {menu.id === "logout" ? (
                    <HStack
                      p={3}
                      borderRadius="md"
                      cursor="pointer"
                      bg="red.500"
                      color="white"
                      onClick={menu.onClick}
                    >
                      {menu.icon && (
                        <Icon as={menu.icon} boxSize={5} color="white" />
                      )}
                      <Text fontWeight="600">{menu.label}</Text>
                    </HStack>
                  ) : (
                    <Link
                      to={menu.path || "#"}
                      style={{ textDecoration: "none" }}
                    >
                      <HStack
                        p={3}
                        borderRadius="md"
                        cursor="pointer"
                        color={activeSection === menu.id ? "white" : "black"}
                        bg={activeSection === menu.id ? "black" : "gray.100"}
                        onClick={() => setActiveSection(menu.id)}
                      >
                        {menu.icon && (
                          <Icon
                            as={menu.icon}
                            boxSize={5}
                            color={
                              activeSection === menu.id
                                ? "rgb(3,156,195)"
                                : "gray.500"
                            }
                          />
                        )}
                        <Text fontWeight="600">{menu.label}</Text>
                      </HStack>
                    </Link>
                  )}
                </ListItem>
              ))}
            </List>
          </Box>
        )}

        {/* RIGHT SIDE CONTENT → ALL USERS */}
        <Box
          p={{ base: 4, md: 6 }}
          bg="white"
          rounded="lg"
          shadow="sm"
          border="1px solid"
          borderColor="gray.300"
          flex="1"
          w="100%"
          h="700px"
          overflow="hidden"
        >
          <Box
            h={{ base: "auto", md: "100%" }}
            overflowY={{ base: "visible", md: "auto" }}
            pr={{ base: 0, md: 2 }}
            css={{
              scrollbarWidth: "none",
              "&::-webkit-scrollbar": { display: "none" },
            }}
          >
            {/* 🔥 ADMIN / SELLER → PROFILE ONLY */}
            {isRestrictedUser ? renderProfile() : renderContent()}
          </Box>
        </Box>
      </Flex>

      <Trust />
    </Box>
  );
};

export default ProfileScreen;
