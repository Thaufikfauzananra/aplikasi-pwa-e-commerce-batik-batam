-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jan 03, 2026 at 10:25 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `batik_cindur_batam`
--

-- --------------------------------------------------------

--
-- Table structure for table `addresses`
--

CREATE TABLE `addresses` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `label` varchar(255) NOT NULL,
  `recipient_name` varchar(255) NOT NULL,
  `recipient_phone` varchar(255) NOT NULL,
  `province` varchar(255) NOT NULL,
  `city` varchar(255) NOT NULL,
  `district` varchar(255) NOT NULL,
  `postal_code` varchar(255) NOT NULL,
  `address` text NOT NULL,
  `is_default` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `addresses`
--

INSERT INTO `addresses` (`id`, `user_id`, `label`, `recipient_name`, `recipient_phone`, `province`, `city`, `district`, `postal_code`, `address`, `is_default`, `created_at`, `updated_at`) VALUES
(1, 2, 'Perum Pemda 1', 'Nabil', '082285693685', 'Kepulauan Riau — Riau Islands', 'KOTA BATAM', 'buliang', '29422', 'Pemda 1 Blok C No 34\nPemda 1 Blok C No 34', 1, '2025-11-18 04:51:13', '2025-11-18 04:51:13');

-- --------------------------------------------------------

--
-- Table structure for table `cache`
--

CREATE TABLE `cache` (
  `key` varchar(255) NOT NULL,
  `value` mediumtext NOT NULL,
  `expiration` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `cache_locks`
--

CREATE TABLE `cache_locks` (
  `key` varchar(255) NOT NULL,
  `owner` varchar(255) NOT NULL,
  `expiration` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `failed_jobs`
--

CREATE TABLE `failed_jobs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `uuid` varchar(255) NOT NULL,
  `connection` text NOT NULL,
  `queue` text NOT NULL,
  `payload` longtext NOT NULL,
  `exception` longtext NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `jobs`
--

CREATE TABLE `jobs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `queue` varchar(255) NOT NULL,
  `payload` longtext NOT NULL,
  `attempts` tinyint(3) UNSIGNED NOT NULL,
  `reserved_at` int(10) UNSIGNED DEFAULT NULL,
  `available_at` int(10) UNSIGNED NOT NULL,
  `created_at` int(10) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `job_batches`
--

CREATE TABLE `job_batches` (
  `id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `total_jobs` int(11) NOT NULL,
  `pending_jobs` int(11) NOT NULL,
  `failed_jobs` int(11) NOT NULL,
  `failed_job_ids` longtext NOT NULL,
  `options` mediumtext DEFAULT NULL,
  `cancelled_at` int(11) DEFAULT NULL,
  `created_at` int(11) NOT NULL,
  `finished_at` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `migrations`
--

CREATE TABLE `migrations` (
  `id` int(10) UNSIGNED NOT NULL,
  `migration` varchar(255) NOT NULL,
  `batch` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `migrations`
--

INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES
(1, '0001_01_01_000000_create_users_table', 1),
(2, '0001_01_01_000001_create_cache_table', 1),
(3, '0001_01_01_000002_create_jobs_table', 1),
(4, '2024_01_01_000000_create_sessions_table', 1),
(5, '2024_01_02_000000_add_role_to_users_table', 1),
(6, '2025_10_22_131854_create_personal_access_tokens_table', 1),
(7, '2025_11_03_122857_create_notifications_table', 1),
(8, '2025_11_03_122922_create_addresses_table', 1),
(9, '2025_11_18_000000_create_products_table', 1),
(10, '2025_12_08_000001_add_size_stocks_to_products_table', 2),
(11, '2025_12_17_142003_create_transactions_table', 3),
(12, '2025_12_26_000001_create_orders_table', 4);

-- --------------------------------------------------------

--
-- Table structure for table `notifications`
--

CREATE TABLE `notifications` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `title` varchar(255) NOT NULL,
  `message` text NOT NULL,
  `type` varchar(255) NOT NULL DEFAULT 'general',
  `is_read` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

CREATE TABLE `orders` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `order_id` varchar(255) NOT NULL,
  `user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `transaction_id` bigint(20) UNSIGNED DEFAULT NULL,
  `items` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`items`)),
  `subtotal` decimal(12,2) NOT NULL,
  `tax` decimal(12,2) NOT NULL DEFAULT 0.00,
  `shipping_cost` decimal(12,2) NOT NULL DEFAULT 0.00,
  `total` decimal(12,2) NOT NULL,
  `shipping_address` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`shipping_address`)),
  `status` varchar(255) NOT NULL DEFAULT 'Menunggu Pembayaran',
  `payment_status` varchar(255) NOT NULL DEFAULT 'pending',
  `payment_method` varchar(255) DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `password_reset_tokens`
--

