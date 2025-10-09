-- 1) Criar e usar o banco
CREATE DATABASE IF NOT EXISTS teste_api;
USE teste_api;

-- 2) Criar tabela users
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 3) Dados iniciais
INSERT INTO users (name, email) VALUES
('Alice', 'alice@example.com'),
('Bob', 'bob@example.com'),
('Joao', 'joao@example.com');

-- 4) Criar tabela pets
CREATE TABLE IF NOT EXISTS pets (
    id INT AUTO_INCREMENT PRIMARY KEY,
    namePet VARCHAR(100) NOT NULL,
    user_id INT NULL,  -- Permite NULL
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL -- Caso o usuario seja deletado o pet não sera apagado junto, 
);                                                                -- pois um pet pode não ter dono

-- 5) Dados iniciais para os pets
INSERT INTO pets (namePet, user_id) VALUES
('Rex', 1),
('Zeus', 4),
('Luna', NULL);