import React, { useState } from "react";
import {
  Box,
  Flex,
  Text,
  Collapse,
  Icon,
  SimpleGrid,
} from "@chakra-ui/react";
import { ChevronDownIcon, ChevronUpIcon } from "@chakra-ui/icons";
import { MdOutlineLocalLaundryService } from "react-icons/md";
import { motion } from "framer-motion";

const MotionBox = motion(Box);

const WashCareDisplay = ({ washCare = [] }) => {
  const [isOpen, setIsOpen] = useState(false);

  if (!washCare || washCare.length === 0) return null;

  // 🔥 Container controls stagger animation
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
      },
    },
  };

  // 🔥 Each item animation
  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3 },
    },
  };

  return (
    <Box
      border="1px solid"
      borderColor="#e6e6e6"
      borderRadius="xl"
      overflow="hidden"
      mt={4}
      bg="white"
      boxShadow="sm"
    >
      {/* ── Header ── */}
      <Flex
        align="center"
        justify="space-between"
        px={{ base: 3, md: 5 }}
        py={3}
        cursor="pointer"
        onClick={() => setIsOpen((prev) => !prev)}
        _hover={{ bg: "#fafafa" }}
        transition="all 0.2s"
      >
        <Flex align="center" gap={3}>
          <Flex
            w="36px"
            h="36px"
            borderRadius="full"
            bg="#fbd983"
            align="center"
            justify="center"
          >
            <Icon
              as={MdOutlineLocalLaundryService}
              color="#09254a"
              boxSize={5}
            />
          </Flex>

          <Box>
            <Text fontSize="sm" fontWeight="600" color="#09254a">
              Wash Care Instructions
            </Text>
            <Text fontSize="11px" color="gray.500">
              {washCare.length}{" "}
              {washCare.length === 1 ? "point" : "points"}
            </Text>
          </Box>
        </Flex>

        <Icon
          as={isOpen ? ChevronUpIcon : ChevronDownIcon}
          boxSize={5}
          color="gray.500"
        />
      </Flex>

      {/* Divider */}
      <Box h="1px" bg="#f1f1f1" />

      {/* ── Body ── */}
      <Collapse in={isOpen} animateOpacity>
        <Box px={{ base: 3, md: 5 }} py={4}>
          <MotionBox
            variants={containerVariants}
            initial="hidden"
            animate={isOpen ? "show" : "hidden"}
          >
            <SimpleGrid columns={{ base: 1, sm: 2 }} spacing={3}>
              {washCare.map((point, index) => (
                <MotionBox key={index} variants={itemVariants}>
                  <Flex
                    align="flex-start"
                    gap={3}
                    p="12px"
                    bg="#fffaf0"
                    borderRadius="lg"
                    border="1px solid"
                    borderColor="#fbd983"
                    _hover={{
                      bg: "#fbd983",
                      color: "#09254a",
                      transform: "translateY(-2px)",
                    }}
                    transition="all 0.2s"
                  >
                    <Box
                      w="8px"
                      h="8px"
                      borderRadius="full"
                      bg="#09254a"
                      mt="6px"
                      flexShrink={0}
                    />
                    <Text fontSize="13px" lineHeight="1.6">
                      {point}
                    </Text>
                  </Flex>
                </MotionBox>
              ))}
            </SimpleGrid>
          </MotionBox>
        </Box>
      </Collapse>
    </Box>
  );
};

export default WashCareDisplay;