from telegram.ext import MessageHandler, filters
from utils.jupiter import buy_token, sell_token

async def trade(update, context):
    text = update.message.text

    if text == "💰 Buy Token":
        await update.message.reply_text("Send token address:")
        context.user_data["action"] = "buy"

    elif text == "💸 Sell Token":
        await update.message.reply_text("Send token address:")
        context.user_data["action"] = "sell"

    elif "action" in context.user_data:
        token = text
        action = context.user_data["action"]

        if action == "buy":
            tx = buy_token(token, amount=0.1)
        else:
            tx = sell_token(token)

        await update.message.reply_text(f"✅ TX Sent:\n{tx}")

trade_handler = MessageHandler(filters.TEXT & ~filters.COMMAND, trade)