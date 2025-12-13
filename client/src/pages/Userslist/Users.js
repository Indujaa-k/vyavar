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

  useEffect(() => {
    if (userInfo && userInfo.isAdmin) {
      dispatch(ListUsers());
    } else {
      navigate("/login");
    }
  }, [dispatch, navigate, successDelete, userInfo]);

  const deletehandler = (id) => {
    if (window.confirm("Are You Sure?")) {
      dispatch(DeleteUser(id));
    }
  };
  return (
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
                <Th textAlign="center" w="5%">
                  ID
                </Th>
                <Th textAlign="center" w="10%">
                  Profile
                </Th>
                <Th textAlign="center" w="15%">
                  Name
                </Th>
                <Th textAlign="center" w="20%">
                  Email
                </Th>
                <Th textAlign="center" w="20%">
                  Address
                </Th>
                <Th textAlign="center" w="10%">
                  Admin
                </Th>
                <Th textAlign="center" w="10%">
                  Delivery
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
                  <Td>{user._id}</Td>
                  {/* Profile Picture */}
                  <Td textAlign="center">
                    <Avatar
                      size="sm"
                      name={user.name}
                      src={
                        user.profilePicture || "https://via.placeholder.com/50"
                      }
                    />
                  </Td>
                  <Td>{user.name}</Td>
                  <Td>
                    <a href={`mailto:${user.email}`}></a>
                    {user.email}
                  </Td>
                  <Td>
                    {user.address &&
                    Object.values(user.address).some((val) => val) ? (
                      <Text>
                        {[
                          user.address.doorNo,
                          user.address.street,
                          user.address.city,
                          user.address.phoneNumber,
                          user.address.state,
                          user.address.pin,
                        ]
                          .filter((field) => field)
                          .join(", ")}{" "}
                      </Text>
                    ) : (
                      <Text color="gray.500">No Address Provided</Text>
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
                    {user.isDelivery ? (
                      <div className="paid">YES</div>
                    ) : (
                      <div className="notpaid">NO</div>
                    )}
                  </Td>

                  <Td textAlign="center">
                    <Button colorScheme="purple" size="xs" fontWeight="bold">
                      {user.orderHistory?.length
                        ? user.orderHistory.length
                        : "0"}{" "}
                      Orders
                    </Button>
                  </Td>

                  <Td>
                    <Stack>
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
                        onClick={() => {
                          deletehandler(user._id);
                        }}
                      >
                        DELETE
                      </Button>
                    </Stack>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
      )}
    </div>
  );
};

export default Users;
