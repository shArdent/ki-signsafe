
DROP TABLE IF EXISTS history;
DROP TABLE IF EXISTS users;

CREATE TABLE users (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    balance NUMERIC(12, 2) DEFAULT 0.00,
    public_key TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE history (
    id SERIAL PRIMARY KEY,
    user_id TEXT NOT NULL,
    to_user_id TEXT,
    type TEXT CHECK (type IN ('topup', 'transfer', 'receive')) NOT NULL,
    amount NUMERIC(12, 2) NOT NULL CHECK (amount > 0),
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    nonce TEXT NOT NULL,
    signature TEXT NOT NULL,
    balance_after NUMERIC(12, 2) NOT NULL,

    CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(id)
        ON DELETE CASCADE
);