CREATE TABLE `password_reset_tokens` (
  `email` varchar(255) NOT NULL,
  `token` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `personal_access_tokens`
--

CREATE TABLE `personal_access_tokens` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `tokenable_type` varchar(255) NOT NULL,
  `tokenable_id` bigint(20) UNSIGNED NOT NULL,
  `name` text NOT NULL,
  `token` varchar(64) NOT NULL,
  `abilities` text DEFAULT NULL,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `personal_access_tokens`
--

INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`, `created_at`, `updated_at`) VALUES
(1, 'App\\Models\\User', 1, 'auth_token', 'bf658e8ce05edd634128fb470d4a18a7d48d5b065c38602dcf90006987348fdb', '[\"*\"]', '2025-11-18 04:48:53', NULL, '2025-11-18 04:00:06', '2025-11-18 04:48:53'),
(2, 'App\\Models\\User', 2, 'auth_token', 'cc84aafee7fa719a523f1ff16b63bc663335390568bbace7a9099ad99463f43f', '[\"*\"]', '2025-11-18 04:50:34', NULL, '2025-11-18 04:49:49', '2025-11-18 04:50:34'),
(3, 'App\\Models\\User', 2, 'auth_token', '70479d79ec6b0e2588e78e87f658220f6f9530c532e95b1f8e927b270e961025', '[\"*\"]', '2025-11-18 04:51:14', NULL, '2025-11-18 04:50:49', '2025-11-18 04:51:14'),
(4, 'App\\Models\\User', 2, 'auth_token', 'd0f30c939486b2ae6ba049e4808a6f60eb144b31ac32e1a633594c16de174c6c', '[\"*\"]', NULL, NULL, '2025-11-19 02:12:03', '2025-11-19 02:12:03'),
(5, 'App\\Models\\User', 2, 'auth_token', '36c8a187bf066ad284a9d6da4a32c2a5c45312a301a8e06d5f8684a198e333d4', '[\"*\"]', NULL, NULL, '2025-11-19 03:02:36', '2025-11-19 03:02:36'),
(6, 'App\\Models\\User', 2, 'auth_token', '7c87dbf4c56fa8224e3bf30e7acb92ec9403e39b49866e37a19f545f85c931ef', '[\"*\"]', NULL, NULL, '2025-11-19 03:58:32', '2025-11-19 03:58:32'),
(7, 'App\\Models\\User', 2, 'auth_token', 'd29ba356e8b9ab886e4d552d7da466a1045d7ef3ef1b775e53f7a0f6e2a22849', '[\"*\"]', NULL, NULL, '2025-11-19 04:05:56', '2025-11-19 04:05:56'),
(8, 'App\\Models\\User', 2, 'auth_token', 'cfeec5c48a06debd39d7a729e18a7a7d8d86f67c455216bdc26697ffa3fb6b0b', '[\"*\"]', NULL, NULL, '2025-11-19 04:08:58', '2025-11-19 04:08:58'),
(9, 'App\\Models\\User', 1, 'auth_token', 'f060ac161fa2dd19b94a80285cd8849b82f780fdea288f9162e91ae194add47c', '[\"*\"]', NULL, NULL, '2025-11-19 05:40:59', '2025-11-19 05:40:59'),
(10, 'App\\Models\\User', 2, 'auth_token', 'a0d3606618e1667aee02a9a5975e14df3d8afa7e8c91fd81276e4f7990656739', '[\"*\"]', '2025-11-19 05:42:56', NULL, '2025-11-19 05:42:22', '2025-11-19 05:42:56'),
(11, 'App\\Models\\User', 1, 'auth_token', '9a14651e5f33a0e45f7574d3816870feb3e631371522591e8c774c457ac3dd0a', '[\"*\"]', '2025-11-19 05:48:20', NULL, '2025-11-19 05:44:41', '2025-11-19 05:48:20'),
(12, 'App\\Models\\User', 1, 'auth_token', '073aa965d8c546a3a4a6413f09e346bd5b7648e70f3cd7de3a5210266b4fa994', '[\"*\"]', '2025-11-23 02:04:32', NULL, '2025-11-23 01:57:42', '2025-11-23 02:04:32'),
(13, 'App\\Models\\User', 2, 'auth_token', 'eb1ab697b2930013bd1d482a085c75da0d119303e8922471c3f19bd9313dfef1', '[\"*\"]', NULL, NULL, '2025-11-23 02:05:19', '2025-11-23 02:05:19'),
(14, 'App\\Models\\User', 1, 'auth_token', 'e50af7559c6f031bbcb9258e91651836f6f21421e9f635039ab28e4bc7f64619', '[\"*\"]', '2025-11-26 00:27:16', NULL, '2025-11-26 00:19:56', '2025-11-26 00:27:16'),
(15, 'App\\Models\\User', 2, 'auth_token', 'd5cf5f7e44bb2b369364abd72793e693428e72fd3771698195530c8d56624dc9', '[\"*\"]', NULL, NULL, '2025-11-26 02:47:59', '2025-11-26 02:47:59'),
(16, 'App\\Models\\User', 2, 'auth_token', '2b7e8de3161f52bceb4957201ef92dd0d3f7457d80195f47c35966e7e12113ac', '[\"*\"]', NULL, NULL, '2025-11-26 03:14:00', '2025-11-26 03:14:00'),
(17, 'App\\Models\\User', 2, 'auth_token', '2ed551f1a8b637d3097cd718e88bcf1cb6f298de300f06553e754f673011907e', '[\"*\"]', NULL, NULL, '2025-11-26 04:16:07', '2025-11-26 04:16:07'),
(18, 'App\\Models\\User', 2, 'auth_token', '982be4489c6e9b4674e4c7fa92dc093840ec87dda962c3036a3dec7a8a01f0e5', '[\"*\"]', NULL, NULL, '2025-11-26 04:42:46', '2025-11-26 04:42:46'),
(19, 'App\\Models\\User', 2, 'auth_token', '24f7dc7246ebb44811160af1797a79b847f5b9e60edb7194d4b1261a5fb90ccb', '[\"*\"]', NULL, NULL, '2025-11-26 06:49:52', '2025-11-26 06:49:52'),
(20, 'App\\Models\\User', 1, 'auth_token', '7aa4c3a55c563aa0fb3c61c2c7e407905379e7c91bce9d9c89a13e2d368c1354', '[\"*\"]', '2025-11-26 06:53:12', NULL, '2025-11-26 06:51:42', '2025-11-26 06:53:12'),
(21, 'App\\Models\\User', 2, 'auth_token', '666608119335f24d6eaecfd121b1b967f169f9417d1424aa8a154d1901807cc6', '[\"*\"]', NULL, NULL, '2025-11-26 06:56:09', '2025-11-26 06:56:09'),
(22, 'App\\Models\\User', 2, 'auth_token', '1e53bba02276b230217b758bb0d790323976e8c3621effb9aecdf28d5a044f99', '[\"*\"]', NULL, NULL, '2025-11-26 07:48:00', '2025-11-26 07:48:00'),
(23, 'App\\Models\\User', 2, 'auth_token', 'cc7654d0cd29209d8ae8584cf179cecbd05a3dca1037b4be1da324495c80dd6c', '[\"*\"]', NULL, NULL, '2025-11-26 08:11:01', '2025-11-26 08:11:01'),
(24, 'App\\Models\\User', 1, 'auth_token', '4924ee6a36b661924e3ad5b98dc019992b45d087a6e9985c8b32d316cc806ab6', '[\"*\"]', NULL, NULL, '2025-11-26 08:12:58', '2025-11-26 08:12:58'),
(25, 'App\\Models\\User', 2, 'auth_token', '5b3befb56682ccbdb0f3867137606daef7db77a2ba18c41e6fb6f6b198b95cf0', '[\"*\"]', '2025-11-26 08:15:37', NULL, '2025-11-26 08:13:13', '2025-11-26 08:15:37'),
(26, 'App\\Models\\User', 2, 'auth_token', '3e3ed3d10ddc13bd0a2f43e6e66d37e7ecba0cb7fd536be7056e40bb3362ff8d', '[\"*\"]', NULL, NULL, '2025-11-26 08:20:50', '2025-11-26 08:20:50'),
(27, 'App\\Models\\User', 2, 'auth_token', '5a70647a7bd68bc872d2bf0cbda4d9afd5c6bedf5d5bbbdcb8ed2becb76c4410', '[\"*\"]', NULL, NULL, '2025-11-27 07:27:40', '2025-11-27 07:27:40'),
(28, 'App\\Models\\User', 2, 'auth_token', 'ea3ee8516f85df731ec1759ff7c088313fe398c2936771e73a8216b06185d2e5', '[\"*\"]', '2025-11-27 07:51:10', NULL, '2025-11-27 07:48:40', '2025-11-27 07:51:10'),
(29, 'App\\Models\\User', 1, 'auth_token', 'acd1fa874c0da9abf5c9cf8b63081f76378b34807eb4deb0db163b960c8f20ab', '[\"*\"]', '2025-11-27 07:54:28', NULL, '2025-11-27 07:52:16', '2025-11-27 07:54:28'),
(30, 'App\\Models\\User', 1, 'auth_token', '9a55a40d49374f31f0e2e4e000e2a527e0f6ed822a9c540f12f583ac0f72a418', '[\"*\"]', NULL, NULL, '2025-11-27 07:57:37', '2025-11-27 07:57:37'),
(31, 'App\\Models\\User', 2, 'auth_token', 'a28ce0ad69b22388f00452a93ec13d059df4724b978928e39d914a22f2cd23ae', '[\"*\"]', NULL, NULL, '2025-11-27 07:58:30', '2025-11-27 07:58:30'),
(32, 'App\\Models\\User', 1, 'auth_token', '564bb015ef31691579a7744afef4c309d5f8bd1b7d5a57f64d0d901674ded04b', '[\"*\"]', '2025-11-27 08:04:03', NULL, '2025-11-27 08:00:32', '2025-11-27 08:04:03'),
(33, 'App\\Models\\User', 2, 'auth_token', 'ec719d27b7ccf11116c750e224f9c5efb1f1000a759c3130b3b9e1348e192711', '[\"*\"]', '2025-11-27 08:09:42', NULL, '2025-11-27 08:05:20', '2025-11-27 08:09:42'),
(34, 'App\\Models\\User', 1, 'auth_token', 'acbeec48d71a71ac5f01f550dd1e992b453bca444862dc36d861d5ba02166bdc', '[\"*\"]', '2025-11-27 08:11:52', NULL, '2025-11-27 08:10:18', '2025-11-27 08:11:52'),
(35, 'App\\Models\\User', 2, 'auth_token', '923936beb8c977f9d781cebf05fd071b5ad4fa1103b63a8af8f8fc113debe6ab', '[\"*\"]', NULL, NULL, '2025-11-27 08:34:56', '2025-11-27 08:34:56'),
(36, 'App\\Models\\User', 2, 'auth_token', '909db06ae938ddfd3cd84b60d8cbb08e5f70ba339369fb392c95d576e6cea8ca', '[\"*\"]', NULL, NULL, '2025-12-08 01:34:05', '2025-12-08 01:34:05'),
(37, 'App\\Models\\User', 1, 'auth_token', '80a40b2a318a1adb9d0c7d3bbb73d827937746816c28e685861872e7a4083688', '[\"*\"]', '2025-12-08 05:13:45', NULL, '2025-12-08 04:56:57', '2025-12-08 05:13:45'),
(38, 'App\\Models\\User', 2, 'auth_token', '4724c0b1546d1eb7649857c8d42a83a50fa5f2a4364954b231b7cefe0799ad71', '[\"*\"]', NULL, NULL, '2025-12-08 05:14:01', '2025-12-08 05:14:01'),
(39, 'App\\Models\\User', 2, 'auth_token', 'b116ace7db85504abf0d4287e10a25a906336feb444e5b80d344a2ff8d0a4b9f', '[\"*\"]', NULL, NULL, '2025-12-10 06:36:07', '2025-12-10 06:36:07'),
(40, 'App\\Models\\User', 2, 'auth_token', 'b9b8c3630659b68be5cfce86b96d3ddfed5923b36d077a6487234b0ef1dd735d', '[\"*\"]', NULL, NULL, '2025-12-10 06:57:38', '2025-12-10 06:57:38'),
(41, 'App\\Models\\User', 1, 'auth_token', '9ea75d2dcb73c7048a9fad44081d1376c366c21c5e7b6299789ecc6aa9416010', '[\"*\"]', NULL, NULL, '2025-12-10 06:59:17', '2025-12-10 06:59:17'),
(42, 'App\\Models\\User', 1, 'auth_token', '773ab8f09defc3017f95bcc19139041616bfe4b1e10317e2c312a1aaffd01944', '[\"*\"]', NULL, NULL, '2025-12-10 07:00:11', '2025-12-10 07:00:11'),
(43, 'App\\Models\\User', 2, 'auth_token', '105b8aee320c873488d99c663154464054736fed930830976f67639137089ba0', '[\"*\"]', '2025-12-10 07:01:24', NULL, '2025-12-10 07:00:32', '2025-12-10 07:01:24'),
(44, 'App\\Models\\User', 1, 'auth_token', '9d5963e1dc7b4d2725f3cb8403c42bd01e498c439980d172c9bec86bf4fee26f', '[\"*\"]', NULL, NULL, '2025-12-10 07:39:14', '2025-12-10 07:39:14'),
(45, 'App\\Models\\User', 2, 'auth_token', '9dc926c06e8c4826cb1e42db7532e4f171eaf3c17fb05f7ee9e9d200f2fc4736', '[\"*\"]', NULL, NULL, '2025-12-10 07:39:27', '2025-12-10 07:39:27'),
(46, 'App\\Models\\User', 1, 'auth_token', 'c9f2b8d4afa8d65521ca1af582deb63f336d259a113a36fa1e87005495bb93b2', '[\"*\"]', NULL, NULL, '2025-12-11 04:14:26', '2025-12-11 04:14:26'),
(47, 'App\\Models\\User', 2, 'auth_token', '1d4eaa555af8c859ad9c391c454077c5ea07de9639390971a19f9469432ad25a', '[\"*\"]', NULL, NULL, '2025-12-11 04:54:26', '2025-12-11 04:54:26'),
(48, 'App\\Models\\User', 2, 'auth_token', 'afde4c1dedc9f91a813583a508a847115e98bf1d98b8ed4d33cb492c1abd22f0', '[\"*\"]', NULL, NULL, '2025-12-11 05:11:36', '2025-12-11 05:11:36'),
(49, 'App\\Models\\User', 2, 'auth_token', '53f090751cfba57b7b7cf72f3a0fcf741094cbcd3d470f91c9874db39791e401', '[\"*\"]', NULL, NULL, '2025-12-11 07:20:14', '2025-12-11 07:20:14'),
(50, 'App\\Models\\User', 1, 'auth_token', '786104133e1bd98281b45773d1efb5495ad0df493a509c2760d1e57666d17ab0', '[\"*\"]', '2025-12-11 07:24:29', NULL, '2025-12-11 07:23:20', '2025-12-11 07:24:29'),
(51, 'App\\Models\\User', 2, 'auth_token', 'e11e206b9d68a09b90907bd68752401d160a0244ee5e38af05ddc11da5f5db9a', '[\"*\"]', '2025-12-11 07:30:16', NULL, '2025-12-11 07:28:30', '2025-12-11 07:30:16'),
(52, 'App\\Models\\User', 1, 'auth_token', '411b1c9a0aead3c5b8807bba35f222308ddab63eb5485d57ec9285754bbee18e', '[\"*\"]', '2025-12-11 07:33:33', NULL, '2025-12-11 07:32:02', '2025-12-11 07:33:33'),
(53, 'App\\Models\\User', 2, 'auth_token', '0872badfffb1ebc52d512b5ade5eb95b7c828db97970d60e198033668f3ca7df', '[\"*\"]', NULL, NULL, '2025-12-11 07:36:09', '2025-12-11 07:36:09'),
(54, 'App\\Models\\User', 2, 'auth_token', 'ad6114eee56b7d2a70019f6fde9f85b6b58d6696efdb8de083325adbba495293', '[\"*\"]', NULL, NULL, '2025-12-15 01:45:42', '2025-12-15 01:45:42'),
(55, 'App\\Models\\User', 2, 'auth_token', '7e2e9ded7c05c3a50caff4f33fa39c94f6ac1dabe89f75e2da84c8eb0ee584fc', '[\"*\"]', NULL, NULL, '2025-12-15 02:17:12', '2025-12-15 02:17:12'),
(56, 'App\\Models\\User', 2, 'auth_token', 'a6f69e97ddddf00f9a4e03246a3c17affef8363cacf7af50dfeda3751ea39063', '[\"*\"]', NULL, NULL, '2025-12-15 02:19:52', '2025-12-15 02:19:52'),
(57, 'App\\Models\\User', 2, 'auth_token', '69eebe99827b537a4894f5597b5e0f44118f7932b266af76ae8164cd4684718e', '[\"*\"]', NULL, NULL, '2025-12-15 02:33:05', '2025-12-15 02:33:05'),
(58, 'App\\Models\\User', 2, 'auth_token', '74bc4de3c98961e7abcb83422cdbc1d20fdabee2feaf7ea3e1869eb30e7c8b1a', '[\"*\"]', NULL, NULL, '2025-12-15 02:33:30', '2025-12-15 02:33:30'),
(59, 'App\\Models\\User', 2, 'auth_token', 'b403880322742ebbf9a5b91eab02e1ecc0481cea44e87aab0dcde387da33b1a5', '[\"*\"]', '2025-12-17 08:00:14', NULL, '2025-12-17 07:30:10', '2025-12-17 08:00:14'),
(60, 'App\\Models\\User', 1, 'auth_token', '0e7fecbabc7b443b488ab655feea2cac3b74b0affed2459ed1ee63c7a9370823', '[\"*\"]', '2025-12-17 08:00:52', NULL, '2025-12-17 08:00:34', '2025-12-17 08:00:52'),
(61, 'App\\Models\\User', 2, 'auth_token', 'fa5f155a6e78f66988165432c479391793329ed5a3c88eef24d0287f919b25c3', '[\"*\"]', '2025-12-17 08:08:52', NULL, '2025-12-17 08:01:21', '2025-12-17 08:08:52'),
(62, 'App\\Models\\User', 2, 'auth_token', '3e17e6827d66c3e83b78b50b3946ad8bb8800fa8281d0d82f491a5617a834eba', '[\"*\"]', NULL, NULL, '2025-12-17 08:20:44', '2025-12-17 08:20:44'),
(63, 'App\\Models\\User', 2, 'auth_token', '285f1727f6787bd7879b9faaba202d1893aaa662cd16ccc5c3a02a68e5e25058', '[\"*\"]', NULL, NULL, '2025-12-17 08:22:11', '2025-12-17 08:22:11'),
(64, 'App\\Models\\User', 2, 'auth_token', 'd5be6f6b9f8d054664b938d980c9b071afd1b3a69328eac0e1098837a0f6b47a', '[\"*\"]', '2025-12-17 08:23:52', NULL, '2025-12-17 08:22:30', '2025-12-17 08:23:52'),
(65, 'App\\Models\\User', 2, 'auth_token', '6874c2a81e0b5f518daa716b3d54e0b70bd1ef6bc84c49de18be4cb593c3f3c7', '[\"*\"]', NULL, NULL, '2025-12-17 08:40:20', '2025-12-17 08:40:20'),
(66, 'App\\Models\\User', 2, 'auth_token', 'ef52126e82956233400d6eb0dce1df7195a87899b4b2389dc4847346b00d4620', '[\"*\"]', '2025-12-17 08:51:19', NULL, '2025-12-17 08:47:34', '2025-12-17 08:51:19'),
(67, 'App\\Models\\User', 2, 'auth_token', '651a007e2a05339199e9ba94a46a785f5f0ca26da4b32443a879b4019a55e912', '[\"*\"]', '2025-12-23 01:32:16', NULL, '2025-12-23 00:56:49', '2025-12-23 01:32:16'),
(68, 'App\\Models\\User', 2, 'auth_token', '89eb4c52d6afb81899e59bf13b5098051cd68d410b8ca5aa23e8fde8c9b3581e', '[\"*\"]', NULL, NULL, '2025-12-23 01:35:56', '2025-12-23 01:35:56'),
(69, 'App\\Models\\User', 2, 'auth_token', '740a40f87f213c1b854d6bd5fe4403dbcb471b2a41e662b4e3881a035cdd50ff', '[\"*\"]', NULL, NULL, '2025-12-23 01:44:08', '2025-12-23 01:44:08'),
(70, 'App\\Models\\User', 2, 'auth_token', '75bb83d6af80ad99915ed5041bc3c01b2c0bbd50c87f9529c7ed4187b72a1356', '[\"*\"]', NULL, NULL, '2025-12-23 01:49:28', '2025-12-23 01:49:28'),
(71, 'App\\Models\\User', 2, 'auth_token', '27141ffe0531b440925590b0afe7d23e30d1af8e2198ceac83f04028377c2106', '[\"*\"]', NULL, NULL, '2025-12-23 02:06:31', '2025-12-23 02:06:31'),
(72, 'App\\Models\\User', 2, 'auth_token', 'd80adbbbf18d5f44785be5e9df7e1631a7447f1fd812159b4af25f8e016b41b0', '[\"*\"]', NULL, NULL, '2025-12-23 02:18:11', '2025-12-23 02:18:11'),
(73, 'App\\Models\\User', 2, 'auth_token', 'be10bef5bd512fadd8f823a45765c854307f6b4a91dc33b6d778d908b3a6000e', '[\"*\"]', NULL, NULL, '2025-12-23 02:19:00', '2025-12-23 02:19:00'),
(74, 'App\\Models\\User', 2, 'auth_token', '5dad8e2aee1e0d29b93a55d8df3a6421d9d1be117b869357e6a59a7b2b9ede34', '[\"*\"]', NULL, NULL, '2025-12-23 02:19:11', '2025-12-23 02:19:11'),
(75, 'App\\Models\\User', 2, 'auth_token', '43db4a7cca23ae405cb3af65408f81a4366417c3f01e718ea8d8d8e5b7e74574', '[\"*\"]', '2025-12-23 02:46:42', NULL, '2025-12-23 02:46:12', '2025-12-23 02:46:42'),
(76, 'App\\Models\\User', 2, 'auth_token', 'cde97f0437e606b805c01c8c7d3563358759de4fd570b1cca8a9d05764027b52', '[\"*\"]', '2025-12-25 23:21:45', NULL, '2025-12-25 23:19:04', '2025-12-25 23:21:45'),
(77, 'App\\Models\\User', 1, 'auth_token', '5bd8dd60d34a3c02c46eaf6602275edc8d93896eb76bc3254500e957b803cbec', '[\"*\"]', '2025-12-25 23:22:45', NULL, '2025-12-25 23:22:27', '2025-12-25 23:22:45'),
(78, 'App\\Models\\User', 2, 'auth_token', '5ac9dced8b10523212575ffeb46bf65d8bdbaa2a63c12d6ca26799c9cd5465c8', '[\"*\"]', '2025-12-25 23:26:40', NULL, '2025-12-25 23:22:54', '2025-12-25 23:26:40'),
(79, 'App\\Models\\User', 1, 'auth_token', '3703f4fc7d41d3aa6f9e5d21600749617705ab46f5e66f3275b5e346312a14f7', '[\"*\"]', NULL, NULL, '2025-12-25 23:27:22', '2025-12-25 23:27:22'),
(80, 'App\\Models\\User', 1, 'auth_token', '0d06aef31b2cfad226239ac2d9614e7957e4127f28a574417a8d2ef46bda4ce3', '[\"*\"]', '2025-12-25 23:38:37', NULL, '2025-12-25 23:37:16', '2025-12-25 23:38:37'),
(81, 'App\\Models\\User', 2, 'auth_token', '3629c3b3e54797f0a93bedb18b225cd55d5c542786a2c21ebcfe17065f6bb96e', '[\"*\"]', '2025-12-30 01:59:05', NULL, '2025-12-29 23:33:22', '2025-12-30 01:59:05'),
(82, 'App\\Models\\User', 2, 'auth_token', 'c82af3829eb46378b1a45f95b7859a0f1fc91aece26fd950b5a1cb9d0ce8b767', '[\"*\"]', '2025-12-30 08:21:00', NULL, '2025-12-30 06:34:44', '2025-12-30 08:21:00'),
(83, 'App\\Models\\User', 2, 'auth_token', 'b52f25fcef441a1e4a283de3c91f913c21eeb444fa4550985d3f1b6a5d167b62', '[\"*\"]', NULL, NULL, '2025-12-30 08:18:39', '2025-12-30 08:18:39');

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE `products` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `category` varchar(255) DEFAULT NULL,
  `price` decimal(12,2) NOT NULL DEFAULT 0.00,
  `stock` int(11) NOT NULL DEFAULT 0,
  `description` text DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `size` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`size`)),
  `size_stocks` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`size_stocks`)),
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`id`, `name`, `category`, `price`, `stock`, `description`, `image`, `size`, `size_stocks`, `created_at`, `updated_at`) VALUES
(1, 'Blus Pesona Cindur', 'wanita', 249000.00, 15, 'Blus batik motif Cindur khas Batam dengan bahan katun premium.', '/wanita1.jpg', '[\"S\",\"M\",\"L\",\"XL\"]', NULL, '2025-11-18 03:59:12', '2025-11-18 03:59:12'),
(2, 'Blus Anggun Cindur', 'wanita', 259000.00, 12, 'Blus dengan kombinasi motif klasik dan potongan modern.', '/wanita2.jpg', '[\"S\",\"M\",\"L\",\"XL\"]', NULL, '2025-11-18 03:59:12', '2025-11-18 03:59:12'),
(3, 'Kemeja Batik Lengan Pendek', 'pria', 299000.00, 20, 'Kemeja batik pria dengan motif elegan untuk acara santai.', '/pria1.jpg', '[\"S\",\"M\",\"L\",\"XL\",\"XXL\"]', NULL, '2025-11-18 03:59:12', '2025-11-18 03:59:12'),
(4, 'Kemeja Batik Lengan Panjang', 'pria', 349000.00, 10, 'Pilihan formal dengan bahan lembut dan nyaman.', '/pria2.jpg', '[\"M\",\"L\",\"XL\",\"XXL\"]', NULL, '2025-11-18 03:59:12', '2025-11-18 03:59:12'),
(5, 'Dress Batik Seruni', 'wanita', 399000.00, 8, 'Dress batik ready-to-wear untuk acara spesial.', '/wanita3.jpg', '[\"S\",\"M\",\"L\"]', NULL, '2025-11-18 03:59:12', '2025-11-18 03:59:12'),
(12, 'Topeng Raden Panjji', 'aksesoris', 100000.00, 145, 'Topeng panji merupakan topeng runtutan pertama dalam proses babak Tari Topeng. Panji memiliki simbol insan yang baru saja terlahir ke dunia. Arti simbolik dari Topeng Panji adalah lambang kehalusan, tabiat, dan kesabaran, atau disebut pula dengan Mutmainah.', '/storage/products/hiQIEFkiLMhnAELi599GVfBxPvszRGtTfmqXyIOz.jfif', '[\"S\",\"M\",\"L\",\"XL\",\"XXL\"]', '{\"S\":20,\"M\":40,\"L\":30,\"XL\":50,\"XXL\":5}', '2025-11-27 08:01:59', '2025-12-08 05:13:45'),
(13, 'Kain Batik Tulis Parang', 'kain', 350000.00, 13, 'Batik Parang adalah salah satu motif batik yang paling tua di Indonesia. Parang berasal dari kata \"pèrèng\" yang berarti \"lèrèng\". Maksudnya, bentuk motif batik parang itu berupa huruf “S” yang digambar secara berkaitan satu sama lain dan membentuk diagonal miring layaknya lèrèng gunung.', '/storage/products/x4KTBQTLD4JFNXEaEcmlCMFb4DJx4FTLUawYe9Je.jfif', '[\"S\",\"L\",\"M\",\"XL\",\"XXL\"]', NULL, '2025-11-27 08:04:03', '2025-11-27 08:04:03'),
(16, 'Topeng', 'aksesoris', 1000.00, 56, 'Topeng', '/storage/products/yEiAVs3s64u3q5nrUEDeD62AJroiNpjSkBBrt3o3.jfif', '[\"S\",\"L\",\"XXL\"]', '{\"S\":8,\"L\":19,\"XXL\":29}', '2025-12-11 07:33:05', '2025-12-25 23:22:45');

-- --------------------------------------------------------

--
-- Table structure for table `sessions`
--

CREATE TABLE `sessions` (
  `id` varchar(255) NOT NULL,
  `user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` text DEFAULT NULL,
  `payload` longtext NOT NULL,
  `last_activity` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `transactions`
--

CREATE TABLE `transactions` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `order_id` varchar(255) NOT NULL,
  `amount` decimal(12,2) NOT NULL,
  `payment_type` varchar(255) DEFAULT NULL,
  `transaction_status` varchar(255) NOT NULL DEFAULT 'pending',
  `fraud_status` varchar(255) DEFAULT NULL,
  `raw_response` text DEFAULT NULL,
  `user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `transactions`
--

INSERT INTO `transactions` (`id`, `order_id`, `amount`, `payment_type`, `transaction_status`, `fraud_status`, `raw_response`, `user_id`, `created_at`, `updated_at`) VALUES
(1, 'ORD-20251217143048-FbdCvAVU', 240000.00, NULL, 'pending', NULL, '{\"transaction_details\":{\"order_id\":\"ORD-20251217143048-FbdCvAVU\",\"gross_amount\":240000},\"customer_details\":{\"first_name\":\"Nabil\",\"email\":\"mhmdnabil235@gmail.com\"},\"item_details\":[{\"id\":\"16\",\"price\":200000,\"quantity\":1,\"name\":\"Topeng (L)\"},{\"id\":\"TAX\",\"price\":20000,\"quantity\":1,\"name\":\"Pajak\"},{\"id\":\"SHIPPING\",\"price\":20000,\"quantity\":1,\"name\":\"Ongkos Kirim\"}]}', 2, '2025-12-17 07:30:49', '2025-12-17 07:30:49'),
(2, 'ORD-20251217144919-r1GapdDN', 130000.00, NULL, 'pending', NULL, '{\"transaction_details\":{\"order_id\":\"ORD-20251217144919-r1GapdDN\",\"gross_amount\":130000},\"customer_details\":{\"first_name\":\"Nabil\",\"email\":\"mhmdnabil235@gmail.com\"},\"item_details\":[{\"id\":\"12\",\"price\":100000,\"quantity\":1,\"name\":\"Topeng Raden Panjji (S)\"},{\"id\":\"TAX\",\"price\":10000,\"quantity\":1,\"name\":\"Pajak\"},{\"id\":\"SHIPPING\",\"price\":20000,\"quantity\":1,\"name\":\"Ongkos Kirim\"}]}', 2, '2025-12-17 07:49:20', '2025-12-17 07:49:20'),
(3, 'ORD-20251217145627-JXpZrig3', 240000.00, NULL, 'pending', NULL, '{\"transaction_details\":{\"order_id\":\"ORD-20251217145627-JXpZrig3\",\"gross_amount\":240000},\"customer_details\":{\"first_name\":\"Nabil\",\"email\":\"mhmdnabil235@gmail.com\"},\"item_details\":[{\"id\":\"16\",\"price\":200000,\"quantity\":1,\"name\":\"Topeng (S)\"},{\"id\":\"TAX\",\"price\":20000,\"quantity\":1,\"name\":\"Pajak\"},{\"id\":\"SHIPPING\",\"price\":20000,\"quantity\":1,\"name\":\"Ongkos Kirim\"}]}', 2, '2025-12-17 07:56:27', '2025-12-17 07:56:27'),
(4, 'ORD-20251217150519-0TIlo3bb', 20110.00, NULL, 'pending', NULL, '{\"transaction_details\":{\"order_id\":\"ORD-20251217150519-0TIlo3bb\",\"gross_amount\":20110},\"customer_details\":{\"first_name\":\"Nabil\",\"email\":\"mhmdnabil235@gmail.com\"},\"item_details\":[{\"id\":\"16\",\"price\":100,\"quantity\":1,\"name\":\"Topeng (S)\"},{\"id\":\"TAX\",\"price\":10,\"quantity\":1,\"name\":\"Pajak\"},{\"id\":\"SHIPPING\",\"price\":20000,\"quantity\":1,\"name\":\"Ongkos Kirim\"}]}', 2, '2025-12-17 08:05:20', '2025-12-17 08:05:20'),
(5, 'ORD-20251217150818-11XGm3pp', 20110.00, NULL, 'pending', NULL, '{\"transaction_details\":{\"order_id\":\"ORD-20251217150818-11XGm3pp\",\"gross_amount\":20110},\"customer_details\":{\"first_name\":\"Nabil\",\"email\":\"mhmdnabil235@gmail.com\"},\"item_details\":[{\"id\":\"16\",\"price\":100,\"quantity\":1,\"name\":\"Topeng (S)\"},{\"id\":\"TAX\",\"price\":10,\"quantity\":1,\"name\":\"Pajak\"},{\"id\":\"SHIPPING\",\"price\":20000,\"quantity\":1,\"name\":\"Ongkos Kirim\"}]}', 2, '2025-12-17 08:08:19', '2025-12-17 08:08:19'),
(6, 'ORD-20251217150845-KV1K8XGg', 20110.00, NULL, 'pending', NULL, '{\"transaction_details\":{\"order_id\":\"ORD-20251217150845-KV1K8XGg\",\"gross_amount\":20110},\"customer_details\":{\"first_name\":\"Nabil\",\"email\":\"mhmdnabil235@gmail.com\"},\"item_details\":[{\"id\":\"16\",\"price\":100,\"quantity\":1,\"name\":\"Topeng (S)\"},{\"id\":\"TAX\",\"price\":10,\"quantity\":1,\"name\":\"Pajak\"},{\"id\":\"SHIPPING\",\"price\":20000,\"quantity\":1,\"name\":\"Ongkos Kirim\"}]}', 2, '2025-12-17 08:08:46', '2025-12-17 08:08:46'),
(7, 'ORD-20251217150852-RzBczVQp', 20110.00, NULL, 'pending', NULL, '{\"transaction_details\":{\"order_id\":\"ORD-20251217150852-RzBczVQp\",\"gross_amount\":20110},\"customer_details\":{\"first_name\":\"Nabil\",\"email\":\"mhmdnabil235@gmail.com\"},\"item_details\":[{\"id\":\"16\",\"price\":100,\"quantity\":1,\"name\":\"Topeng (S)\"},{\"id\":\"TAX\",\"price\":10,\"quantity\":1,\"name\":\"Pajak\"},{\"id\":\"SHIPPING\",\"price\":20000,\"quantity\":1,\"name\":\"Ongkos Kirim\"}]}', 2, '2025-12-17 08:08:53', '2025-12-17 08:08:53'),
(8, 'ORD-20251217152309-mydniXJL', 20110.00, NULL, 'pending', NULL, '{\"transaction_details\":{\"order_id\":\"ORD-20251217152309-mydniXJL\",\"gross_amount\":20110},\"customer_details\":{\"first_name\":\"Nabil\",\"email\":\"mhmdnabil235@gmail.com\"},\"item_details\":[{\"id\":\"16\",\"price\":100,\"quantity\":1,\"name\":\"Topeng (S)\"},{\"id\":\"TAX\",\"price\":10,\"quantity\":1,\"name\":\"Pajak\"},{\"id\":\"SHIPPING\",\"price\":20000,\"quantity\":1,\"name\":\"Ongkos Kirim\"}]}', 2, '2025-12-17 08:23:10', '2025-12-17 08:23:10'),
(9, 'ORD-20251217155015-bwupO5Dp', 20110.00, NULL, 'pending', NULL, '{\"transaction_details\":{\"order_id\":\"ORD-20251217155015-bwupO5Dp\",\"gross_amount\":20110},\"customer_details\":{\"first_name\":\"Nabil\",\"email\":\"mhmdnabil235@gmail.com\"},\"item_details\":[{\"id\":\"16\",\"price\":100,\"quantity\":1,\"name\":\"Topeng (S)\"},{\"id\":\"TAX\",\"price\":10,\"quantity\":1,\"name\":\"Pajak\"},{\"id\":\"SHIPPING\",\"price\":20000,\"quantity\":1,\"name\":\"Ongkos Kirim\"}]}', 2, '2025-12-17 08:50:16', '2025-12-17 08:50:16'),
(10, 'ORD-20251223075756-X0pUWH6r', 130000.00, NULL, 'pending', NULL, '{\"transaction_details\":{\"order_id\":\"ORD-20251223075756-X0pUWH6r\",\"gross_amount\":130000},\"customer_details\":{\"first_name\":\"Nabil\",\"email\":\"mhmdnabil235@gmail.com\"},\"item_details\":[{\"id\":\"12\",\"price\":100000,\"quantity\":1,\"name\":\"Topeng Raden Panjji (S)\"},{\"id\":\"TAX\",\"price\":10000,\"quantity\":1,\"name\":\"Pajak\"},{\"id\":\"SHIPPING\",\"price\":20000,\"quantity\":1,\"name\":\"Ongkos Kirim\"}]}', 2, '2025-12-23 00:57:57', '2025-12-23 00:57:57'),
(11, 'ORD-20251223083218-IhD1D6OV', 130000.00, NULL, 'pending', NULL, '{\"transaction_details\":{\"order_id\":\"ORD-20251223083218-IhD1D6OV\",\"gross_amount\":130000},\"customer_details\":{\"first_name\":\"Nabil\",\"email\":\"mhmdnabil235@gmail.com\"},\"item_details\":[{\"id\":\"12\",\"price\":100000,\"quantity\":1,\"name\":\"Topeng Raden Panjji (S)\"},{\"id\":\"TAX\",\"price\":10000,\"quantity\":1,\"name\":\"Pajak\"},{\"id\":\"SHIPPING\",\"price\":20000,\"quantity\":1,\"name\":\"Ongkos Kirim\"}]}', 2, '2025-12-23 01:32:19', '2025-12-23 01:32:19'),
(12, 'ORD-20251223094642-pS6TaCYi', 100000.00, NULL, 'pending', NULL, '{\"transaction_details\":{\"order_id\":\"ORD-20251223094642-pS6TaCYi\",\"gross_amount\":100000},\"customer_details\":{\"first_name\":\"Nabil\",\"email\":\"mhmdnabil235@gmail.com\"},\"item_details\":[{\"id\":\"12\",\"price\":100000,\"quantity\":1,\"name\":\"Topeng Raden Panjji (S)\"}]}', 2, '2025-12-23 02:46:44', '2025-12-23 02:46:44'),
(13, 'ORD-20251226062306-vFi8zXpL', 1000.00, NULL, 'pending', NULL, '{\"transaction_details\":{\"order_id\":\"ORD-20251226062306-vFi8zXpL\",\"gross_amount\":1000},\"customer_details\":{\"first_name\":\"Nabil\",\"email\":\"mhmdnabil235@gmail.com\"},\"item_details\":[{\"id\":\"16\",\"price\":1000,\"quantity\":1,\"name\":\"Topeng (S)\"}]}', 2, '2025-12-25 23:23:07', '2025-12-25 23:23:07'),
(14, 'ORD-20251226062431-bN5NOja1', 1000.00, NULL, 'pending', NULL, '{\"transaction_details\":{\"order_id\":\"ORD-20251226062431-bN5NOja1\",\"gross_amount\":1000},\"customer_details\":{\"first_name\":\"Nabil\",\"email\":\"mhmdnabil235@gmail.com\"},\"item_details\":[{\"id\":\"16\",\"price\":1000,\"quantity\":1,\"name\":\"Topeng (S)\"}]}', 2, '2025-12-25 23:24:32', '2025-12-25 23:24:32'),
(15, 'ORD-20251230064152-LvhIGOqp', 1000.00, NULL, 'pending', NULL, '{\"transaction_details\":{\"order_id\":\"ORD-20251230064152-LvhIGOqp\",\"gross_amount\":1000},\"customer_details\":{\"first_name\":\"Nabil\",\"email\":\"mhmdnabil235@gmail.com\"},\"item_details\":[{\"id\":\"16\",\"price\":1000,\"quantity\":1,\"name\":\"Topeng (S)\"}]}', 2, '2025-12-29 23:41:53', '2025-12-29 23:41:53'),
(16, 'ORD-20251230064520-fhrT7f0D', 1000.00, NULL, 'pending', NULL, '{\"transaction_details\":{\"order_id\":\"ORD-20251230064520-fhrT7f0D\",\"gross_amount\":1000},\"customer_details\":{\"first_name\":\"Nabil\",\"email\":\"mhmdnabil235@gmail.com\"},\"item_details\":[{\"id\":\"16\",\"price\":1000,\"quantity\":1,\"name\":\"Topeng (S)\"}]}', 2, '2025-12-29 23:45:21', '2025-12-29 23:45:21'),
(17, 'ORD-20251230064541-vSUudzeA', 1000.00, NULL, 'pending', NULL, '{\"transaction_details\":{\"order_id\":\"ORD-20251230064541-vSUudzeA\",\"gross_amount\":1000},\"customer_details\":{\"first_name\":\"Nabil\",\"email\":\"mhmdnabil235@gmail.com\"},\"item_details\":[{\"id\":\"16\",\"price\":1000,\"quantity\":1,\"name\":\"Topeng (S)\"}]}', 2, '2025-12-29 23:45:42', '2025-12-29 23:45:42'),
(18, 'ORD-20251230064554-XAfQUdYq', 1000.00, NULL, 'pending', NULL, '{\"transaction_details\":{\"order_id\":\"ORD-20251230064554-XAfQUdYq\",\"gross_amount\":1000},\"customer_details\":{\"first_name\":\"Nabil\",\"email\":\"mhmdnabil235@gmail.com\"},\"item_details\":[{\"id\":\"16\",\"price\":1000,\"quantity\":1,\"name\":\"Topeng (S)\"}]}', 2, '2025-12-29 23:45:55', '2025-12-29 23:45:55'),
(19, 'ORD-20251230064620-pc3pFuao', 100000.00, NULL, 'pending', NULL, '{\"transaction_details\":{\"order_id\":\"ORD-20251230064620-pc3pFuao\",\"gross_amount\":100000},\"customer_details\":{\"first_name\":\"Nabil\",\"email\":\"mhmdnabil235@gmail.com\"},\"item_details\":[{\"id\":\"12\",\"price\":100000,\"quantity\":1,\"name\":\"Topeng Raden Panjji (M)\"}]}', 2, '2025-12-29 23:46:20', '2025-12-29 23:46:20'),
(20, 'ORD-20251230064719-6lcwa3Pg', 1000.00, NULL, 'pending', NULL, '{\"transaction_details\":{\"order_id\":\"ORD-20251230064719-6lcwa3Pg\",\"gross_amount\":1000},\"customer_details\":{\"first_name\":\"Nabil\",\"email\":\"mhmdnabil235@gmail.com\"},\"item_details\":[{\"id\":\"16\",\"price\":1000,\"quantity\":1,\"name\":\"Topeng (L)\"}]}', 2, '2025-12-29 23:47:19', '2025-12-29 23:47:19'),
(21, 'ORD-20251230065017-6IQ2b8gi', 1000.00, NULL, 'pending', NULL, '{\"transaction_details\":{\"order_id\":\"ORD-20251230065017-6IQ2b8gi\",\"gross_amount\":1000},\"customer_details\":{\"first_name\":\"Nabil\",\"email\":\"mhmdnabil235@gmail.com\"},\"item_details\":[{\"id\":\"16\",\"price\":1000,\"quantity\":1,\"name\":\"Topeng (L)\"}]}', 2, '2025-12-29 23:50:18', '2025-12-29 23:50:18'),
(22, 'ORD-20251230065520-RSkbe7bV', 100000.00, NULL, 'pending', NULL, '{\"transaction_details\":{\"order_id\":\"ORD-20251230065520-RSkbe7bV\",\"gross_amount\":100000},\"customer_details\":{\"first_name\":\"Nabil\",\"email\":\"mhmdnabil235@gmail.com\"},\"item_details\":[{\"id\":\"12\",\"price\":100000,\"quantity\":1,\"name\":\"Topeng Raden Panjji (S)\"}]}', 2, '2025-12-29 23:55:21', '2025-12-29 23:55:21'),
(23, 'ORD-20251230065921-rbF5nITA', 1000.00, NULL, 'pending', NULL, '{\"transaction_details\":{\"order_id\":\"ORD-20251230065921-rbF5nITA\",\"gross_amount\":1000},\"customer_details\":{\"first_name\":\"Nabil\",\"email\":\"mhmdnabil235@gmail.com\"},\"item_details\":[{\"id\":\"16\",\"price\":1000,\"quantity\":1,\"name\":\"Topeng (S)\"}]}', 2, '2025-12-29 23:59:22', '2025-12-29 23:59:22'),
(24, 'ORD-20251230140322-Gc2wroMh', 1000.00, NULL, 'pending', NULL, '{\"transaction_details\":{\"order_id\":\"ORD-20251230140322-Gc2wroMh\",\"gross_amount\":1000},\"customer_details\":{\"first_name\":\"Nabil\",\"email\":\"mhmdnabil235@gmail.com\"},\"item_details\":[{\"id\":\"16\",\"price\":1000,\"quantity\":1,\"name\":\"Topeng (S)\"}]}', 2, '2025-12-30 07:03:23', '2025-12-30 07:03:23');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `role` varchar(255) NOT NULL DEFAULT 'user',
  `remember_token` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `email_verified_at`, `password`, `role`, `remember_token`, `created_at`, `updated_at`) VALUES
