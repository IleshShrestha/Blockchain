import axios from "axios";

// Default node configuration
const DEFAULT_NODES = [{ url: "http://localhost:5000", name: "Node 1" }];

let currentApiUrl = "http://localhost:5000";

const blockchainApi = {
  // Get the full blockchain
  getChain: async () => {
    try {
      const response = await axios.get(`${currentApiUrl}/chain`);
      return response.data;
    } catch (error) {
      console.error("Error fetching chain:", error);
      throw error;
    }
  },

  // Get the current node ID
  getNodeId: async () => {
    try {
      console.log("Fetching node ID from:", `${currentApiUrl}/node-id`);
      const response = await axios.get(`${currentApiUrl}/node-id`);
      console.log("Node ID response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching node ID:", error.response || error);
      throw error;
    }
  },

  // Mine a new block
  mineBlock: async () => {
    try {
      const response = await axios.get(`${currentApiUrl}/mine`);
      return response.data;
    } catch (error) {
      console.error("Error mining block:", error);
      throw error;
    }
  },

  // Create a new transaction
  createTransaction: async (sender, recipient, amount) => {
    try {
      const response = await axios.post(`${currentApiUrl}/transaction/new`, {
        sender,
        recipient,
        amount,
      });
      return response.data;
    } catch (error) {
      console.error("Error creating transaction:", error);
      throw error;
    }
  },

  // Register new nodes
  registerNodes: async (nodes) => {
    try {
      const response = await axios.post(`${currentApiUrl}/nodes/register`, {
        nodes,
      });
      return response.data;
    } catch (error) {
      console.error("Error registering nodes:", error);
      throw error;
    }
  },

  // Resolve conflicts
  resolveConflicts: async () => {
    console.log(`Sending resolve request to: ${currentApiUrl}/nodes/resolve`);
    try {
      const response = await axios.get(`${currentApiUrl}/nodes/resolve`, {
        timeout: 10000, // 10 second timeout
      });
      console.log("Resolve response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Resolve error details:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      throw new Error(
        error.response?.data?.message ||
          error.message ||
          "Failed to resolve conflicts"
      );
    }
  },

  // Set base URL
  setBaseUrl: (url) => {
    currentApiUrl = url;
  },

  // Get registered nodes
  getRegisteredNodes: async () => {
    try {
      const response = await axios.get(`${currentApiUrl}/nodes`);
      return response.data.total_nodes;
    } catch (error) {
      console.error("Error fetching registered nodes:", error);
      throw error;
    }
  },
};

export default blockchainApi;
export const availableNodes = DEFAULT_NODES;
