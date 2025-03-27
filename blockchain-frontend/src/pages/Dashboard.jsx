import { useState, useEffect } from "react";
import {
  Box,
  Heading,
  Text,
  Button,
  VStack,
  HStack,
  Card,
  CardBody,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  useToast,
  Input,
  InputGroup,
  InputRightElement,
  IconButton,
  Tooltip,
} from "@chakra-ui/react";
import { FaBitcoin, FaHammer, FaCopy, FaSync } from "react-icons/fa";
import blockchainApi from "../services/blockchainApi";
import NodeSelector from "../components/NodeSelector";

const Dashboard = () => {
  const [chain, setChain] = useState(null);
  const [nodeId, setNodeId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const toast = useToast();

  const fetchChain = async () => {
    try {
      const data = await blockchainApi.getChain();
      setChain(data);
      setError(null);
    } catch (error) {
      console.error("Chain fetch error:", error);
      setError("Failed to fetch blockchain data");
      toast({
        title: "Error fetching chain",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const fetchNodeId = async () => {
    try {
      const data = await blockchainApi.getNodeId();
      setNodeId(data.node_id);
      setError(null);
    } catch (error) {
      console.error("Node ID fetch error:", error);
      setError("Failed to fetch node ID");
      toast({
        title: "Error fetching node ID",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const fetchData = async () => {
    setIsLoading(true);
    await Promise.all([fetchChain(), fetchNodeId()]);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleMine = async () => {
    setIsLoading(true);
    try {
      await blockchainApi.mineBlock();
      await fetchChain();
      toast({
        title: "Block mined successfully",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Error mining block",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
    setIsLoading(false);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(nodeId);
    toast({
      title: "Node ID copied to clipboard",
      status: "success",
      duration: 2000,
      isClosable: true,
    });
  };

  const handleNodeChange = () => {
    // Refresh data when node changes
    fetchData();
  };

  if (error) {
    return (
      <VStack spacing={4} align="center" justify="center" h="100vh">
        <Text color="red.500">{error}</Text>
        <Button
          leftIcon={<FaSync />}
          colorScheme="orange"
          onClick={fetchData}
          isLoading={isLoading}
        >
          Retry
        </Button>
      </VStack>
    );
  }

  if (!chain) {
    return (
      <VStack spacing={4} align="center" justify="center" h="100vh">
        <Text>Loading...</Text>
      </VStack>
    );
  }

  return (
    <VStack spacing={8} align="stretch">
      <HStack justify="space-between">
        <Heading>Blockchain Overview</Heading>
        <Button
          leftIcon={<FaHammer />}
          colorScheme="orange"
          onClick={handleMine}
          isLoading={isLoading}
        >
          Mine Block
        </Button>
      </HStack>

      <NodeSelector onNodeChange={handleNodeChange} />

      <Card bg="gray.800">
        <CardBody>
          <VStack align="stretch" spacing={4}>
            <Heading size="md">Your Node ID</Heading>
            <Text>
              This is your unique identifier. Share it with others to receive
              transactions.
            </Text>
            <InputGroup>
              <Input
                value={nodeId}
                isReadOnly
                bg="gray.700"
                borderColor="gray.600"
                _hover={{ borderColor: "orange.400" }}
                _focus={{ borderColor: "orange.400" }}
              />
              <InputRightElement>
                <Tooltip label="Copy to clipboard">
                  <IconButton
                    aria-label="Copy node ID"
                    icon={<FaCopy />}
                    onClick={copyToClipboard}
                    variant="ghost"
                    colorScheme="orange"
                  />
                </Tooltip>
              </InputRightElement>
            </InputGroup>
          </VStack>
        </CardBody>
      </Card>

      <HStack spacing={4}>
        <Card flex={1} bg="gray.800">
          <CardBody>
            <Stat>
              <StatLabel>Total Blocks</StatLabel>
              <StatNumber>{chain.length}</StatNumber>
              <StatHelpText>Current blockchain length</StatHelpText>
            </Stat>
          </CardBody>
        </Card>

        <Card flex={1} bg="gray.800">
          <CardBody>
            <Stat>
              <StatLabel>Latest Block</StatLabel>
              <StatNumber>
                {chain.chain[chain.chain.length - 1].index}
              </StatNumber>
              <StatHelpText>Most recent block index</StatHelpText>
            </Stat>
          </CardBody>
        </Card>
      </HStack>

      <Box>
        <Heading size="md" mb={4}>
          Latest Block Details
        </Heading>
        <Card bg="gray.800">
          <CardBody>
            <VStack align="stretch" spacing={2}>
              <HStack justify="space-between">
                <Text>Index:</Text>
                <Text>{chain.chain[chain.chain.length - 1].index}</Text>
              </HStack>
              <HStack justify="space-between">
                <Text>Timestamp:</Text>
                <Text>
                  {new Date(
                    chain.chain[chain.chain.length - 1].timestamp * 1000
                  ).toLocaleString()}
                </Text>
              </HStack>
              <HStack justify="space-between">
                <Text>Proof:</Text>
                <Text>{chain.chain[chain.chain.length - 1].proof}</Text>
              </HStack>
              <HStack justify="space-between">
                <Text>Previous Hash:</Text>
                <Text fontSize="sm" color="gray.400" maxW="200px" isTruncated>
                  {chain.chain[chain.chain.length - 1].prev_hash}
                </Text>
              </HStack>
              <Box>
                <Text mb={2}>Transactions:</Text>
                {chain.chain[chain.chain.length - 1].transactions.map(
                  (tx, index) => (
                    <Card key={index} bg="gray.700" mb={2}>
                      <CardBody>
                        <VStack align="stretch" spacing={1}>
                          <HStack justify="space-between">
                            <Text>From:</Text>
                            <Text>{tx.sender}</Text>
                          </HStack>
                          <HStack justify="space-between">
                            <Text>To:</Text>
                            <Text>{tx.recipient}</Text>
                          </HStack>
                          <HStack justify="space-between">
                            <Text>Amount:</Text>
                            <Text>
                              {tx.amount} <FaBitcoin color="#F7931A" />
                            </Text>
                          </HStack>
                        </VStack>
                      </CardBody>
                    </Card>
                  )
                )}
              </Box>
            </VStack>
          </CardBody>
        </Card>
      </Box>
    </VStack>
  );
};

export default Dashboard;
