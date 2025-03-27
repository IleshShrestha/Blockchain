import { useState } from "react";
import {
  Box,
  Heading,
  VStack,
  FormControl,
  FormLabel,
  Input,
  Button,
  Card,
  CardBody,
  useToast,
  Text,
  HStack,
  Icon,
  List,
  ListItem,
  ListIcon,
} from "@chakra-ui/react";
import { FaBitcoin, FaServer, FaSync } from "react-icons/fa";
import blockchainApi from "../services/blockchainApi";

const Nodes = () => {
  const [nodeUrl, setNodeUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  const handleAddNode = async (e) => {
    e.preventDefault();
    if (!nodeUrl) {
      toast({
        title: "Error",
        description: "Please enter a valid node URL",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    setIsLoading(true);
    try {
      await blockchainApi.registerNodes([nodeUrl]);
      toast({
        title: "Node added successfully",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      setNodeUrl("");
    } catch (error) {
      toast({
        title: "Error adding node",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
    setIsLoading(false);
  };

  const handleResolveConflicts = async () => {
    setIsLoading(true);
    try {
      const result = await blockchainApi.resolveConflicts();
      toast({
        title: result.message,
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Error resolving conflicts",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
    setIsLoading(false);
  };

  return (
    <VStack spacing={8} align="stretch">
      <Heading>Manage Blockchain Nodes</Heading>

      <Card bg="gray.800">
        <CardBody>
          <form onSubmit={handleAddNode}>
            <VStack spacing={4}>
              <FormControl isRequired>
                <FormLabel>Node URL</FormLabel>
                <Input
                  value={nodeUrl}
                  onChange={(e) => setNodeUrl(e.target.value)}
                  placeholder="Enter node URL (e.g., http://192.168.0.5:5000)"
                  bg="gray.700"
                  borderColor="gray.600"
                  _hover={{ borderColor: "orange.400" }}
                  _focus={{ borderColor: "orange.400" }}
                />
              </FormControl>

              <Button
                type="submit"
                colorScheme="orange"
                width="full"
                isLoading={isLoading}
              >
                Add Node
              </Button>
            </VStack>
          </form>
        </CardBody>
      </Card>

      <Box>
        <HStack justify="space-between" mb={4}>
          <Heading size="md">Node Information</Heading>
          <Button
            leftIcon={<FaSync />}
            colorScheme="orange"
            onClick={handleResolveConflicts}
            isLoading={isLoading}
          >
            Resolve Conflicts
          </Button>
        </HStack>
        <Card bg="gray.800">
          <CardBody>
            <VStack align="stretch" spacing={4}>
              <Text>
                The blockchain network consists of multiple nodes that maintain
                copies of the blockchain. To add a new node:
              </Text>
              <List spacing={3}>
                <ListItem>
                  <ListIcon as={FaServer} color="orange.400" />
                  Enter the URL of the node you want to add
                </ListItem>
                <ListItem>
                  <ListIcon as={FaServer} color="orange.400" />
                  The URL should be in the format: http://IP_ADDRESS:PORT
                </ListItem>
                <ListItem>
                  <ListIcon as={FaServer} color="orange.400" />
                  Make sure the node is running and accessible
                </ListItem>
              </List>
              <Text mt={4}>
                Use the "Resolve Conflicts" button to ensure your node's
                blockchain is up to date with the network.
              </Text>
            </VStack>
          </CardBody>
        </Card>
      </Box>
    </VStack>
  );
};

export default Nodes;
