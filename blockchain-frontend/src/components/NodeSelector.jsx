import {
  Box,
  Select,
  Button,
  HStack,
  useToast,
  Text,
  VStack,
  FormControl,
  FormLabel,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import blockchainApi from "../services/blockchainApi";
import { FaSync } from "react-icons/fa";

const NodeSelector = ({ onNodeChange }) => {
  const [selectedNode, setSelectedNode] = useState("http://localhost:5000");
  const [availableNodes, setAvailableNodes] = useState([
    { url: "http://localhost:5000", name: "Node 1" },
  ]);
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleNodeChange = async (event) => {
    const newUrl = event.target.value;
    setSelectedNode(newUrl);

    try {
      // First register the other nodes with the new node
      const otherNodes = availableNodes
        .map((node) => node.url)
        .filter((url) => url !== newUrl);

      // Set the new base URL first
      blockchainApi.setBaseUrl(newUrl);

      // Register other nodes with the new node
      await blockchainApi.registerNodes(otherNodes);

      // Then trigger the node change callback
      onNodeChange();

      toast({
        title: "Node switched successfully",
        description: "Nodes have been registered with the new active node",
        status: "success",
        duration: 3000,
      });
    } catch (error) {
      toast({
        title: "Error switching nodes",
        description: error.message,
        status: "error",
        duration: 5000,
      });
    }
  };

  const fetchAvailableNodes = async () => {
    try {
      const nodes = await blockchainApi.getRegisteredNodes();

      // Start with the current node
      const currentNode = { url: selectedNode, name: "Node 1" };

      // Add any additional registered nodes
      const registeredNodes = nodes
        .map((node) => `http://${node}`)
        .filter((url) => url !== selectedNode)
        .map((url, index) => ({
          url,
          name: `Node ${index + 2}`,
        }));

      // Combine current node with registered nodes
      setAvailableNodes([currentNode, ...registeredNodes]);
    } catch (error) {
      console.error("Error fetching nodes:", error);
    }
  };

  // Add auto-registration on component mount
  useEffect(() => {
    const registerAllNodes = async () => {
      try {
        const otherNodes = availableNodes
          .map((node) => node.url)
          .filter((url) => url !== selectedNode);

        if (otherNodes.length > 0) {
          await blockchainApi.registerNodes(otherNodes);
        }
        await fetchAvailableNodes();
      } catch (error) {
        console.error("Error registering nodes:", error);
      }
    };

    registerAllNodes();
    const interval = setInterval(fetchAvailableNodes, 5000);
    return () => clearInterval(interval);
  }, [selectedNode]);

  const handleSyncChain = async () => {
    setIsLoading(true);
    try {
      await blockchainApi.resolveConflicts();
      onNodeChange(); // Refresh the dashboard
      toast({
        title: "Chain synchronized successfully",
        description: "Your blockchain is now up to date with the network",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom-right",
      });
    } catch (error) {
      toast({
        title: "Failed to sync chain",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-right",
      });
    }
    setIsLoading(false);
  };

  return (
    <Box bg="gray.800" p={4} borderRadius="md">
      <VStack spacing={4} align="stretch">
        <FormControl>
          <FormLabel>Select Active Node</FormLabel>
          <Select
            value={selectedNode}
            onChange={handleNodeChange}
            bg="gray.700"
            borderColor="gray.600"
          >
            {availableNodes.map((node) => (
              <option key={node.url} value={node.url}>
                {node.name} ({node.url})
              </option>
            ))}
          </Select>
        </FormControl>

        <HStack spacing={4}>
          <Button
            leftIcon={<FaSync />}
            colorScheme="orange"
            onClick={handleSyncChain}
            isLoading={isLoading}
            loadingText="Syncing..."
          >
            Sync Chain
          </Button>
          <Button colorScheme="orange" size="sm" onClick={fetchAvailableNodes}>
            Refresh Nodes
          </Button>
        </HStack>

        <Text fontSize="sm" color="gray.400">
          Current node: {selectedNode}
        </Text>
        <Text fontSize="sm" color="gray.400">
          Available nodes: {availableNodes.length}
        </Text>
      </VStack>
    </Box>
  );
};

export default NodeSelector;
