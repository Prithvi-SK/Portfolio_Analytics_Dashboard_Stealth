
-- We're using the default postgres database, so no need to create a new database

-- Create tables if they don't exist
CREATE TABLE IF NOT EXISTS holdings (
    id SERIAL PRIMARY KEY,
    symbol VARCHAR(255),
    company_name VARCHAR(255),
    quantity INTEGER,
    avg_price DECIMAL(10,2),
    current_price DECIMAL(10,2),
    sector VARCHAR(255),
    market_cap VARCHAR(255),
    exchange VARCHAR(255),
    value DECIMAL(10,2),
    gain_loss DECIMAL(10,2),
    gain_loss_percent DECIMAL(10,2)
);

CREATE TABLE IF NOT EXISTS historical_performance (
    id SERIAL PRIMARY KEY,
    date DATE,
    portfolio_value DECIMAL(10,2),
    nifty_50 DECIMAL(10,2),
    gold DECIMAL(10,2),
    portfolio_return DECIMAL(10,2),
    nifty_50_return DECIMAL(10,2),
    gold_return DECIMAL(10,2)
); 