import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ListUsers } from "../../actions/userActions";
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Avatar,
  Text,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

const DeliveryDetails = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const userList = useSelector((state) => state.userList);
  const { loading, error, users } = userList;

  useEffect(() => {
    dispatch(ListUsers());
  }, [dispatch]);

  const deliveryUsers = users?.filter((user) => user.isDelivery);

  return (
    <Box p={5} m={10}>
    
      {loading ? (
        <Text>Loading...</Text>
      ) : error ? (
        <Text color="red.500">Error loading users</Text>
      ) : deliveryUsers.length === 0 ? (
        <Text>No delivery users found.</Text>
      ) : (
        <Table variant="striped" bg={"pink.100"}>
          <Thead>
            <Tr>
              <Th>Profile</Th>
              <Th>Name</Th>
              <Th>Email</Th>
              <Th>Phone</Th>
              <Th>Address</Th>
            </Tr>
          </Thead>
          <Tbody>
            {deliveryUsers.map((user) => (
              <Tr key={user._id}>
                <Td>
                  <Avatar
                    size="sm"
                    name={user.name}
                    src={
                      user.profilePicture || "https://via.placeholder.com/50"
                    }
                  />
                </Td>
                <Td>{user.name}</Td>
                <Td>{user.email}</Td>
                <Td>{user.address?.phoneNumber || "N/A"}</Td>
                <Td>
                  {user.address
                    ? `${user.address.street}, ${user.address.city}, ${user.address.state}, ${user.address.pin}`
                    : "N/A"}
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      )}
    </Box>
  );
};

export default DeliveryDetails;
