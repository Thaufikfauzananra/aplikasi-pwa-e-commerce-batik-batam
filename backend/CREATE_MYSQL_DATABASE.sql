-- Script untuk membuat database MySQL
-- Jalankan script ini di MySQL (phpMyAdmin, MySQL Workbench, atau mysql CLI)

-- Buat database
CREATE DATABASE IF NOT EXISTS batik_cindur_batam 
    CHARACTER SET utf8mb4 
    COLLATE utf8mb4_unicode_ci;

-- Gunakan database
USE batik_cindur_batam;

-- Info: Tabel akan dibuat otomatis saat menjalankan:
-- php artisan migrate

-- Untuk melihat daftar database:
-- SHOW DATABASES;

-- Untuk melihat tabel yang sudah dibuat:
-- SHOW TABLES;

