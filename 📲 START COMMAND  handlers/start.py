from telegram import Update
from telegram.ext import CommandHandler, ContextTypes
from keyboards.menu import main_menu

async def start(update: Update, context: ContextTypes.DEFAULT_TYPE):
    await update.message.reply_text(
        "🧙‍♀️Tradewiz: Trade Fast⚡️,Trade Smart 🔫

💰 SOL Price: $85.24

💳 Your First Wallet
    ↳ 7W4yDiYuCeZgYwzngg9EdsQjXmaRA5dm6ZnfRjwDduXH 🅴
    ↳ Balance:  0 SOL
\n\nSelect option:",
        reply_markup=main_menu()
    )

start_handler = CommandHandler("start", start)