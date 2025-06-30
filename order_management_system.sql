-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jun 30, 2025 at 06:18 PM
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
-- Database: `order_management_system`
--

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
-- Table structure for table `menu`
--

CREATE TABLE `menu` (
  `menu_id` int(5) NOT NULL,
  `name` varchar(20) NOT NULL,
  `price` decimal(5,2) NOT NULL,
  `category` varchar(20) NOT NULL,
  `subcategory` varchar(20) NOT NULL,
  `picture` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `menu`
--

INSERT INTO `menu` (`menu_id`, `name`, `price`, `category`, `subcategory`, `picture`) VALUES
(1, ' Sup Gearbox Kambing', 19.00, 'signature', 'sup zz', 'https://i.ytimg.com/vi/EONwj3lpYgU/maxresdefault.jpg'),
(2, 'Sup Kambing', 20.00, 'signature', 'sup zz', 'https://tasteasianfood.com/wp-content/uploads/2022/11/Sup-Kambing-featured-image.jpeg'),
(3, 'Sup Daging', 8.00, 'signature', 'sup zz', 'https://portalmadura.com/wp-content/uploads/2019/01/Sup-daging-Tomat-Jamur.jpg'),
(4, 'Sup Ayam', 7.00, 'signature', 'sup zz', 'https://kulinerkota.com/wp-content/uploads/2022/10/Sup-Ayam-Sumber-@imahbabaturan-on-Instagram.jpg'),
(5, 'Mee Rebus Gearbox Ka', 20.00, 'signature', 'mee rebus zz', 'https://downtownjb.s3.amazonaws.com/yriq7snwvlcknoy6eoqb.jpg'),
(6, 'Mee Rebus Daging', 9.50, 'signature', 'mee rebus zz', 'https://1.bp.blogspot.com/-KQcjVdLg8TA/YJrLJV66smI/AAAAAAAAATk/jUVh13Fjwk8uCeVgIMqXnuDASwqa7BBPACLcBGAsYHQ/w640-h480/2.jpg'),
(7, 'Mee Rebus Ayam', 9.50, 'signature', 'mee rebus zz', 'https://2.bp.blogspot.com/-iSLd1pKo_Uk/WoBibWG7zqI/AAAAAAAAt3M/AgzvK0wwSz0g1EKXjFBCehYNFGxt_7tLQCLcBGAs/s1600/c6030b01be7b668cd76986d7f20ef14d.jpg'),
(8, 'Lontong Kuah', 7.50, 'sarapan', 'masakan panas', 'https://1.bp.blogspot.com/-JUwYMrIt5LM/WBvJQsVBdzI/AAAAAAAAAEA/XfxMOwvLs4kJkhSBeCqTZjpaGyFBUwl0wCK4B/s1600/lontongsayur.jpg'),
(9, 'Lotong Kering Ayam', 9.00, 'sarapan', 'masakan panas', 'https://www.rasa.my/wp-content/uploads/2019/11/76680.jpeg'),
(10, 'Lotong Kering Daging', 9.50, 'sarapan', 'masakan panas', 'https://i.pinimg.com/736x/03/bf/9c/03bf9ce349c6da34551155ce8e70dca6--malay-food-malaysian-food.jpg'),
(11, 'Roti Bakar', 2.50, 'sarapan', 'roti bakar', 'https://s2.bukalapak.com/uploads/content_attachment/7bc16140a62ae17b54a9acb5/original/resep_roti_bakar_1.jpg'),
(12, 'Roti Kaya', 2.50, 'sarapan', 'roti bakar', 'https://img-global.cpcdn.com/recipes/1907fd5f7fe4ae74/1200x630cq70/photo.jpg'),
(13, 'Roti Garlic', 3.50, 'sarapan', 'roti bakar', 'https://img-global.cpcdn.com/recipes/0ad0b4da706745e3/680x482cq70/garlic-bread-sederhana-foto-resep-utama.jpg'),
(14, 'Roti Kosong', 1.50, 'roti canai', 'roti canai', 'https://images.deliveryhero.io/image/fd-my/LH/n70g-hero.jpg'),
(15, ' Roti Kosong Bawang', 2.00, 'roti canai', 'roti canai', 'https://magazine.foodpanda.my/wp-content/uploads/sites/12/2020/04/cropped-Roti-Bawang.jpeg'),
(16, 'Roti Tampal', 2.80, 'roti canai', 'roti canai', 'https://img.freepik.com/premium-photo/plate-roti-tampal-version-roti-canai-malaysian-prata-bread_1048944-1106358.jpg'),
(17, 'Nasi Bawal Goreng Be', 9.00, 'set tengah hari', 'set nasi & lauk', 'https://1.bp.blogspot.com/-Xnscr-yvFB0/Tg17lQYAfEI/AAAAAAAAGgo/787VWZx39Qo/s1600/290620113427.jpg'),
(18, 'Nasi Siakap Goreng B', 15.00, 'set tengah hari', 'set nasi & lauk', 'https://3.bp.blogspot.com/-qgdZDF0sdBI/XHKh-w_HMtI/AAAAAAABHVA/X0Ouh8OsYoQnIowQxSyJ1QyRxd9CRlHUgCLcBGAs/s1600/aIMG_0800.jpg'),
(19, 'Nasi Keli Goreng Ber', 10.90, 'set tengah hari', 'set nasi & lauk', 'https://storage.googleapis.com/assets-jjcm.tonton.com.my/images/our_pick/1502159901-nasi_kukus_ikan_keli_goreng_pinggan_pinggan.jpg'),
(20, 'Bubur Ayam', 6.50, 'set tengah hari', 'masakan_panas', 'https://www.masakapahariini.com/wp-content/uploads/2019/01/bubur-ayam-kuning.jpg'),
(21, ' Bubur Nasi', 7.50, 'set tengah hari', 'masakan_panas', 'https://cdn.motherhood.com.my/wp-content/uploads/sites/2/2022/05/13231945/resepi-bubur-nasi.png'),
(22, 'Bakso (Mee / Mee Hoo', 7.50, 'set tengah hari', 'masakan_panas', 'https://themeatmen.sg/wp-content/uploads/2023/08/DSC09100.jpg'),
(23, 'Tiga Rasa', 35.00, 'menu ikan', 'ikan siakap', 'https://cdn.rasa.my/2023/06/Untitled-design-33-696x398.jpg'),
(24, 'Masam Manis', 35.00, 'menu ikan', 'ikan siakap', 'https://1.bp.blogspot.com/-7MvklsVOR_Y/Vm-WUy9Q7NI/AAAAAAAAAZ0/Wu10-iPmJJ0/s1600/20150616_191026.jpg'),
(25, 'Steam Lemon', 35.00, 'menu ikan', 'ikan siakap', 'https://sinaranwanita.com/wp-content/uploads/2020/01/ikan-siakap-stim.jpg'),
(26, 'Siakap Bakar', 35.00, 'menu ikan', 'bakar-bakar', 'https://i0.wp.com/www.bearnakedfood.com/wp-content/uploads/2015/09/DSCF5893.jpg'),
(27, 'Caru Bakar', 8.00, 'menu ikan', 'bakar-bakar', 'https://img-global.cpcdn.com/recipes/ceed727b25f88750/751x532cq70/ikan-cencaru-bakar-sumbat-sambal-maratonraya-ikan-mingguke3-resipi-foto-utama.jpg'),
(28, ' Kerang Bakar', 15.00, 'menu ikan', 'bakar-bakar', 'https://i.pinimg.com/originals/37/76/b7/3776b72ec550f2192e691e5032e2de84.jpg');

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
(4, '2025_06_27_145743_create_personal_access_tokens_table', 1);

-- --------------------------------------------------------

--
-- Table structure for table `notifications`
--

CREATE TABLE `notifications` (
  `id` varchar(255) NOT NULL,
  `notifiable_type` text NOT NULL,
  `notifiable_id` int(11) NOT NULL,
  `type` text NOT NULL,
  `data` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`data`)),
  `read_at` date DEFAULT NULL,
  `created_at` date NOT NULL,
  `updated_at` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `notifications`
