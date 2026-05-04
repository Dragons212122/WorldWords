CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price NUMERIC(10, 2) NOT NULL
);

INSERT INTO products (name, description, price) VALUES
('Wireless Mouse', 'A comfortable and precise wireless mouse.', 25.99),
('Mechanical Keyboard', 'RGB mechanical keyboard with clicky switches.', 79.50),
('Monitor Stand', 'Adjustable aluminum monitor stand.', 35.00);