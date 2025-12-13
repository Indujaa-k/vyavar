import React, { useState } from "react";
import { Box, Text, Flex, Collapse, Button } from "@chakra-ui/react";
import { AddIcon, MinusIcon } from "@chakra-ui/icons";

const FilterCategory = ({ title, children, onApplyFilters }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleDetails = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <Box mb={4}>
      <Flex
        alignItems="center"
        cursor="pointer"
        onClick={toggleDetails}
        gap={2}
        px={4}
        borderBottom="1px solid "
        borderColor="gray.200"
      >
        {isExpanded ? (
          <MinusIcon boxSize={3} />
        ) : (
          <AddIcon boxSize={3} color="black" />
        )}
        <Text fontWeight="600" color="black">
          {title}
        </Text>
      </Flex>
      <Collapse in={isExpanded} animateOpacity>
        <Box mt={2} p={2} border="1px solid" borderColor="gray.200">
          <Flex justifyContent="space-between" alignItems="center" mb={2}>
            <Button
              bg="black"
              color="white"
              size="xs"
              ml="auto"
              onClick={onApplyFilters}
            >
              Apply Filters
            </Button>
          </Flex>

          {children}
        </Box>
      </Collapse>
    </Box>
  );
};

export default FilterCategory;