--

INSERT INTO `notifications` (`id`, `notifiable_type`, `notifiable_id`, `type`, `data`, `read_at`, `created_at`, `updated_at`) VALUES
('03915dff-97ce-41eb-8e8f-4b321ca50e2c', 'App\\Models\\User', 1, 'App\\Notifications\\OrderStatusUpdated', '{\"order_id\":10,\"status\":\"picked up\",\"message\":\"Your order status has been updated to picked up.\",\"updated_at\":\"2025-06-29T15:44:07.152500Z\"}', '0000-00-00', '2025-06-29', '2025-06-29'),
('12b8cc6a-d359-43e4-87c0-6911fb25c840', 'App\\Models\\User', 1, 'App\\Notifications\\OrderStatusUpdated', '{\"order_id\":6,\"status\":\"in transit\",\"message\":\"Your order status has been updated to in transit.\",\"updated_at\":\"2025-06-29T15:43:40.106333Z\"}', '0000-00-00', '2025-06-29', '2025-06-29'),
('32be0f90-bbf0-4c34-a2d1-e58bedf3ebb0', 'App\\Models\\User', 1, 'App\\Notifications\\OrderStatusUpdated', '{\"order_id\":7,\"status\":\"picked up\",\"message\":\"Your order status has been updated to picked up.\",\"updated_at\":\"2025-06-29T16:14:12.683477Z\"}', '2025-06-29', '2025-06-29', '2025-06-29'),
('3f12e034-5780-45fb-97b1-2a05c49c59fe', 'App\\Models\\User', 1, 'App\\Notifications\\OrderStatusUpdated', '{\"order_id\":10,\"status\":\"in transit\",\"message\":\"Your order status has been updated to in transit.\",\"updated_at\":\"2025-06-30T04:30:57.450590Z\"}', '2025-06-30', '2025-06-30', '2025-06-30'),
('4b71f6f3-a4cc-4a70-83d5-2e7a5d489ef3', 'App\\Models\\User', 1, 'App\\Notifications\\OrderStatusUpdated', '{\"order_id\":5,\"status\":\"picked up\",\"message\":\"Your order status has been updated to picked up.\",\"updated_at\":\"2025-06-30T04:08:24.508981Z\"}', '2025-06-30', '2025-06-30', '2025-06-30'),
('6266ab9e-1d5d-4cb3-aa17-bba951bb91d7', 'App\\Models\\User', 1, 'App\\Notifications\\OrderStatusUpdated', '{\"order_id\":6,\"status\":\"picked up\",\"message\":\"Your order status has been updated to picked up.\",\"updated_at\":\"2025-06-30T04:09:36.165205Z\"}', '2025-06-30', '2025-06-30', '2025-06-30'),
('626d322c-5df9-4d11-a1a3-25b7fb90d77a', 'App\\Models\\User', 1, 'App\\Notifications\\OrderStatusUpdated', '{\"order_id\":9,\"status\":\"picked up\",\"message\":\"Your order status has been updated to picked up.\",\"updated_at\":\"2025-06-30T04:13:59.406042Z\"}', '2025-06-30', '2025-06-30', '2025-06-30'),
('645d10bf-5226-4054-bf82-200d5fb24bad', 'App\\Models\\User', 4, 'App\\Notifications\\OrderStatusUpdated', '{\"order_id\":null,\"status\":\"delivered\",\"message\":\"Your order status has been updated to delivered.\",\"updated_at\":\"2025-06-29T08:12:52.978080Z\"}', '0000-00-00', '2025-06-29', '2025-06-29'),
('697a2ef6-9128-42c0-b138-cba4003395d1', 'App\\Models\\User', 1, 'App\\Notifications\\OrderStatusUpdated', '{\"order_id\":8,\"status\":\"picked up\",\"message\":\"Your order status has been updated to picked up.\",\"updated_at\":\"2025-06-29T16:06:13.752315Z\"}', '0000-00-00', '2025-06-29', '2025-06-29'),
('7ccb982f-3c6f-4763-9836-c6cc900d205a', 'App\\Models\\User', 1, 'App\\Notifications\\OrderStatusUpdated', '{\"order_id\":6,\"status\":\"picked up\",\"message\":\"Your order status has been updated to picked up.\",\"updated_at\":\"2025-06-29T15:43:24.176426Z\"}', '0000-00-00', '2025-06-29', '2025-06-29'),
('7f6b5d48-e0d2-4772-83da-1e0b08acdfb8', 'App\\Models\\User', 1, 'App\\Notifications\\OrderStatusUpdated', '{\"order_id\":9,\"status\":\"picked up\",\"message\":\"Your order status has been updated to picked up.\",\"updated_at\":\"2025-06-30T04:30:39.898088Z\"}', '2025-06-30', '2025-06-30', '2025-06-30'),
('9ceb17b8-2748-4a14-be0b-6e11c4298268', 'App\\Models\\User', 1, 'App\\Notifications\\OrderStatusUpdated', '{\"order_id\":7,\"status\":\"picked up\",\"message\":\"Your order status has been updated to picked up.\",\"updated_at\":\"2025-06-30T04:23:01.446768Z\"}', '2025-06-30', '2025-06-30', '2025-06-30'),
('a07fd4cb-278b-48d9-81b0-c2997816a716', 'App\\Models\\User', 1, 'App\\Notifications\\OrderStatusUpdated', '{\"order_id\":8,\"status\":\"picked up\",\"message\":\"Your order status has been updated to picked up.\",\"updated_at\":\"2025-06-29T16:49:06.098926Z\"}', '2025-06-30', '2025-06-29', '2025-06-30'),
('a6eb87fe-5971-4b43-8cec-42d951b3bda9', 'App\\Models\\User', 1, 'App\\Notifications\\OrderStatusUpdated', '{\"order_id\":6,\"status\":\"picked up\",\"message\":\"Your order status has been updated to picked up.\",\"updated_at\":\"2025-06-29T16:15:59.358652Z\"}', '2025-06-29', '2025-06-29', '2025-06-29'),
('b903c70a-3940-4bb2-9d66-5e0fe5d9891a', 'App\\Models\\User', 1, 'App\\Notifications\\OrderStatusUpdated', '{\"order_id\":10,\"status\":\"delivered\",\"message\":\"Your order status has been updated to delivered.\",\"updated_at\":\"2025-06-30T04:31:12.899783Z\"}', '2025-06-30', '2025-06-30', '2025-06-30'),
('ba9c9887-8b29-48dd-8eaf-2c348efb63e9', 'App\\Models\\User', 1, 'App\\Notifications\\OrderStatusUpdated', '{\"order_id\":6,\"status\":\"picked up\",\"message\":\"Your order status has been updated to picked up.\",\"updated_at\":\"2025-06-30T15:36:45.827678Z\"}', '2025-06-30', '2025-06-30', '2025-06-30'),
('bfc0daff-8838-48a5-89d6-7115af89b170', 'App\\Models\\User', 1, 'App\\Notifications\\OrderStatusUpdated', '{\"order_id\":10,\"status\":\"picked up\",\"message\":\"Your order status has been updated to picked up.\",\"updated_at\":\"2025-06-30T04:25:56.993757Z\"}', '2025-06-30', '2025-06-30', '2025-06-30'),
('e9245326-c9b2-4f03-9853-2f2cc64494ee', 'App\\Models\\User', 1, 'App\\Notifications\\OrderStatusUpdated', '{\"order_id\":10,\"status\":\"picked up\",\"message\":\"Your order status has been updated to picked up.\",\"updated_at\":\"2025-06-29T16:18:30.824427Z\"}', '2025-06-29', '2025-06-29', '2025-06-29'),
('ec8fab90-1da0-4d7c-8529-c89fe899fcc4', 'App\\Models\\User', 4, 'App\\Notifications\\OrderStatusUpdated', '{\"order_id\":3,\"status\":\"in transit\",\"message\":\"Your order status has been updated to in transit.\",\"updated_at\":\"2025-06-29T08:14:58.451571Z\"}', '2025-06-29', '2025-06-29', '2025-06-29'),
('f9c1b0fe-a850-4a50-97f9-506dc363b711', 'App\\Models\\User', 1, 'App\\Notifications\\OrderStatusUpdated', '{\"order_id\":5,\"status\":\"delivered\",\"message\":\"Your order status has been updated to delivered.\",\"updated_at\":\"2025-06-29T15:44:24.259915Z\"}', '2025-06-29', '2025-06-29', '2025-06-29'),
('fbbe30a8-5cf5-4c8b-8fd7-0151d672b6ff', 'App\\Models\\User', 1, 'App\\Notifications\\OrderStatusUpdated', '{\"order_id\":7,\"status\":\"picked up\",\"message\":\"Your order status has been updated to picked up.\",\"updated_at\":\"2025-06-30T04:02:30.141858Z\"}', '2025-06-30', '2025-06-30', '2025-06-30');

