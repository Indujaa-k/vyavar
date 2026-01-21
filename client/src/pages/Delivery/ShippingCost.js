import React, { useEffect, useState } from "react";
import {
  Box,
  Heading,
  Input,
  Button,
  Stack,
  Text,
  Divider,
  Flex,
  FormControl,
  FormLabel,
  Spinner,
  useToast,
} from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import {
  getShippingSettings,
  addStateShipping,
  updateStateShipping,
  updateFreeShipping,
  deleteStateShipping,
} from "../../actions/shippingActions";

const AdminShippingScreen = () => {
  const dispatch = useDispatch();
  const toast = useToast();

  const { loading, freeShippingAbove, shippingRules, error } = useSelector(
    (state) => state.adminShipping
  );

  /* ---------- Free shipping state ---------- */
  const [isEditingFree, setIsEditingFree] = useState(false);
  const [freeCost, setFreeCost] = useState("");

  /* ---------- Add state ---------- */
  const [stateName, setStateName] = useState("");
  const [stateCost, setStateCost] = useState("");

  /* ---------- Edit state costs ---------- */
  const [editingStateId, setEditingStateId] = useState(null);
  const [editingCost, setEditingCost] = useState("");

  useEffect(() => {
    dispatch(getShippingSettings());
  }, [dispatch]);

  /* ---------- Free Shipping Update ---------- */
  const updateFreeShippingHandler = () => {
    dispatch(updateFreeShipping(Number(freeCost)));

    toast({
      title: "Free shipping updated",
      description: `New limit: ₹${freeCost}`,
      status: "success",
      duration: 3000,
      isClosable: true,
    });

    setIsEditingFree(false);
    setFreeCost("");
  };

  /* ---------- State Cost Update ---------- */
  const updateStateHandler = (id) => {
    dispatch(updateStateShipping(id, Number(editingCost)));

    toast({
      title: "State cost updated",
      status: "success",
      duration: 3000,
      isClosable: true,
    });

    setEditingStateId(null);
    setEditingCost("");
  };

  /* ---------- Delete State Cost -------- */

  const deleteStateHandler = (id, stateName) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete "${stateName}" shipping cost?`
    );

    if (!confirmDelete) return;

    dispatch(deleteStateShipping(id));

    toast({
      title: "State deleted",
      description: `${stateName} removed successfully`,
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  };

  return (
    <Box p={6} maxW="800px" mx="auto">
      <Heading size="lg" mb={6} mt={4}>
        Shipping Settings
      </Heading>

      {loading && <Spinner />}
      {error && <Text color="red.500">{error}</Text>}

      {/* ================= FREE SHIPPING ================= */}
      <Box p={5} borderWidth="1px" borderRadius="lg">
        <Heading size="md" mb={3}>
          Free Shipping
        </Heading>

        {!isEditingFree ? (
          <Flex justify="space-between" align="center">
            <Text>
              Free shipping above: <b>₹{freeShippingAbove}</b>
            </Text>
            <Button
              size="sm"
              onClick={() => {
                setIsEditingFree(true);
                setFreeCost(freeShippingAbove);
              }}
            >
              Edit
            </Button>
          </Flex>
        ) : (
          <Stack direction="row" spacing={3}>
            <Input
              type="number"
              value={freeCost}
              onChange={(e) => setFreeCost(e.target.value)}
            />
            <Button colorScheme="teal" onClick={updateFreeShippingHandler}>
              Update
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setIsEditingFree(false);
                setFreeCost("");
              }}
            >
              Cancel
            </Button>
          </Stack>
        )}
      </Box>

      <Divider my={6} />

      {/* ================= ADD STATE ================= */}
      <Box p={5} borderWidth="1px" borderRadius="lg">
        <Heading size="md" mb={3}>
          Add State Shipping
        </Heading>

        <Stack spacing={3}>
          <FormControl isRequired>
            <FormLabel>State</FormLabel>
            <Input
              value={stateName}
              onChange={(e) => setStateName(e.target.value)}
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Cost (₹)</FormLabel>
            <Input
              type="number"
              value={stateCost}
              onChange={(e) => setStateCost(e.target.value)}
            />
          </FormControl>

          <Button
            colorScheme="blue"
            onClick={() => {
              dispatch(addStateShipping(stateName, Number(stateCost)));
              toast({
                title: "State added",
                status: "success",
                duration: 3000,
                isClosable: true,
              });
              setStateName("");
              setStateCost("");
            }}
          >
            Add State
          </Button>
        </Stack>
      </Box>

      <Divider my={6} />

      {/* ================= STATE LIST ================= */}
      <Box p={5} borderWidth="1px" borderRadius="lg">
        <Heading size="md" mb={4}>
          State-wise Delivery Cost
        </Heading>

        {shippingRules.length === 0 ? (
          <Text>No states added</Text>
        ) : (
          <Stack spacing={4}>
            {shippingRules.map((rule) => (
              <Flex key={rule._id} align="center" justify="space-between">
                <Text fontWeight="bold">{rule.state}</Text>

                {editingStateId !== rule._id ? (
                  <>
                    <Text>₹{rule.cost}</Text>

                    <Stack direction="row" spacing={2}>
                      <Button
                        size="sm"
                        onClick={() => {
                          setEditingStateId(rule._id);
                          setEditingCost(rule.cost);
                        }}
                      >
                        Edit
                      </Button>

                      <Button
                        size="sm"
                        colorScheme="red"
                        variant="outline"
                        onClick={() => deleteStateHandler(rule._id, rule.state)}
                      >
                        Delete
                      </Button>
                    </Stack>
                  </>
                ) : (
                  <>
                    <Input
                      type="number"
                      w="150px"
                      value={editingCost}
                      onChange={(e) => setEditingCost(e.target.value)}
                    />
                    <Button
                      size="sm"
                      colorScheme="teal"
                      onClick={() => updateStateHandler(rule._id)}
                    >
                      Update
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setEditingStateId(null);
                        setEditingCost("");
                      }}
                    >
                      Cancel
                    </Button>
                  </>
                )}
              </Flex>
            ))}
          </Stack>
        )}
      </Box>
    </Box>
  );
};

export default AdminShippingScreen;
