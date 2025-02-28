import json
import hashlib
from time import time
from uuid import uuid4
from flask import Flask, jsonify, request

"""
 A blockchain is an immutable, sequential chain of records called Blocks
 Chained together through hashes
 
"""


class Blockchain:
    """Blockchain object

    Args:
        object (_type_): _description_
    """

    # create and add a new block to the chain
    def new_block(self, proof, prev_hash):

        block = {
            "index": len(self.chain) + 1,
            "timestamp": time(),
            "proof": proof,
            "prev_hash": prev_hash or self.hash(self.chain[-1]),
            "transactions": self.current_transaction,
        }
        self.current_transaction = []
        self.chain.append(block)
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

        # changed to jsonify

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

    def __init__(self):

        self.chain = []
        self.current_transaction = []
        # starting block
        self.new_block(proof=100, prev_hash=1)


app = Flask(__name__)

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
    return json.response, 201


@app.route("/chain", methods=["GET"])
def full_chain():
    response = {"chain": blockchain.chain, "length": len(blockchain.chain)}

    return jsonify(response), 200


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
