-- Initial schema + seed data for 工蜂办公
-- Run once on a fresh MySQL 8 instance.

CREATE DATABASE IF NOT EXISTS gongfeng
  DEFAULT CHARACTER SET utf8mb4
  DEFAULT COLLATE utf8mb4_unicode_ci;

USE gongfeng;

-- Admin user
CREATE TABLE IF NOT EXISTS users (
  id           INT AUTO_INCREMENT PRIMARY KEY,
  username     VARCHAR(50)  NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role         VARCHAR(20)  NOT NULL DEFAULT 'admin',
  created_at   DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Employee directory
CREATE TABLE IF NOT EXISTS employees (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  name        VARCHAR(20)  NOT NULL,
  age         INT          NOT NULL,
  email       VARCHAR(100) NOT NULL UNIQUE,
  dept        VARCHAR(50),
  title       VARCHAR(50),
  created_at  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT chk_age CHECK (age BETWEEN 18 AND 60)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Device categories
CREATE TABLE IF NOT EXISTS categories (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  name       VARCHAR(20) NOT NULL UNIQUE,
  description VARCHAR(200),
  created_at DATETIME    NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Devices (many-to-one -> categories)
CREATE TABLE IF NOT EXISTS devices (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  name        VARCHAR(100) NOT NULL,
  model       VARCHAR(100),
  status      VARCHAR(20)  NOT NULL DEFAULT '在用',
  assignee    VARCHAR(50),
  category_id INT          NOT NULL,
  created_at  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_devices_category
    FOREIGN KEY (category_id) REFERENCES categories(id)
    ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE INDEX idx_devices_category ON devices(category_id);
CREATE INDEX idx_employees_created ON employees(created_at);

-- Seed admin (password = admin123, bcrypt hashed below).
-- NB: regenerate the hash in production via app/seed.py
INSERT INTO users (username, password_hash, role)
VALUES ('admin', '$2b$12$bX/UxGTZ9oU5vwq3M7l.7uUulPqkE6zj5E5FkCm7PPA5PTcya5oHC', 'admin')
ON DUPLICATE KEY UPDATE username = username;

-- Seed categories
INSERT INTO categories (name, description) VALUES
  ('IT 设备',  '电脑 / 服务器 / 外设'),
  ('办公耗材', '打印纸 / 墨盒 / 文具'),
  ('网络设备', '路由 / 交换机 / AP'),
  ('会议设备', '投影 / 摄像头 / 麦克风'),
  ('安防设备', '门禁 / 监控 / 烟感')
ON DUPLICATE KEY UPDATE name = name;

-- Seed a few employees
INSERT INTO employees (name, age, email, dept, title) VALUES
  ('林婉清', 28, 'lin.wanqing@gongfeng.cn', '人力资源部', 'HRBP'),
  ('陈昊然', 34, 'chen.haoran@gongfeng.cn', '研发中心',   '后端工程师'),
  ('苏梦琪', 26, 'su.mengqi@gongfeng.cn',   '市场部',     '品牌经理')
ON DUPLICATE KEY UPDATE name = name;
