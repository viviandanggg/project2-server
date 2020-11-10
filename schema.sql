DROP TABLE IF EXISTS budget;

CREATE TABLE budget (
  id SERIAL PRIMARY KEY,
  amount DOUBLE,
  category VARCHAR(45),
  description TEXT,
  year INT,
  month INT,
  day INT,
  increase INT DEFAULT 0,
  is_deleted INT DEFAULT 0
);
