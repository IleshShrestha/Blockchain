import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Heading,
  VStack,
  HStack,
  Text,
  useToast,
} from "@chakra-ui/react";
import blockchainApi from "../services/blockchainApi";
import NodeSelector from "./NodeSelector";

function Dashboard() {
  const [nodeId, setNodeId] = useState("");
  const toast = useToast();

  const handleSync = async () => {
    try {
      await blockchainApi.resolveConflicts();
      toast({
        title: "Chain synchronized",
        status: "success",
        position: "bottom",
        duration: 3000,
      });
    } catch (error) {
      toast({
        title: "Sync failed",
        description: error.message,
        status: "error",
        position: "bottom",
        duration: 3000,
      });
    }
  };

  return (
    <VStack spacing={6} align="stretch" p={6}>
      <Heading size="lg">Blockchain Dashboard</Heading>

      <Box>
        <NodeSelector onNodeChange={() => fetchNodeId()} />
      </Box>

      <HStack spacing={4}>
        <Button
          onClick={handleSync}
          bg="yellow.200"
          _hover={{ bg: "yellow.300" }}
        >
          Sync Chain
        </Button>
      </HStack>

      <Text fontSize="sm" color="whiteAlpha.600">
        Current node: {nodeId || "http://localhost:5000"}
      </Text>
    </VStack>
  );
}

export default Dashboard;
