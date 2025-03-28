import json
import hashlib
from time import time
from uuid import uuid4
from flask import Flask, jsonify, request
from flask_cors import CORS
import requests
from urllib.parse import urlparse
from argparse import ArgumentParser

"""
 A blockchain is an immutable, sequential chain of records called Blocks
 Chained together through hashes
 
"""


class Blockchain:
    """Blockchain object

    Args:
        object (_type_): _description_
    """

    def __init__(self):
        self.chain = []
        self.current_transaction = []
        self.nodes = set()  # Initialize empty set of nodes
        # starting block
        self.new_block(proof=100, prev_hash=1)

    # create and add a new block to the chain
    def new_block(self, proof, prev_hash):
        # Store current nodes before creating new block
        current_nodes = self.nodes

        block = {
            "index": len(self.chain) + 1,
            "timestamp": time(),
            "proof": proof,
            "prev_hash": prev_hash or self.hash(self.chain[-1]),
            "transactions": self.current_transaction,
        }
        self.current_transaction = []
        self.chain.append(block)

        # Restore nodes after creating new block
        self.nodes = current_nodes

        return block

    # create and add a new transaction to the list of transactions
    def new_transaction(self, sender, recipient, amount):
        self.current_transaction.append(
            {
                "sender": sender,
                "recipient": recipient,
                "amount": amount,
            }
        )

        return self.last_block["index"] + 1

    # returns the last block in the chain
    @property
    def last_block(self):
        return self.chain[-1]

    # hashes a block using sha256 hashing
    @staticmethod
    def hash(block):

        block_string = json.dumps(block, sort_keys=True).encode()
        return hashlib.sha256(block_string).hexdigest()

    def proof_of_work(self, last_proof):

        proof = 0

        while self.valid_proof(last_proof, proof) is False:
            proof += 1
        return proof

    def valid_proof(self, prev_proof, proof):

        guess = f"{prev_proof}{proof}".encode()
        guess_hash = hashlib.sha256(guess).hexdigest()
        return guess_hash[:5] == "11111"

    def register_node(self, address):
        parsed_url = urlparse(address)
        # netloc is to get the domain/subdomain of user with port
        # adds to set so that there is unique node (if added again, only 1 instance in set)
        self.nodes.add(parsed_url.netloc)

    # check the chain to make sure it is valid
    # pretty much just check the last hash is the same as the current block prev hash
    def valid_chain(self, chain):
        """
        Determine if a given blockchain is valid
        """
        last_block = chain[0]
        current_index = 1

        while current_index < len(chain):  # Changed from len(self.chain) to len(chain)
            block = chain[current_index]

            # Check that the hash of the block is correct
            if block["prev_hash"] != self.hash(
                last_block
            ):  # Changed from "previous_hash" to "prev_hash"
                return False

            last_block = block
            current_index += 1

        return True

    # consensus algo to keep all the chains the same
    # check the nodes to see which one has the longest and set that as the chain
    def resolve_conflicts(self):
        """
        Consensus algorithm: resolve conflicts by replacing our chain with
        the longest valid chain in the network
        """
        neighbors = self.nodes
        new_chain = None
        # We're only looking for chains longer than ours
        max_length = len(self.chain)  # Changed from len(self.nodes) to len(self.chain)

        # Grab and verify the chains from all the nodes in our network
        for node in neighbors:
            try:
                response = requests.get(f"http://{node}/chain")
                if response.status_code == 200:
                    length = response.json()["length"]
                    chain = response.json()["chain"]

                    # Check if the length is longer and the chain is valid
                    if length > max_length and self.valid_chain(chain):
                        max_length = length
                        new_chain = chain
            except requests.RequestException as e:
                print(f"Error connecting to node {node}: {str(e)}")
                continue

        # Replace our chain if we discovered a new, valid chain longer than ours
        if new_chain:
            self.chain = new_chain
            return True

        return False


app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

node = str(uuid4()).replace("-", "")

blockchain = Blockchain()
print(blockchain.chain)


@app.route("/mine", methods=["GET"])
def mine():
    last_block = blockchain.last_block
    last_proof = last_block["proof"]
    proof = blockchain.proof_of_work(last_proof)

    blockchain.new_transaction(sender="0", recipient=node, amount=1)
    prev_hash = blockchain.hash(last_block)
    block = blockchain.new_block(proof, prev_hash)
    response = {
        "message": "new block formed",
        "index": block["index"],
        "transactions": block["transactions"],
        "proof": block["proof"],
        "prev_hash": block["prev_hash"],
    }
    return jsonify(response), 200


@app.route("/transaction/new", methods=["POST"])
def new_transation():
    values = request.get_json()

    required_data = ["sender", "recipient", "amount"]
    if not all(data in values for data in required_data):
        return "Missing values", 400

    index = blockchain.new_transaction(
        values["sender"], values["recipient"], values["amount"]
    )
    response = {"message": f"Transaction is added to Block {index}"}
    return jsonify(response), 201


@app.route("/chain", methods=["GET"])
def full_chain():
    response = {"chain": blockchain.chain, "length": len(blockchain.chain)}

    return jsonify(response), 200


@app.route("/nodes/register", methods=["POST"])
def register_nodes():
    values = request.get_json()

    nodes = values.get("nodes")
    if nodes is None:
        return "Error: Please supply a valid list of nodes", 400

    for node in nodes:
        blockchain.register_node(node)

    response = {
        "message": "New nodes have been added",
        "total_nodes": list(blockchain.nodes),
    }
    return jsonify(response), 201


@app.route("/nodes/resolve", methods=["GET"])
def consensus():
    print("Starting consensus resolution...")  # Debug log
    replaced = blockchain.resolve_conflicts()

    if replaced:
        response = {"message": "Our chain was replaced", "new_chain": blockchain.chain}
    else:
        response = {"message": "Our chain is authoritative", "chain": blockchain.chain}

    print(f"Consensus resolution complete: {response['message']}")  # Debug log
    return jsonify(response), 200


@app.route("/node-id", methods=["GET"])
def get_node_id():
    response = {"node_id": node}
    return jsonify(response), 200


@app.route("/nodes", methods=["GET"])
def get_nodes():
    response = {"total_nodes": list(blockchain.nodes), "current_node": request.host_url}
    return jsonify(response), 200


if __name__ == "__main__":
    parser = ArgumentParser()
    parser.add_argument(
        "-p", "--port", default=5000, type=int, help="port to listen on"
    )
    args = parser.parse_args()

    # Print which port we're using
    print(f"Starting blockchain node on port {args.port}")

    app.run(host="0.0.0.0", port=args.port)
