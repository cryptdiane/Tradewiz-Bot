from telegram import ReplyKeyboardMarkup

def main_menu():
    keyboard = [
        ["💰 Buy Token", "💸 Sell Token"],
        ["👛 Wallet", "📈 Copy Trade"],
        ["⭐️Watchlist", "🎯Snipe"]
        
    return ReplyKeyboardMarkup(keyboard, resize_keyboard=True)