-- --------------------------------------------------------

--
-- Table structure for table `ordering`
--

CREATE TABLE `ordering` (
  `order_id` int(5) NOT NULL,
  `customer_id` int(5) NOT NULL,
  `runner_type` enum('grab','foodpanda') DEFAULT NULL,
  `runner_id` int(5) DEFAULT NULL,
  `total_amount` decimal(6,2) NOT NULL,
  `status` enum('pending','assigned','picked up','in transit','delivered') NOT NULL,
  `delivery_address` varchar(100) NOT NULL,
  `updated_at` date NOT NULL,
  `created_at` date NOT NULL,
  `payment_method` enum('credit-card','paypal','bank-transfer') NOT NULL DEFAULT 'credit-card'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `ordering`
--

INSERT INTO `ordering` (`order_id`, `customer_id`, `runner_type`, `runner_id`, `total_amount`, `status`, `delivery_address`, `updated_at`, `created_at`, `payment_method`) VALUES
(2, 1, 'grab', 4, 300.00, 'delivered', '100, Jalan Merdeka, Taman Bahagia, 3201 Gomyer', '2025-06-28', '2025-06-28', 'credit-card'),
(3, 4, 'grab', 1, 260.00, 'delivered', '100, Jalan Merdeka, Taman Bahagia, 3201 Gomyer', '2025-06-30', '2025-06-28', 'credit-card'),
(5, 1, 'grab', 1, 10.00, 'picked up', '134, Jalan Merdeka, Taman Bahagia, 3201 Gomyer', '2025-06-30', '2025-06-29', 'credit-card'),
(6, 1, 'grab', 1, 10.00, 'picked up', '110, Jalan Batu, Taman Bahagia, 3201 Gomyer', '2025-06-30', '2025-06-29', 'credit-card'),
(7, 1, 'grab', NULL, 23.00, 'assigned', '56, Jalan Batu, Taman Bahagia, 3201 Gomyer', '2025-06-30', '2025-06-29', 'credit-card'),
(8, 1, 'grab', NULL, 32.00, 'assigned', '98, Jalan Masin, Taman Bahagia, 3201 Gomyer', '2025-06-29', '2025-06-29', 'credit-card'),
(9, 1, 'grab', 1, 41.00, 'picked up', '98, Lorong Nilam, Taman Bahagia, 3201 Gomyer', '2025-06-30', '2025-06-29', 'credit-card'),
(10, 1, 'grab', 1, 18.00, 'delivered', '1, Lorong Nilam, Taman Bahagia, 3201 Gomyer', '2025-06-30', '2025-06-29', 'credit-card'),
(11, 1, 'grab', 7, 56.00, 'delivered', 'test', '2025-06-29', '2025-06-29', 'credit-card'),
(12, 1, 'grab', 7, 8.00, 'in transit', 'test', '2025-06-29', '2025-06-29', 'credit-card'),
(13, 1, 'grab', 7, 3.40, 'in transit', 'test', '2025-06-29', '2025-06-29', 'credit-card'),
(14, 3, NULL, NULL, 105.00, 'assigned', '100, Jalan Merdeka', '0000-00-00', '0000-00-00', 'credit-card');

-- --------------------------------------------------------

--
-- Table structure for table `order_item`
--

CREATE TABLE `order_item` (
  `order_id` int(5) NOT NULL,
  `menu_id` int(5) NOT NULL,
  `quantity` int(5) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `order_item`
--

INSERT INTO `order_item` (`order_id`, `menu_id`, `quantity`) VALUES
(14, 24, 3);

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
  `name` varchar(255) NOT NULL,
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
(1, 'App\\Models\\User', 4, 'api-token', '90736a4e383755aa0427e7bcbb77d4654b7a74b08ef589ab74c0edaa27890726', '[\"*\"]', NULL, NULL, '2025-06-28 05:53:47', '2025-06-28 05:53:47'),
(2, 'App\\Models\\User', 4, 'api-token', 'f5a3b842ee04f657ebfaa3496c30af0f92beb93ce66597106c8a232421ab0b19', '[\"*\"]', NULL, NULL, '2025-06-28 05:59:48', '2025-06-28 05:59:48'),
(3, 'App\\Models\\User', 4, 'api-token', '53286cc6e9c9abd1cb09a0ad520ad3187d7fffe640c690a97621e9e6644fb723', '[\"*\"]', NULL, NULL, '2025-06-29 01:10:15', '2025-06-29 01:10:15'),
(4, 'App\\Models\\User', 4, 'api-token', '73d85ee94e2afb82dd4145a5712fd98a48b22934f80927330bda2ce047878c0a', '[\"*\"]', NULL, NULL, '2025-06-29 01:19:53', '2025-06-29 01:19:53'),
(5, 'App\\Models\\User', 8, 'api-token', 'beac585d4ad06417187a0beb0e48e812c2d8285c7f7e116b24fb37316bc48220', '[\"*\"]', NULL, NULL, '2025-06-29 02:23:18', '2025-06-29 02:23:18'),
(6, 'App\\Models\\User', 8, 'api-token', '65583053c2a341e6d5b2aaa544f548509ce702c339e1e532c52272454f91208c', '[\"*\"]', NULL, NULL, '2025-06-29 02:40:40', '2025-06-29 02:40:40'),
(7, 'App\\Models\\User', 8, 'api-token', 'bfa8e1179b54a391bdb53b178f69b45e5d4a8767b9482ce85da1efd9fd0b71d5', '[\"*\"]', NULL, NULL, '2025-06-29 02:46:24', '2025-06-29 02:46:24'),
(8, 'App\\Models\\User', 8, 'api-token', 'db925c2d360affb22d0c9183dd389823851a9251784fdfc3072e610a35d2cece', '[\"*\"]', NULL, NULL, '2025-06-29 03:02:43', '2025-06-29 03:02:43'),
(9, 'App\\Models\\User', 8, 'api-token', '4cd8bb30d48af942af349842a5faff201257733c2684c537ce37519ce6445d28', '[\"*\"]', NULL, NULL, '2025-06-29 03:07:50', '2025-06-29 03:07:50'),
(10, 'App\\Models\\User', 8, 'api-token', 'ca162b1caeb5c21a60c0acaaf7aa7574f60f8eb408d50da9672a2bb7bb77556e', '[\"*\"]', NULL, NULL, '2025-06-29 05:02:59', '2025-06-29 05:02:59'),
(11, 'App\\Models\\User', 8, 'api-token', '40cdd38727b29b55d45661c8db5a63f139519e509866be70d574183fe769330b', '[\"*\"]', NULL, NULL, '2025-06-29 05:04:35', '2025-06-29 05:04:35'),
(12, 'App\\Models\\User', 7, 'api-token', 'bccc93dd2e21c40c9a4110b75d04bd5c70e715c812b252bb68002c261703229b', '[\"*\"]', NULL, NULL, '2025-06-29 05:08:44', '2025-06-29 05:08:44'),
(13, 'App\\Models\\User', 7, 'api-token', 'd33dc6ece08cf29467f356909ddd3fc77f069eadc7741bc638cf7749114ebb7d', '[\"*\"]', NULL, NULL, '2025-06-29 05:33:14', '2025-06-29 05:33:14'),
(14, 'App\\Models\\User', 7, 'api-token', '4f716230aa338e14ba5a62d81b04c9a8fb32274a17c66e9b9b29b0cffb4478c2', '[\"*\"]', NULL, NULL, '2025-06-29 05:35:57', '2025-06-29 05:35:57'),
(15, 'App\\Models\\User', 7, 'api-token', '17a065308ed891ce0f853b65324b25208d84b4b69aa2146d965cbe0272128ec8', '[\"*\"]', NULL, NULL, '2025-06-29 07:08:14', '2025-06-29 07:08:14'),
(16, 'App\\Models\\User', 7, 'api-token', '41aa1c3267ec636e1ec6a2eded75c5a0defb391581a909bcab2cf8bcfcfae84f', '[\"*\"]', NULL, NULL, '2025-06-29 07:16:28', '2025-06-29 07:16:28'),
(17, 'App\\Models\\User', 7, 'api-token', 'f3ab889a010daf22b70fee80fd9ee2a45d343486d679ce201c3a3e3a56347a55', '[\"*\"]', NULL, NULL, '2025-06-29 07:38:33', '2025-06-29 07:38:33'),
(18, 'App\\Models\\User', 7, 'api-token', 'd187a87350940bce4b92aafa06bcacf5dac5cb621dd3c69b30996e991bb8e18a', '[\"*\"]', NULL, NULL, '2025-06-29 07:42:06', '2025-06-29 07:42:06'),
(19, 'App\\Models\\User', 7, 'api-token', 'ccca9e4272d84d466d02c6ede5e080abd66d4297cf6ac8e185be396f6cc629c9', '[\"*\"]', NULL, NULL, '2025-06-29 08:03:32', '2025-06-29 08:03:32'),
(20, 'App\\Models\\User', 7, 'api-token', '7a2311716c2186a9cc203526bf86f016ca328b6235f745452faa8074220ff873', '[\"*\"]', NULL, NULL, '2025-06-29 08:04:32', '2025-06-29 08:04:32'),
(21, 'App\\Models\\User', 7, 'api-token', '1cc177ad4aa9d24d9e0966fe44877f6a03e9dfaa746f6f69d89fb8b98b0a4596', '[\"*\"]', NULL, NULL, '2025-06-29 08:15:46', '2025-06-29 08:15:46'),
(22, 'App\\Models\\User', 1, 'api-token', '85e16c21ec5af93cf40f77fa472aca43da720903d19a2d7511ab1121d93b52ce', '[\"*\"]', NULL, NULL, '2025-06-29 19:08:13', '2025-06-29 19:08:13'),
(23, 'App\\Models\\User', 1, 'api-token', 'e9a3e0e799d7cef0eef1235b6dcfe5ac2781cf7e4957c6b3fa50ee8b3caeb597', '[\"*\"]', NULL, NULL, '2025-06-29 20:02:05', '2025-06-29 20:02:05'),
(24, 'App\\Models\\User', 1, 'api-token', '8b99aa7823b1d83ddab7186cdd3d3ceef1e3157597d7d5299f04ec138470fc37', '[\"*\"]', NULL, NULL, '2025-06-30 07:36:10', '2025-06-30 07:36:10');

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

--
-- Dumping data for table `sessions`
--

INSERT INTO `sessions` (`id`, `user_id`, `ip_address`, `user_agent`, `payload`, `last_activity`) VALUES
('cNQbeuiphgdAG4hbYVi0sueEyw1F2VPJAwL5UdlJ', NULL, '127.0.0.1', 'PostmanRuntime/7.44.1', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiTzZvNU5aakJxZ2pVN3RkY1o3eFl6d2xBYVJTNFhmYzhsemdLcm1XciI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MjE6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMCI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1751038359),
('eTYrSr5uwW4QqhFKQ3W2rUkMkQWAwPVJqiUP1zqU', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36 Edg/137.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiQzZjZ3ZiYmUyUzRSNWRFME02eEdhVktNQ2tBdGYyWHhzSENNWVcxdSI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MjE6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMCI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1751039496),
('lVmBaoFS7LljjegxlzKkxtMF9VJkj9vk2NdP9seg', NULL, '127.0.0.1', 'PostmanRuntime/7.44.1', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiUEE3b3lwYnA0V1JMYkQyOXBLMjE4SXl4TEI3eGlxV3JYWnBzWkJtSyI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MjE6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMCI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1751118262);

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `user_id` int(5) NOT NULL,
  `username` varchar(20) NOT NULL,
  `password` varchar(1000) NOT NULL,
  `email` varchar(50) NOT NULL,
  `role` enum('customer','staff','runner') NOT NULL,
  `runner_type` enum('grab','food panda') DEFAULT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `remember_token` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `full_name` varchar(255) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `phone_number` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`user_id`, `username`, `password`, `email`, `role`, `runner_type`, `email_verified_at`, `remember_token`, `created_at`, `updated_at`, `full_name`, `address`, `phone_number`) VALUES
(1, 'john lai', '$2y$12$FkE3W0n8DUG6P5Dv3JLfNuDHAuW/pMFXOXQ1JsYdVLRCdg8vM7fge', 'johnlai@gmail.com', 'runner', 'grab', NULL, NULL, '2025-06-29 19:07:49', '2025-06-29 19:07:49', 'John Lai', NULL, NULL),
(2, 'jameswong', '$2y$10$DMIcYT4zbNoSgxSJIr3E5uUqU0ecYuFZ6yMBy9JffS6LeI1BdXYlW', 'jameswong@gmail.com', 'staff', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(3, 'jason', '$argon2id$v=19$m=65536,t=4,p=1$VlAueGN0Ny4uM0pVcWZDSQ$EPaQXxBNQ7uWEjQn30ueChs9Uhte7vrcR82q7zh18LM', 'jason@gmail.com', 'customer', NULL, NULL, NULL, NULL, NULL, 'Jason', '100, Jalan Merdeka', '60123456789'),
(5, 'celine', '$2y$10$aBbwYPml/lMpiMthhAG5tuadqM5EE4Smah/9W7WGGHGj1kPuhbLDG', 'celine@gmail.com', 'staff', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(11, 'Zane Wong', '$2y$10$huNUG.bJtSgbwG8smcxZb.l/708jfOjXhtTRnU1Sftrhyg2duDhDe', 'zanewong1029@gmail.com', 'customer', '', NULL, NULL, NULL, NULL, NULL, 'Jalan Batu B/N, ', '6023457189'),
(12, 'jordan', '$2y$10$Mw2YVPppUKN6YWQSJeP/0Oul6m2QQNd1dTYyYKj6wTOVmMI1Ds.8i', 'jordan@gmail.com', 'staff', '', NULL, NULL, NULL, NULL, 'Jordan', 'Jalan Karang Nilam, ', '60129873456'),
(13, 'calvin', '$2y$10$.rY/.NkA/9rNFNRzExM/J.epejzcyZ0k1kkuvDnkDeoxe/rP4Dnre', 'calvin@gmail.com', 'runner', 'food panda', NULL, NULL, NULL, NULL, 'Calvin', 'Jalan Tengkera', '6092883948'),
(14, 'michael', '$2y$10$aFNcXb1HfcZmSyMMHc0p9.0MuORB/syvSXr8yP.NbsqD4ZO6HXYFq', 'michael@gmail.com', 'runner', 'grab', NULL, NULL, NULL, NULL, 'Michael', 'Jalan Yungsun, Taman Hang', '6015273738');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(1000) NOT NULL,
  `remember_token` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `role` varchar(50) NOT NULL,
  `runner_type` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `email_verified_at`, `password`, `remember_token`, `created_at`, `updated_at`, `role`, `runner_type`) VALUES
(1, 'Test User', 'test@example.com', NULL, '$2y$12$/bUZkiKuuxZxhHZWJJQtwehZokJA23Sm3zjOrikHrgFfJ2j.r/vj2', NULL, '2025-06-27 07:11:55', '2025-06-27 07:11:55', '', ''),
(4, 'Test User', 'shengyiheng2002@gmail.com', NULL, '$2y$12$cxyz4b4LCosjsl1XzR.x6.5f83JWoWi06mBPQlOj1AMvUun4pZuvu', NULL, '2025-06-28 05:43:35', '2025-06-28 05:43:35', 'runner', NULL),
(7, 'testing', 'testing@gmail.com', NULL, '$2y$12$fG/n8F1UulUKGp2vnxJVXOMrLMwaDzJCfBE6XLaHEGoGvShfJFCFi', NULL, '2025-06-29 02:12:12', '2025-06-29 02:12:12', 'runner', 'grab'),
(8, 'myname', 'test@gmail.com', NULL, '$2y$12$JIOAQLCsfzzg/5qeSvSxUuGIfSQOvpFTsHYrbC43pSyQcTn5D7if2', NULL, '2025-06-29 02:23:00', '2025-06-29 02:23:00', 'runner', 'foodpanda');

--
-- Indexes for dumped tables
--

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
-- Indexes for table `menu`
--
ALTER TABLE `menu`
  ADD PRIMARY KEY (`menu_id`);

--
-- Indexes for table `migrations`
--
ALTER TABLE `migrations`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `notifications`
--
ALTER TABLE `notifications`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `ordering`
--
ALTER TABLE `ordering`
  ADD PRIMARY KEY (`order_id`),
  ADD KEY `customer_id` (`customer_id`),
  ADD KEY `runner_id` (`runner_id`);

--
-- Indexes for table `order_item`
--
ALTER TABLE `order_item`
  ADD PRIMARY KEY (`order_id`,`menu_id`),
  ADD KEY `menu_id` (`menu_id`);

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
  ADD KEY `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type`,`tokenable_id`);

--
-- Indexes for table `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `sessions_user_id_index` (`user_id`),
  ADD KEY `sessions_last_activity_index` (`last_activity`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`user_id`);

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
-- AUTO_INCREMENT for table `menu`
--
ALTER TABLE `menu`
  MODIFY `menu_id` int(5) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=29;

--
-- AUTO_INCREMENT for table `migrations`
--
ALTER TABLE `migrations`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `ordering`
--
ALTER TABLE `ordering`
  MODIFY `order_id` int(5) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `user_id` int(5) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `order_item`
--
ALTER TABLE `order_item`
  ADD CONSTRAINT `order_item_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `ordering` (`order_id`),
  ADD CONSTRAINT `order_item_ibfk_2` FOREIGN KEY (`menu_id`) REFERENCES `menu` (`menu_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
