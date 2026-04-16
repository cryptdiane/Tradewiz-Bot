from telegram.ext import Application
from handlers.start import start_handler
from handlers.trade import trade_handler
from handlers.wallet import wallet_handler
from handlers.copytrade import copytrade_handler
import os
from dotenv import load_dotenv

load_dotenv()

app = Application.builder().token(os.getenv("8206968517:AAHerhIyr6ThZDFItFRwMsS8StIqS3itdpg")).build()

app.add_handler(start_handler)
app.add_handler(trade_handler)
app.add_handler(wallet_handler)
app.add_handler(copytrade_handler)

print("Bot running...")
app.run_polling()