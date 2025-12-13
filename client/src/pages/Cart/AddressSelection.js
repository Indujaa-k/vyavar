import { Box, Text, HStack, IconButton } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { FaHome } from "react-icons/fa";
import { FiEdit } from "react-icons/fi";
import { useEffect } from "react";
import { getUserDetails } from "../../actions/userActions";
import { useDispatch, useSelector } from "react-redux";

const AddressSelection = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const userProfile = useSelector((state) => state.userDetails);
  const { user, loading } = userProfile;
  const handleAddressClick = () => {
    navigate("/profile"); // Redirect to profile address page
  };
  useEffect(() => {
    if (userInfo) {
      dispatch(getUserDetails("profile"));
    }
  }, [dispatch, userInfo]);

  console.log("User Profile:", user);
  return (
    <Box
      p={4}
      borderWidth="1px"
      borderRadius="md"
      bg="gray.100"
      cursor="pointer"
      w="full"
      _hover={{ bg: "gray.200" }}
      onClick={handleAddressClick}
    >
      <HStack justify="space-between">
        <HStack>
          <FaHome />
          <Text fontWeight="bold">Delivery in 60min | {user?.name}</Text>
        </HStack>
        <IconButton
          icon={<FiEdit />}
          aria-label="Change Address"
          size="sm"
          variant="ghost"
        />
      </HStack>
      <Text fontSize="sm" color="gray.600">
        {user?.address?.doorNo}, {user?.address?.street}, {user?.address?.city},{" "}
        {user?.address?.state}
      </Text>
    </Box>
  );
};

export default AddressSelection;