(1, 'Administrator', 'admin@batikcindurbatam.com', NULL, '$2y$12$PthYRq.R4PiXA5eMebdNhe76PRtFFFTNcB0fB9BcqxkLmlpY4Lct6', 'admin', NULL, '2025-11-18 03:59:12', '2025-11-18 03:59:12'),
(2, 'Nabil', 'mhmdnabil235@gmail.com', NULL, '$2y$12$2pVMBLKMs9Ht6kOYQup.G.DE44eZJYnkLiN8Nl2hKMUkFF1fSZbyu', 'user', NULL, '2025-11-18 04:49:49', '2025-11-18 04:49:49');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `addresses`
--
ALTER TABLE `addresses`
  ADD PRIMARY KEY (`id`),
  ADD KEY `addresses_user_id_index` (`user_id`);

--
-- Indexes for table `cache`
--
ALTER TABLE `cache`
  ADD PRIMARY KEY (`key`);

--
-- Indexes for table `cache_locks`
--
ALTER TABLE `cache_locks`
  ADD PRIMARY KEY (`key`);

--
-- Indexes for table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`);

--
-- Indexes for table `jobs`
--
ALTER TABLE `jobs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `jobs_queue_index` (`queue`);

--
-- Indexes for table `job_batches`
--
ALTER TABLE `job_batches`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `migrations`
--
ALTER TABLE `migrations`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `notifications`
--
ALTER TABLE `notifications`
  ADD PRIMARY KEY (`id`),
  ADD KEY `notifications_user_id_index` (`user_id`);

