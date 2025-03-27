# Blockchain Network Project

A decentralized blockchain network implementation with a modern web interface. This project consists of a Python-based blockchain backend and a React-based frontend explorer.

## Project Overview

This project implements a basic blockchain network with the following features:

- Proof of Work consensus mechanism
- Transaction management
- Node registration and discovery
- Chain synchronization across nodes
- Modern web interface for blockchain exploration

## Prerequisites

### Backend Requirements

- Python 3.8 or higher
- pip (Python package manager)
- Virtual environment (recommended)

### Frontend Requirements

- Node.js (v14 or higher)
- npm or yarn package manager

## Installation

### 1. Backend Setup

1. Create and activate a virtual environment:

```bash
python -m venv blockchainVenv
source blockchainVenv/bin/activate  # On Windows: blockchainVenv\Scripts\activate
```

2. Install dependencies:

```bash
pip install -r requirements.txt
```

3. Run the blockchain node:

```bash
python Blockchain.py --port 5000  # For first node
python Blockchain.py --port 5001  # For second node
```

### 2. Frontend Setup

1. Navigate to the frontend directory:

```bash
cd blockchain-frontend
```

2. Install dependencies:

```bash
npm install
# or
yarn install
```

3. Start the development server:

```bash
npm run dev
# or
yarn dev
```

The frontend will be available at `http://localhost:5173`

## API Endpoints

The blockchain backend provides the following REST API endpoints:

- `GET /chain` - Get the full blockchain
- `GET /mine` - Mine a new block
- `POST /transaction/new` - Create a new transaction
- `POST /nodes/register` - Register a new node
- `GET /nodes/resolve` - Resolve conflicts between nodes
- `GET /node-id` - Get the current node's ID
- `GET /nodes` - Get list of registered nodes

## Features

### Backend Features

- Proof of Work consensus mechanism
- Transaction management
- Node registration and discovery
- Chain synchronization
- Conflict resolution
- RESTful API

### Frontend Features

- Real-time blockchain visualization
- Transaction creation and management
- Node management and monitoring
- Chain synchronization controls
- Modern, responsive UI

## Running Multiple Nodes

To run multiple nodes on your local machine:

1. Start the first node:

```bash
python Blockchain.py --port 5000
```

2. Start the second node:

```bash
python Blockchain.py --port 5001
```

3. Register nodes with each other using the frontend interface

## Development

### Backend Development

- The core blockchain implementation is in `Blockchain.py`
- API endpoints are defined using Flask
- CORS is enabled for frontend communication

### Frontend Development

- Built with React and Vite
- Uses Chakra UI for components
- Implements real-time updates and node synchronization
