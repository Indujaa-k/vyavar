import React from "react";
import {
  Box,
  Flex,
  Input,
  Text,
  IconButton,
  Button,
  FormLabel,
} from "@chakra-ui/react";
import { AddIcon, CloseIcon } from "@chakra-ui/icons";

const WashCareInput = ({ value = [], onChange }) => {
  const addPoint = () => onChange([...value, ""]);

  const updatePoint = (index, text) => {
    const updated = [...value];
    updated[index] = text;
    onChange(updated);
  };

  const removePoint = (index) => onChange(value.filter((_, i) => i !== index));

  return (
    <Box
      border="0.5px solid"
      borderColor="gray.200"
      borderRadius="lg"
      p={4}
      bg="white"
      mt={4}
    >
      <Flex
        align="center"
        gap={2}
        mb={3}
        pb={3}
        borderBottom="0.5px solid"
        borderColor="gray.100"
      >
        <Box
          w="22px"
          h="22px"
          borderRadius="full"
          bg="blue.50"
          display="flex"
          alignItems="center"
          justifyContent="center"
          flexShrink={0}
        >
          <Text fontSize="10px" color="blue.500" fontWeight="600">
            W
          </Text>
        </Box>
        <Box>
          <FormLabel mb={0} fontSize="sm" fontWeight="500" color="gray.700">
            Wash Care Instructions
          </FormLabel>
          <Text fontSize="11px" color="gray.400">
            Each line becomes a bullet point for customers
          </Text>
        </Box>
      </Flex>

      <Flex direction="column" gap={2} mb={3}>
        {value.map((point, index) => (
          <Flex key={index} align="center" gap={2}>
            <Box
              w="6px"
              h="6px"
              borderRadius="full"
              bg="gray.300"
              flexShrink={0}
            />
            <Input
            flex={3}  
              size="sm"
              value={point}
              placeholder={`e.g. Machine wash cold at 30°C`}
              onChange={(e) => updatePoint(index, e.target.value)}
              borderColor="gray.200"
              _focus={{ borderColor: "blue.300", bg: "white" }}
              bg="gray.50"
              fontSize="13px"
            />
            <IconButton
              flex={1}
              icon={<CloseIcon boxSize="8px" />}
              size="sm"
              variant="ghost"
              colorScheme="red"
              aria-label="Remove"
              onClick={() => removePoint(index)}
              borderRadius="full"
            />
          </Flex>
        ))}
      </Flex>

      <Button
        size="xs"
        variant="outline"
        colorScheme="blue"
        leftIcon={<AddIcon boxSize="8px" />}
        onClick={addPoint}
        borderStyle="dashed"
      >
        Add instruction
      </Button>
    </Box>
  );
};

export default WashCareInput;
