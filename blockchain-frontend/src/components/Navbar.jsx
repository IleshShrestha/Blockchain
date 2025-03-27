import { Box, Flex, Link, Heading, useColorModeValue } from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import { FaBitcoin } from "react-icons/fa";

const Navbar = () => {
  const bgColor = useColorModeValue("gray.800", "gray.900");
  const linkColor = useColorModeValue("gray.200", "white");

  return (
    <Box bg={bgColor} px={4} shadow="md">
      <Flex h={16} alignItems="center" justifyContent="space-between">
        <Flex alignItems="center">
          <FaBitcoin size={32} color="#F7931A" />
          <Heading size="md" ml={2} color="white">
            Blockchain Explorer
          </Heading>
        </Flex>
        <Flex gap={8}>
          <Link
            as={RouterLink}
            to="/"
            color={linkColor}
            _hover={{ color: "orange.400" }}
          >
            Dashboard
          </Link>
          <Link
            as={RouterLink}
            to="/transactions"
            color={linkColor}
            _hover={{ color: "orange.400" }}
          >
            Transactions
          </Link>
          <Link
            as={RouterLink}
            to="/nodes"
            color={linkColor}
            _hover={{ color: "orange.400" }}
          >
            Nodes
          </Link>
        </Flex>
      </Flex>
    </Box>
  );
};

export default Navbar;
