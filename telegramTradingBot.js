// telegramTradingBot.js

require('dotenv').config();
const TelegramBot = require('telegram-bot-api');
const logger = require('./logger'); // Assume a logger module exists

// Configuration from environment variables
const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const API_BASE_URL = process.env.API_BASE_URL || 'https://api.solscan.io';

// Validate required environment variables
if (!BOT_TOKEN) {8206968517:AAHVRRczvdCdFtdWdq86Kik07K5JWdKSKv4
    throw new Error('TELEGRAM_BOT_TOKEN environment variable is not set');
}

// Create a new Telegram bot instance
const bot = new TelegramBot({
    token: BOT_TOKEN,
});

// API Endpoints
const API_ENDPOINTS = {
    buy: '/buy-some-endpoint',
    sell: '/sell-some-endpoint',
    price: '/price-endpoint',
    balance: '/balance-endpoint',
};

/**
 * Validate token symbol input
 * @param {string} symbol - Token symbol to validate
 * @returns {boolean} - True if valid, false otherwise
 */
function isValidTokenSymbol(symbol) {
    // Basic validation: alphanumeric and common crypto symbols
    return /^[a-zA-Z0-9\-_]{1,20}$/.test(symbol);
}

/**
 * Perform a trading operation with retry logic
 * @param {string} operation - Type of operation (buy, sell, price, balance)
 * @param {string} tokenSymbol - Token symbol
 * @param {number} retries - Number of retries (default: 3)
 * @returns {Promise<Object>} - API response
 */
async function performTradingOperation(operation, tokenSymbol, retries = 3) {
    const endpoint = API_ENDPOINTS[operation];
    if (!endpoint) {
        throw new Error(`Unknown operation: ${operation}`);
    }

    const url = `${API_BASE_URL}${endpoint}`;
    
    for (let attempt = 0; attempt < retries; attempt++) {
        try {
            logger.info(`Attempting ${operation} for ${tokenSymbol} (attempt ${attempt + 1}/${retries})`);
            
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ symbol: tokenSymbol }),
            });

            if (!response.ok) {
                throw new Error(`API returned status ${response.status}`);
            }

            const data = await response.json();
            logger.info(`${operation} successful for ${tokenSymbol}`);
            return data;
        } catch (error) {
            logger.warn(`Attempt ${attempt + 1} failed: ${error.message}`);
            
            if (attempt < retries - 1) {
                // Exponential backoff: 1s, 2s, 4s
                const delayMs = Math.pow(2, attempt) * 1000;
                await new Promise(resolve => setTimeout(resolve, delayMs));
            } else {
                throw error;
            }
        }
    }
}

/**
 * Handle /buy command
 * @param {Object} msg - Telegram message object
 * @param {Array} match - Regex match array
 */
async function handleBuyCommand(msg, match) {
    const chatId = msg.chat.id;
    const tokenSymbol = match[1].trim();

    if (!isValidTokenSymbol(tokenSymbol)) {
        bot.sendMessage(chatId, '❌ Invalid token symbol. Please use alphanumeric characters only.');
        return;
    }

    bot.sendMessage(chatId, `🛒 Buying ${tokenSymbol}...`);

    try {
        const result = await performTradingOperation('buy', tokenSymbol);
        bot.sendMessage(chatId, `✅ Successfully bought ${tokenSymbol}!
Transaction: ${result.transactionId || 'N/A'}`);
    } catch (error) {
        logger.error(`Buy operation failed: ${error.message}`);
        bot.sendMessage(chatId, `❌ Error buying ${tokenSymbol}: ${error.message}`);
    }
}

/**
 * Handle /sell command
 * @param {Object} msg - Telegram message object
 * @param {Array} match - Regex match array
 */
async function handleSellCommand(msg, match) {
    const chatId = msg.chat.id;
    const tokenSymbol = match[1].trim();

    if (!isValidTokenSymbol(tokenSymbol)) {
        bot.sendMessage(chatId, '❌ Invalid token symbol. Please use alphanumeric characters only.');
        return;
    }

    bot.sendMessage(chatId, `📤 Selling ${tokenSymbol}...`);

    try {
        const result = await performTradingOperation('sell', tokenSymbol);
        bot.sendMessage(chatId, `✅ Successfully sold ${tokenSymbol}!
Transaction: ${result.transactionId || 'N/A'}`);
    } catch (error) {
        logger.error(`Sell operation failed: ${error.message}`);
        bot.sendMessage(chatId, `❌ Error selling ${tokenSymbol}: ${error.message}`);
    }
}

/**
 * Handle /price command
 * @param {Object} msg - Telegram message object
 * @param {Array} match - Regex match array
 */
async function handlePriceCommand(msg, match) {
    const chatId = msg.chat.id;
    const tokenSymbol = match[1].trim();

    if (!isValidTokenSymbol(tokenSymbol)) {
        bot.sendMessage(chatId, '❌ Invalid token symbol. Please use alphanumeric characters only.');
        return;
    }

    bot.sendMessage(chatId, `💰 Fetching price for ${tokenSymbol}...`);

    try {
        const result = await performTradingOperation('price', tokenSymbol);
        bot.sendMessage(chatId, `📊 ${tokenSymbol} Price: $${result.price || 'N/A'}`);
    } catch (error) {
        logger.error(`Price fetch failed: ${error.message}`);
        bot.sendMessage(chatId, `❌ Error fetching price for ${tokenSymbol}: ${error.message}`);
    }
}

/**
 * Handle /balance command
 * @param {Object} msg - Telegram message object
 */
async function handleBalanceCommand(msg) {
    const chatId = msg.chat.id;

    bot.sendMessage(chatId, `💼 Fetching balance...`);

    try {
        const result = await performTradingOperation('balance', 'all');
        bot.sendMessage(chatId, `💵 Your balance: $${result.totalBalance || 'N/A'}`);
    } catch (error) {
        logger.error(`Balance fetch failed: ${error.message}`);
        bot.sendMessage(chatId, `❌ Error fetching balance: ${error.message}`);
    }
}

/**
 * Handle /help command
 * @param {Object} msg - Telegram message object
 */
function handleHelpCommand(msg) {
    const chatId = msg.chat.id;
    const helpText = `
🤖 Trading Bot Commands:
/buy <symbol> - Buy a token
/sell <symbol> - Sell a token
/price <symbol> - Get token price
/balance - Check your balance
/help - Show this message
    `;
    bot.sendMessage(chatId, helpText);
}

// Command handlers map
const commandHandlers = {
    buy: handleBuyCommand,
    sell: handleSellCommand,
    price: handlePriceCommand,
    balance: handleBalanceCommand,
    help: handleHelpCommand,
};

// Register command handlers
bot.onText(/\/buy (.+)/, handleBuyCommand);
bot.onText(/\/sell (.+)/, handleSellCommand);
bot.onText(/\/price (.+)/, handlePriceCommand);
bot.onText(/\/balance/, handleBalanceCommand);
bot.onText(/\/help/, handleHelpCommand);

// Handle /start command
bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, '👋 Welcome to Trading Bot! Type /help for available commands.');
});

// Error handler for unhandled errors
bot.on('error', (error) => {
    logger.error(`Bot error: ${error.message}`);
});

// Graceful shutdown
process.on('SIGINT', () => {
    logger.info('Bot shutting down gracefully...');
    bot.stopPolling();
    process.exit(0);
});

bot.startPolling();
logger.info('Trading bot started successfully!');