--
-- Indexes for table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `orders_order_id_unique` (`order_id`),
  ADD KEY `orders_user_id_foreign` (`user_id`),
  ADD KEY `orders_transaction_id_foreign` (`transaction_id`);

--
-- Indexes for table `password_reset_tokens`
--
ALTER TABLE `password_reset_tokens`
  ADD PRIMARY KEY (`email`);

--
-- Indexes for table `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `personal_access_tokens_token_unique` (`token`),
  ADD KEY `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type`,`tokenable_id`),
  ADD KEY `personal_access_tokens_expires_at_index` (`expires_at`);

--
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `sessions_user_id_index` (`user_id`),
  ADD KEY `sessions_last_activity_index` (`last_activity`);

--
-- Indexes for table `transactions`
--
ALTER TABLE `transactions`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `transactions_order_id_unique` (`order_id`),
  ADD KEY `transactions_user_id_foreign` (`user_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `users_email_unique` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `addresses`
--
ALTER TABLE `addresses`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `jobs`
--
ALTER TABLE `jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `migrations`
--
ALTER TABLE `migrations`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `notifications`
--
ALTER TABLE `notifications`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `orders`
--
ALTER TABLE `orders`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=84;

--
-- AUTO_INCREMENT for table `products`
--
ALTER TABLE `products`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT for table `transactions`
--
ALTER TABLE `transactions`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `orders_transaction_id_foreign` FOREIGN KEY (`transaction_id`) REFERENCES `transactions` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `orders_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `transactions`
--
ALTER TABLE `transactions`
  ADD CONSTRAINT `transactions_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
