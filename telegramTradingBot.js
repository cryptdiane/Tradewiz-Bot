solana-telegram-bot/
│
├── bot/
│   ├── main.py
│   ├── handlers/
│   │   ├── start.py
│   │   ├── trade.py
│   │   ├── wallet.py
│   │   └── copytrade.py
│   │
│   ├── keyboards/
│   │   └── menu.py
│   │
│   └── utils/
│       ├── solana.py
│       ├── jupiter.py
│       ├── wallet.py
│       └── config.py
│
├── services/
│   ├── copy_trader.py
│   ├── sniper.py
│   └── price_tracker.py
│
├── database/
│   ├── models.py
│   └── db.py
│
├── requirements.txt
└── .env