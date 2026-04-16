from solana.rpc.api import Client
import os

client = Client(os.getenv("RPC_URL"))

def get_balance(pubkey):
    balance = client.get_balance(pubkey)
    return balance['result']['value'] / 1e9