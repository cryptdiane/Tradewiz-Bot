import requests

RPC = "https://quote-api.jup.ag/v6"

def buy_token(token_address, amount):
    url = f"{RPC}/quote"
    params = {
        "inputMint": "So11111111111111111111111111111111111111112",
        "outputMint": token_address,
        "amount": int(amount * 1e9),
        "slippageBps": 50
    }

    res = requests.get(url, params=params).json()
    return res

def sell_token(token_address):
    return "Sell TX placeholder"