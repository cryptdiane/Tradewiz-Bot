from telegram import Update
from telegram.ext import CommandHandler, ContextTypes
from keyboards.menu import main_menu

async def start(update: Update, context: ContextTypes.DEFAULT_TYPE):
    await update.message.reply_text(
        "🚀 Welcome to Solana Trading Bot\n\nSelect option:",
        reply_markup=main_menu()
    )

start_handler = CommandHandler("start", start)