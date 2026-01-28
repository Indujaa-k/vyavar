import React, { useEffect } from "react";
import { ListUsers, DeleteUser } from "../../actions/userActions";
import { useDispatch, useSelector } from "react-redux";
import HashLoader from "react-spinners/HashLoader";
import "./Users.css";

import {
  Button,
  Input,
  Table,
  Text,
  Thead,
  Avatar,
  Tbody,
  Tr,
  Th,
  Td,
  Stack,
  Box,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Divider,
} from "@chakra-ui/react";
import { Helmet } from "react-helmet";
import { useNavigate } from "react-router-dom";

import { Link } from "react-router-dom";
import { AiFillDelete, AiOutlineEdit } from "react-icons/ai";
import UsersPieChart from "./UsersPieChart";

const Users = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userList = useSelector((state) => state.userList);
  const { loading, error, users } = userList;
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;
  const userDelete = useSelector((state) => state.userDelete);
  const { success: successDelete } = userDelete;

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedUser, setSelectedUser] = React.useState(null);
  const {
    isOpen: isDeleteOpen,
    onOpen: onDeleteOpen,
    onClose: onDeleteClose,
  } = useDisclosure();

  const [userToDelete, setUserToDelete] = React.useState(null);

  const openViewModal = (user) => {
    setSelectedUser(user);
    onOpen();
  };

  useEffect(() => {
    if ((userInfo && userInfo.isAdmin) || userInfo.isSeller) {
      dispatch(ListUsers());
    } else {
      navigate("/login");
    }
  }, [dispatch, navigate, successDelete, userInfo]);

  const openDeleteModal = (user) => {
    setUserToDelete(user);
    onDeleteOpen();
  };

  const confirmDelete = () => {
    if (userToDelete) {
      dispatch(DeleteUser(userToDelete._id));
      onDeleteClose();
      setUserToDelete(null);
    }
  };

  return (
    <>
      <div className="Users">
        <h1 className="titlepanel"> Users</h1>
        {loading ? (
          <div className="loading">
            <HashLoader color={"#1e1e2c"} loading={loading} size={40} />
          </div>
        ) : error ? (
          <h1>error</h1>
        ) : (
          <Box overflowX="auto" maxW="1000px" mx="auto" p={4}>
            <UsersPieChart />

            <Table className="tableusers" variant="striped">
              <Thead>
                <Tr>
                  <Th textAlign="center" w="10%">
                    Profile
                  </Th>
                  <Th textAlign="center" w="15%">
                    Name
                  </Th>
                  <Th textAlign="center" w="20%">
                    Subscription
                  </Th>
                  <Th textAlign="center" w="10%">
                    Admin
                  </Th>
                  <Th textAlign="center" w="10%">
                    Seller
                  </Th>
                  <Th textAlign="center" w="10%">
                    Orders
                  </Th>
                  <Th textAlign="center" w="10%"></Th>
                </Tr>
              </Thead>
              <Tbody>
                {users.map((user) => (
                  <Tr key={user._id}>
                    {/* Profile Picture */}
                    <Td textAlign="center">
                      <Avatar
                        size="sm"
                        name={user.name}
                        src={
                          user.profilePicture ||
                          "https://via.placeholder.com/50"
                        }
                      />
                    </Td>
                    <Td>
                      <Text fontWeight="medium">{user.name}</Text>
                    </Td>
                    <Td>
                      {user.subscription?.isActive ? (
                        <Box fontSize="sm">
                          <Text>
                            <strong>Amount:</strong> ₹{user.subscription.price}
                          </Text>
                          <Text>
                            <strong>Start:</strong>
                            {new Date(
                              user.subscription.startDate,
                            ).toLocaleDateString()}
                          </Text>
                          <Text>
                            <strong>End:</strong>
                            {new Date(
                              user.subscription.endDate,
                            ).toLocaleDateString()}
                          </Text>
                          <Text>
                            <strong>Discount Percent:</strong>
                            {user.subscription.discountPercent}%
                          </Text>
                        </Box>
                      ) : (
                        <Text fontSize="sm" color="gray.500">
                          Not Subscribed
                        </Text>
                      )}
                    </Td>
                    <Td>
                      {user.isAdmin ? (
                        <div className="paid">YES</div>
                      ) : (
                        <div className="notpaid">NO</div>
                      )}
                    </Td>
                    <Td>
                      {user.isSeller ? (
                        <div className="paid">YES</div>
                      ) : (
                        <div className="notpaid">NO</div>
                      )}
                    </Td>
                    <Td textAlign="center">
                      <Button colorScheme="purple" size="xs" fontWeight="bold">
                        {user.orderCount || 0} Orders
                      </Button>
                    </Td>

                    <Td>
                      {userInfo?.isAdmin && !userInfo?.isSeller && (
                        <Stack>
                          <Button
                            size="xs"
                            colorScheme="teal"
                            onClick={() => openViewModal(user)}
                          >
                            VIEW
                          </Button>

                          <Link to={`/admin/user/${user._id}/edit`}>
                            <Button
                              leftIcon={<AiOutlineEdit size="16" />}
                              colorScheme="blue"
                              size="xs"
                            >
                              EDIT
                            </Button>
                          </Link>

                          <Button
                            colorScheme="red"
                            leftIcon={<AiFillDelete size="16" />}
                            size="xs"
                            onClick={() => openDeleteModal(user)}
                          >
                            DELETE
                          </Button>
                        </Stack>
                      )}
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </Box>
        )}
      </div>

      {/* view modal */}
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        size="lg"
        scrollBehavior="outside"
        isCentered
      >
        <ModalOverlay />
        <ModalContent maxH="unset">
          <ModalHeader>User Details</ModalHeader>
          <ModalCloseButton />

          <ModalBody overflow="hidden">
            {selectedUser && (
              <Stack spacing={4}>
                {/* Profile */}
                <Stack direction="row" align="center">
                  <Avatar
                    size="lg"
                    src={selectedUser.profilePicture}
                    name={selectedUser.name}
                  />
                  <Box>
                    <Text fontWeight="bold">{selectedUser.name}</Text>
                    <Text fontSize="sm" color="gray.500">
                      {selectedUser.email}
                    </Text>
                  </Box>
                </Stack>

                <Divider />

                {/* Roles */}
                <Box>
                  <Text>
                    <strong>Admin:</strong>{" "}
                    {selectedUser.isAdmin ? "Yes" : "No"}
                  </Text>
                  <Text>
                    <strong>Seller:</strong>{" "}
                    {selectedUser.isSeller ? "Yes" : "No"}
                  </Text>
                </Box>

                <Divider />

                {/* Subscription */}
                <Box>
                  <Text fontWeight="bold">Subscription</Text>
                  {selectedUser.subscription?.isActive ? (
                    <Stack fontSize="sm">
                      <Text>Amount: ₹{selectedUser.subscription.price}</Text>
                      <Text>
                        Start:{" "}
                        {new Date(
                          selectedUser.subscription.startDate,
                        ).toLocaleDateString()}
                      </Text>
                      <Text>
                        End:{" "}
                        {new Date(
                          selectedUser.subscription.endDate,
                        ).toLocaleDateString()}
                      </Text>
                      <Text>
                        Discount: {selectedUser.subscription.discountPercent}%
                      </Text>
                    </Stack>
                  ) : (
                    <Text color="gray.500">Not Subscribed</Text>
                  )}
                </Box>

                <Divider />

                {/* Address */}
                <Box>
                  <Text fontWeight="bold">Address</Text>
                  {selectedUser.addresses?.length > 0 ? (
                    <Text fontSize="sm">
                      {(() => {
                        const addr =
                          selectedUser.addresses.find((a) => a.isDefault) ||
                          selectedUser.addresses[0];
                        return [
                          addr.doorNo,
                          addr.street,
                          addr.city,
                          addr.state,
                          addr.pin,
                          addr.phoneNumber,
                        ]
                          .filter(Boolean)
                          .join(", ");
                      })()}
                    </Text>
                  ) : (
                    <Text color="gray.500">No Address Provided</Text>
                  )}
                </Box>

                <Divider />

                {/* Orders */}
                <Box>
                  <Text>
                    <strong>Total Orders:</strong>{" "}
                    {selectedUser.orderCount || 0}
                  </Text>
                </Box>
              </Stack>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>

      <Modal isOpen={isDeleteOpen} onClose={onDeleteClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader color="red.500">Confirm Deletion</ModalHeader>
          <ModalCloseButton />

          <ModalBody>
            <Text>
              Are you sure you want to delete{" "}
              <strong>{userToDelete?.name}</strong>?
            </Text>
            <Text fontSize="sm" color="gray.500" mt={2}>
              This action cannot be undone.
            </Text>
          </ModalBody>

          <Stack direction="row" justify="flex-end" p={4} spacing={3}>
            <Button onClick={onDeleteClose}>Cancel</Button>
            <Button colorScheme="red" onClick={confirmDelete}>
              Delete
            </Button>
          </Stack>
        </ModalContent>
      </Modal>
    </>
  );
};

export default Users;
