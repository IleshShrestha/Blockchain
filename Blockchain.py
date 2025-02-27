import json
import hashlib
from time import time
from uuid import uuid4
from flask import Flask
import jsonify

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

        # starting block
        self.new_block(proof=100, prev_hash=None)

        # create and add a new block to the chain
        def new_block(self, proof, prev_hash):

            block = {
                "index": len(self.chain) + 1,
                "timestamp": time(),
                "proof": proof,
                "prev_hash": prev_hash or self.hash(self.chain[-1]),
            }
            self.current_transaction = []

            return None

        # create and add a new transaction to the list of transactions
        def new_transactions(self, sender, recipient, amount):
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
            return hashlib.sha256(block_string).encode()

        def proof_of_work(self, last_proof):

            proof = 0

            while self.valid_proof(last_proof, proof) is False:
                proof += 1
            return proof

        def valid_proof(self, prev_proof, proof):

            guess = f"{prev_proof}{proof}".encode()
            guess_hash = hashlib.sha256(guess).hexdigest()
            return guess_hash[:5] == "11111"


app = Flask(__name__)

node = str(uuid4()).replace("-", "")

blockchain = Blockchain()


@app.route("/mine", methods=["GET"])
def mine():
    return "mining a new block"


@app.route("/transaction/new", methods=["POST"])
def new_transation():
    return "adding a new transaction"


@app.route("/chain", methods=["GET"])
def full_chain():
    response = {"chain": blockchain.chain, "length": len(blockchain.chain)}

    return jsonify(response), 200


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
