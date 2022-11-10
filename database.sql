CREATE DATABASE purchase_tracking_system;

CREATE TABLE creditcard(
    card_id SERIAL PRIMARY KEY,
    card_number SMALLINT NOT NULL
);

CREATE TABLE transaction(
    transaction_id SERIAL PRIMARY KEY,
    fk_card INT REFERENCES creditcard (card_id) NOT NULL,
    transaction_store VARCHAR(255) NOT NULL,
    transaction_place VARCHAR(255) NOT NULL,
    date_string VARCHAR(255) NOT NULL
);

CREATE TABLE product(
    product_id SERIAL PRIMARY KEY,
    product_name VARCHAR(255) NOT NULL,
    category VARCHAR(255),
    price SMALLINT NOT NULL,
    fk_transaction INT REFERENCES transaction (transaction_id) NOT NULL,
    UNIQUE(fk_transaction)
);
