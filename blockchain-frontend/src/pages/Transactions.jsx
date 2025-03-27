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
} from "@chakra-ui/react";
import { FaBitcoin } from "react-icons/fa";
import blockchainApi from "../services/blockchainApi";

const Transactions = () => {
  const [formData, setFormData] = useState({
    sender: "",
    recipient: "",
    amount: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await blockchainApi.createTransaction(
        formData.sender,
        formData.recipient,
        parseFloat(formData.amount)
      );
      toast({
        title: "Transaction created successfully",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      setFormData({ sender: "", recipient: "", amount: "" });
    } catch (error) {
      toast({
        title: "Error creating transaction",
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
      <Heading>Create New Transaction</Heading>

      <Card bg="gray.800">
        <CardBody>
          <form onSubmit={handleSubmit}>
            <VStack spacing={4}>
              <FormControl isRequired>
                <FormLabel>Sender</FormLabel>
                <Input
                  name="sender"
                  value={formData.sender}
                  onChange={handleChange}
                  placeholder="Enter sender address"
                  bg="gray.700"
                  borderColor="gray.600"
                  _hover={{ borderColor: "orange.400" }}
                  _focus={{ borderColor: "orange.400" }}
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Recipient</FormLabel>
                <Input
                  name="recipient"
                  value={formData.recipient}
                  onChange={handleChange}
                  placeholder="Enter recipient address"
                  bg="gray.700"
                  borderColor="gray.600"
                  _hover={{ borderColor: "orange.400" }}
                  _focus={{ borderColor: "orange.400" }}
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Amount</FormLabel>
                <Input
                  name="amount"
                  type="number"
                  value={formData.amount}
                  onChange={handleChange}
                  placeholder="Enter amount"
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
                Create Transaction
              </Button>
            </VStack>
          </form>
        </CardBody>
      </Card>

      <Box>
        <Heading size="md" mb={4}>
          Transaction Information
        </Heading>
        <Card bg="gray.800">
          <CardBody>
            <VStack align="stretch" spacing={4}>
              <Text>
                To create a new transaction, fill in the form above with the
                following information:
              </Text>
              <VStack align="stretch" spacing={2}>
                <HStack>
                  <Icon as={FaBitcoin} color="orange.400" />
                  <Text>Sender: The address of the sender</Text>
                </HStack>
                <HStack>
                  <Icon as={FaBitcoin} color="orange.400" />
                  <Text>Recipient: The address of the recipient</Text>
                </HStack>
                <HStack>
                  <Icon as={FaBitcoin} color="orange.400" />
                  <Text>Amount: The amount to transfer</Text>
                </HStack>
              </VStack>
              <Text mt={4}>
                After creating a transaction, you'll need to mine a new block to
                include it in the blockchain.
              </Text>
            </VStack>
          </CardBody>
        </Card>
      </Box>
    </VStack>
  );
};

export default Transactions;
