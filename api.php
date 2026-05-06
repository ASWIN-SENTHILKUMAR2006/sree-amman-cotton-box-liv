<?php
/**
 * ============================================
 * SREE AMMAN PACKERS — PHP API Backend
 * ============================================
 * Single-file REST API replacing the Python Flask backend.
 * Requires: PHP 7.4+, MySQL (via XAMPP), PDO extension.
 *
 * Place this file alongside your HTML/CSS/JS files in htdocs.
 * Import database.sql into MySQL before first use.
 * ============================================
 */

// ─── CORS HEADERS ────────────────────────────────────────────
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PATCH, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Authorization, Content-Type');
header('Content-Type: application/json; charset=utf-8');

// Handle preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// ─── CONFIG ──────────────────────────────────────────────────
define('DB_HOST', 'localhost');
define('DB_NAME', 'amman_cotton_box');
define('DB_USER', 'root');
define('DB_PASS', '');
define('UPLOAD_DIR', __DIR__ . '/images/');
define('ALLOWED_EXTS', ['jpg', 'jpeg', 'png', 'webp', 'gif']);

// ─── DATABASE ────────────────────────────────────────────────
function getDB() {
    static $pdo = null;
    if ($pdo === null) {
        $dsn = 'mysql:host=' . DB_HOST . ';dbname=' . DB_NAME . ';charset=utf8mb4';
        $pdo = new PDO($dsn, DB_USER, DB_PASS, [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false,
        ]);
        initDB($pdo);
    }
    return $pdo;
}

// Ensure superadmin exists with correct password hash
function initDB($pdo) {
    $email = 'sapackers@gmail.com';
    $correctHash = hash('sha256', 'amman@123');
    $stmt = $pdo->prepare("SELECT id, password_hash FROM admin_user WHERE email = ?");
    $stmt->execute([$email]);
    $user = $stmt->fetch();
    if (!$user) {
        $pdo->prepare("INSERT INTO admin_user (email, password_hash, name, role) VALUES (?, ?, ?, ?)")
            ->execute([$email, $correctHash, 'SA Packers Admin', 'superadmin']);
    } elseif ($user['password_hash'] !== $correctHash) {
        $pdo->prepare("UPDATE admin_user SET password_hash = ? WHERE id = ?")
            ->execute([$correctHash, $user['id']]);
    }
}

// ─── HELPERS ─────────────────────────────────────────────────
function hashPw($pw) {
    return hash('sha256', $pw);
}

function genToken() {
    return bin2hex(random_bytes(32));
}

function jsonResponse($data, $code = 200) {
    http_response_code($code);
    echo json_encode($data, JSON_UNESCAPED_UNICODE);
    exit;
}

function getJsonBody() {
    $raw = file_get_contents('php://input');
    return json_decode($raw, true) ?: [];
}

function getAuthorizationHeader() {
    // Standard
    if (!empty($_SERVER['HTTP_AUTHORIZATION'])) return $_SERVER['HTTP_AUTHORIZATION'];
    // Apache redirect
    if (!empty($_SERVER['REDIRECT_HTTP_AUTHORIZATION'])) return $_SERVER['REDIRECT_HTTP_AUTHORIZATION'];
    // Apache module
    if (function_exists('apache_request_headers')) {
        $headers = apache_request_headers();
        if (isset($headers['Authorization'])) return $headers['Authorization'];
        if (isset($headers['authorization'])) return $headers['authorization'];
    }
    // getallheaders fallback
    if (function_exists('getallheaders')) {
        $headers = getallheaders();
        if (isset($headers['Authorization'])) return $headers['Authorization'];
        if (isset($headers['authorization'])) return $headers['authorization'];
    }
    return '';
}

function requireAuth() {
    $header = getAuthorizationHeader();
    $token = str_replace('Bearer ', '', trim($header));
    if (empty($token)) {
        jsonResponse(['error' => 'Unauthorized'], 401);
    }
    $db = getDB();
    $stmt = $db->prepare(
        "SELECT s.user_id, u.email, u.name, u.role
         FROM admin_session s
         JOIN admin_user u ON u.id = s.user_id
         WHERE s.token = ? AND s.expires_at > NOW()"
    );
    $stmt->execute([$token]);
    $user = $stmt->fetch();
    if (!$user) {
        jsonResponse(['error' => 'Session expired or invalid'], 401);
    }
    return $user;
}

// ─── ROUTING ─────────────────────────────────────────────────
$action = $_GET['action'] ?? '';
$method = $_SERVER['REQUEST_METHOD'];
$id = isset($_GET['id']) ? intval($_GET['id']) : 0;

switch ($action) {

    // ═══════════════════════════════════════════════════════════
    // PUBLIC: Get Products
    // ═══════════════════════════════════════════════════════════
    case 'products':
        if ($method !== 'GET') jsonResponse(['error' => 'Method not allowed'], 405);
        $db = getDB();
        $q = "SELECT * FROM product WHERE 1=1";
        $params = [];

        if (!empty($_GET['ply'])) {
            $plys = explode(',', $_GET['ply']);
            $placeholders = implode(',', array_fill(0, count($plys), '?'));
            $q .= " AND ply_type IN ($placeholders)";
            $params = array_merge($params, $plys);
        }
        if (!empty($_GET['color'])) {
            $colors = explode(',', $_GET['color']);
            $placeholders = implode(',', array_fill(0, count($colors), '?'));
            $q .= " AND color IN ($placeholders)";
            $params = array_merge($params, $colors);
        }

        $stmt = $db->prepare($q);
        $stmt->execute($params);
        $rows = $stmt->fetchAll();

        // Add image HTML like the Python backend does
        foreach ($rows as &$p) {
            $img = $p['image_url'] ?? '';
            $p['image_url'] = "<img src='{$img}' alt='Box' style='width:100%;height:100%;object-fit:cover;border-radius:8px;'>";
        }
        unset($p);

        jsonResponse($rows);
        break;

    // ═══════════════════════════════════════════════════════════
    // AUTH: Login
    // ═══════════════════════════════════════════════════════════
    case 'auth_login':
        if ($method !== 'POST') jsonResponse(['error' => 'Method not allowed'], 405);
        $data = getJsonBody();
        $email = strtolower(trim($data['email'] ?? ''));
        $pw = $data['password'] ?? '';

        $db = getDB();
        $stmt = $db->prepare("SELECT * FROM admin_user WHERE email = ? AND password_hash = ?");
        $stmt->execute([$email, hashPw($pw)]);
        $user = $stmt->fetch();

        if (!$user) {
            jsonResponse(['error' => 'Invalid email or password'], 401);
        }

        $token = genToken();
        $expires = date('Y-m-d H:i:s', strtotime('+1 day'));
        $stmt = $db->prepare("INSERT INTO admin_session (token, user_id, expires_at) VALUES (?, ?, ?)");
        $stmt->execute([$token, $user['id'], $expires]);

        jsonResponse([
            'token' => $token,
            'name'  => $user['name'],
            'email' => $user['email'],
            'role'  => $user['role'],
        ]);
        break;

    // ═══════════════════════════════════════════════════════════
    // AUTH: Logout
    // ═══════════════════════════════════════════════════════════
    case 'auth_logout':
        if ($method !== 'POST') jsonResponse(['error' => 'Method not allowed'], 405);
        $admin = requireAuth();
        $header = getAuthorizationHeader();
        $token = str_replace('Bearer ', '', trim($header));
        $db = getDB();
        $db->prepare("DELETE FROM admin_session WHERE token = ?")->execute([$token]);
        jsonResponse(['message' => 'Logged out']);
        break;

    // ═══════════════════════════════════════════════════════════
    // AUTH: Me (current user info)
    // ═══════════════════════════════════════════════════════════
    case 'auth_me':
        if ($method !== 'GET') jsonResponse(['error' => 'Method not allowed'], 405);
        $admin = requireAuth();
        jsonResponse($admin);
        break;

    // ═══════════════════════════════════════════════════════════
    // AUTH: Forgot Password
    // ═══════════════════════════════════════════════════════════
    case 'auth_forgot_password':
        if ($method !== 'POST') jsonResponse(['error' => 'Method not allowed'], 405);
        $data = getJsonBody();
        $email = strtolower(trim($data['email'] ?? ''));

        $db = getDB();
        $stmt = $db->prepare("SELECT id FROM admin_user WHERE email = ?");
        $stmt->execute([$email]);
        if (!$stmt->fetch()) {
            jsonResponse(['error' => 'No admin account with that email'], 404);
        }

        $token = strtoupper(bin2hex(random_bytes(4)));
        $expires = date('Y-m-d H:i:s', strtotime('+1 hour'));
        $db->prepare("DELETE FROM password_reset WHERE email = ?")->execute([$email]);
        $db->prepare("INSERT INTO password_reset (token, email, expires_at) VALUES (?, ?, ?)")
            ->execute([$token, $email, $expires]);

        jsonResponse(['message' => 'Reset token generated', 'reset_token' => $token]);
        break;

    // ═══════════════════════════════════════════════════════════
    // AUTH: Reset Password
    // ═══════════════════════════════════════════════════════════
    case 'auth_reset_password':
        if ($method !== 'POST') jsonResponse(['error' => 'Method not allowed'], 405);
        $data = getJsonBody();
        $token = strtoupper(trim($data['token'] ?? ''));
        $newPw = $data['new_password'] ?? '';

        if (strlen($newPw) < 6) {
            jsonResponse(['error' => 'Password must be at least 6 characters'], 400);
        }

        $db = getDB();
        $stmt = $db->prepare("SELECT * FROM password_reset WHERE token = ? AND expires_at > NOW()");
        $stmt->execute([$token]);
        $reset = $stmt->fetch();

        if (!$reset) {
            jsonResponse(['error' => 'Invalid or expired reset token'], 400);
        }

        $db->prepare("UPDATE admin_user SET password_hash = ? WHERE email = ?")
            ->execute([hashPw($newPw), $reset['email']]);
        $db->prepare("DELETE FROM password_reset WHERE token = ?")->execute([$token]);

        jsonResponse(['message' => 'Password reset successfully']);
        break;

    // ═══════════════════════════════════════════════════════════
    // ADMIN: List Users
    // ═══════════════════════════════════════════════════════════
    case 'admin_users':
        if ($method !== 'GET') jsonResponse(['error' => 'Method not allowed'], 405);
        $admin = requireAuth();
        $db = getDB();
        $stmt = $db->query("SELECT id, email, name, role, created_at FROM admin_user ORDER BY id");
        jsonResponse($stmt->fetchAll());
        break;

    // ═══════════════════════════════════════════════════════════
    // ADMIN: Create User
    // ═══════════════════════════════════════════════════════════
    case 'admin_users_create':
        if ($method !== 'POST') jsonResponse(['error' => 'Method not allowed'], 405);
        $admin = requireAuth();
        if (($admin['role'] ?? '') !== 'superadmin') {
            jsonResponse(['error' => 'Only superadmin can create users'], 403);
        }

        $data = getJsonBody();
        try {
            $db = getDB();
            $stmt = $db->prepare("INSERT INTO admin_user (email, password_hash, name, role) VALUES (?, ?, ?, ?)");
            $stmt->execute([
                strtolower($data['email'] ?? ''),
                hashPw($data['password'] ?? ''),
                $data['name'] ?? '',
                $data['role'] ?? 'admin',
            ]);
            jsonResponse(['message' => 'User created'], 201);
        } catch (Exception $e) {
            jsonResponse(['error' => $e->getMessage()], 400);
        }
        break;

    // ═══════════════════════════════════════════════════════════
    // ADMIN: Delete User
    // ═══════════════════════════════════════════════════════════
    case 'admin_users_delete':
        if ($method !== 'DELETE') jsonResponse(['error' => 'Method not allowed'], 405);
        $admin = requireAuth();
        if (($admin['role'] ?? '') !== 'superadmin') {
            jsonResponse(['error' => 'Only superadmin can delete users'], 403);
        }

        $db = getDB();
        $db->prepare("DELETE FROM admin_user WHERE id = ?")->execute([$id]);
        $db->prepare("DELETE FROM admin_session WHERE user_id = ?")->execute([$id]);
        jsonResponse(['message' => 'User deleted']);
        break;

    // ═══════════════════════════════════════════════════════════
    // ADMIN: List Products
    // ═══════════════════════════════════════════════════════════
    case 'admin_products':
        if ($method !== 'GET') jsonResponse(['error' => 'Method not allowed'], 405);
        $admin = requireAuth();
        $db = getDB();
        $stmt = $db->query("SELECT * FROM product ORDER BY ply_type, name");
        jsonResponse($stmt->fetchAll());
        break;

    // ═══════════════════════════════════════════════════════════
    // ADMIN: Create Product
    // ═══════════════════════════════════════════════════════════
    case 'admin_products_create':
        if ($method !== 'POST') jsonResponse(['error' => 'Method not allowed'], 405);
        $admin = requireAuth();
        $d = getJsonBody();
        try {
            $db = getDB();
            $stmt = $db->prepare(
                "INSERT INTO product (name, ply_type, color, length, width, height, price_estimate, image_url)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?)"
            );
            $stmt->execute([
                $d['name'] ?? '',
                intval($d['ply_type'] ?? 3),
                $d['color'] ?? 'Brown',
                floatval($d['length'] ?? 0),
                floatval($d['width'] ?? 0),
                floatval($d['height'] ?? 0),
                floatval($d['price_estimate'] ?? 0),
                $d['image_url'] ?? '',
            ]);
            jsonResponse(['message' => 'Product added'], 201);
        } catch (Exception $e) {
            jsonResponse(['error' => $e->getMessage()], 400);
        }
        break;

    // ═══════════════════════════════════════════════════════════
    // ADMIN: Update Product
    // ═══════════════════════════════════════════════════════════
    case 'admin_products_update':
        if ($method !== 'PATCH') jsonResponse(['error' => 'Method not allowed'], 405);
        $admin = requireAuth();
        $d = getJsonBody();
        try {
            $db = getDB();
            $fields = [];
            $vals = [];
            $allowed = ['name', 'ply_type', 'color', 'length', 'width', 'height', 'price_estimate', 'image_url'];
            foreach ($allowed as $f) {
                if (array_key_exists($f, $d)) {
                    $fields[] = "$f = ?";
                    if (in_array($f, ['length', 'width', 'height', 'price_estimate'])) {
                        $vals[] = floatval($d[$f]);
                    } elseif ($f === 'ply_type') {
                        $vals[] = intval($d[$f]);
                    } else {
                        $vals[] = $d[$f];
                    }
                }
            }
            if (empty($fields)) {
                jsonResponse(['error' => 'No fields to update'], 400);
            }
            $vals[] = $id;
            $sql = "UPDATE product SET " . implode(', ', $fields) . " WHERE id = ?";
            $db->prepare($sql)->execute($vals);
            jsonResponse(['message' => 'Product updated']);
        } catch (Exception $e) {
            jsonResponse(['error' => $e->getMessage()], 400);
        }
        break;

    // ═══════════════════════════════════════════════════════════
    // ADMIN: Delete Product
    // ═══════════════════════════════════════════════════════════
    case 'admin_products_delete':
        if ($method !== 'DELETE') jsonResponse(['error' => 'Method not allowed'], 405);
        $admin = requireAuth();
        $db = getDB();
        $db->prepare("DELETE FROM product WHERE id = ?")->execute([$id]);
        jsonResponse(['message' => 'Product deleted']);
        break;

    // ═══════════════════════════════════════════════════════════
    // PUBLIC: Submit Quote
    // ═══════════════════════════════════════════════════════════
    case 'quotes_submit':
        if ($method !== 'POST') jsonResponse(['error' => 'Method not allowed'], 405);
        $data = getJsonBody();
        try {
            $db = getDB();
            $stmt = $db->prepare(
                "INSERT INTO quote_request (customer_name, customer_email, customer_phone, company, city, delivery_timeline, notes)
                 VALUES (?, ?, ?, ?, ?, ?, ?)"
            );
            $stmt->execute([
                $data['name'] ?? 'Guest',
                $data['email'] ?? 'N/A',
                $data['phone'] ?? 'N/A',
                $data['company'] ?? '',
                $data['city'] ?? '',
                $data['delivery_timeline'] ?? '',
                $data['notes'] ?? '',
            ]);
            $qid = intval($db->lastInsertId());

            $itemStmt = $db->prepare("INSERT INTO quote_item (quote_id, product_id, quantity) VALUES (?, ?, ?)");
            foreach (($data['items'] ?? []) as $item) {
                $itemStmt->execute([$qid, intval($item['product_id']), intval($item['quantity'])]);
            }

            jsonResponse(['message' => 'Quote submitted', 'quote_id' => $qid], 201);
        } catch (Exception $e) {
            jsonResponse(['error' => $e->getMessage()], 400);
        }
        break;

    // ═══════════════════════════════════════════════════════════
    // ADMIN: List Quotes
    // ═══════════════════════════════════════════════════════════
    case 'quotes_list':
        if ($method !== 'GET') jsonResponse(['error' => 'Method not allowed'], 405);
        $admin = requireAuth();
        $db = getDB();
        $quotes = $db->query("SELECT * FROM quote_request ORDER BY created_at DESC")->fetchAll();

        $itemStmt = $db->prepare(
            "SELECT qi.quantity, p.name, p.ply_type, p.price_estimate
             FROM quote_item qi
             JOIN product p ON p.id = qi.product_id
             WHERE qi.quote_id = ?"
        );

        foreach ($quotes as &$q) {
            $itemStmt->execute([$q['id']]);
            $q['items'] = $itemStmt->fetchAll();
        }
        unset($q);

        jsonResponse($quotes);
        break;

    // ═══════════════════════════════════════════════════════════
    // ADMIN: Update Quote Status
    // ═══════════════════════════════════════════════════════════
    case 'quotes_status':
        if ($method !== 'PATCH') jsonResponse(['error' => 'Method not allowed'], 405);
        $admin = requireAuth();
        $data = getJsonBody();
        $status = $data['status'] ?? 'Pending';
        $valid = ['Pending', 'Reviewed', 'Confirmed', 'Rejected'];
        if (!in_array($status, $valid)) {
            jsonResponse(['error' => 'Invalid status'], 400);
        }
        $db = getDB();
        $db->prepare("UPDATE quote_request SET status = ? WHERE id = ?")->execute([$status, $id]);
        jsonResponse(['message' => 'Status updated']);
        break;

    // ═══════════════════════════════════════════════════════════
    // PUBLIC: Track Quote
    // ═══════════════════════════════════════════════════════════
    case 'quotes_track':
        if ($method !== 'GET') jsonResponse(['error' => 'Method not allowed'], 405);
        $db = getDB();
        $stmt = $db->prepare(
            "SELECT id, customer_name, status, created_at, delivery_timeline, city
             FROM quote_request WHERE id = ?"
        );
        $stmt->execute([$id]);
        $q = $stmt->fetch();
        if (!$q) {
            jsonResponse(['error' => 'Quote not found. Please check your quote ID.'], 404);
        }

        $itemStmt = $db->prepare(
            "SELECT p.name, p.ply_type, qi.quantity
             FROM quote_item qi
             JOIN product p ON p.id = qi.product_id
             WHERE qi.quote_id = ?"
        );
        $itemStmt->execute([$id]);
        $q['items'] = $itemStmt->fetchAll();

        jsonResponse($q);
        break;

    // ═══════════════════════════════════════════════════════════
    // ADMIN: Analytics
    // ═══════════════════════════════════════════════════════════
    case 'admin_analytics':
        if ($method !== 'GET') jsonResponse(['error' => 'Method not allowed'], 405);
        $admin = requireAuth();
        $db = getDB();

        // By status
        $byStatus = [];
        $rows = $db->query("SELECT status, COUNT(*) as cnt FROM quote_request GROUP BY status")->fetchAll();
        foreach ($rows as $r) {
            $byStatus[$r['status']] = intval($r['cnt']);
        }

        // Daily quotes (last 30 days)
        $daily = $db->query(
            "SELECT DATE(created_at) as day, COUNT(*) as cnt
             FROM quote_request
             WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
             GROUP BY day ORDER BY day"
        )->fetchAll();

        // Top products
        $topProducts = $db->query(
            "SELECT p.name, SUM(qi.quantity) as total
             FROM quote_item qi
             JOIN product p ON p.id = qi.product_id
             GROUP BY p.id ORDER BY total DESC LIMIT 6"
        )->fetchAll();

        // Revenue estimate
        $revRow = $db->query(
            "SELECT COALESCE(SUM(p.price_estimate * qi.quantity), 0) as rev
             FROM quote_item qi
             JOIN product p ON p.id = qi.product_id"
        )->fetch();

        jsonResponse([
            'by_status'        => $byStatus,
            'daily_quotes'     => $daily,
            'top_products'     => $topProducts,
            'revenue_estimate' => round(floatval($revRow['rev']), 2),
        ]);
        break;

    // ═══════════════════════════════════════════════════════════
    // ADMIN: Upload Image
    // ═══════════════════════════════════════════════════════════
    case 'admin_upload_image':
        if ($method !== 'POST') jsonResponse(['error' => 'Method not allowed'], 405);
        $admin = requireAuth();

        if (!isset($_FILES['file']) || $_FILES['file']['error'] !== UPLOAD_ERR_OK) {
            jsonResponse(['error' => 'No file provided'], 400);
        }

        $file = $_FILES['file'];
        $originalName = $file['name'];
        if (empty($originalName)) {
            jsonResponse(['error' => 'Empty filename'], 400);
        }

        $ext = strtolower(pathinfo($originalName, PATHINFO_EXTENSION));
        if (!in_array($ext, ALLOWED_EXTS)) {
            jsonResponse(['error' => "File type .$ext not allowed. Use: jpg, png, webp, gif"], 400);
        }

        // Create images dir if needed
        if (!is_dir(UPLOAD_DIR)) {
            mkdir(UPLOAD_DIR, 0755, true);
        }

        $safeName = bin2hex(random_bytes(8)) . '.' . $ext;
        $savePath = UPLOAD_DIR . $safeName;

        if (!move_uploaded_file($file['tmp_name'], $savePath)) {
            jsonResponse(['error' => 'Failed to save file'], 500);
        }

        jsonResponse(['url' => 'images/' . $safeName, 'filename' => $safeName]);
        break;

    // ═══════════════════════════════════════════════════════════
    // DEFAULT: Unknown action
    // ═══════════════════════════════════════════════════════════
    default:
        jsonResponse(['error' => 'Unknown action: ' . $action, 'available_actions' => [
            'products', 'auth_login', 'auth_logout', 'auth_me',
            'auth_forgot_password', 'auth_reset_password',
            'admin_users', 'admin_users_create', 'admin_users_delete',
            'admin_products', 'admin_products_create', 'admin_products_update', 'admin_products_delete',
            'quotes_submit', 'quotes_list', 'quotes_status', 'quotes_track',
            'admin_analytics', 'admin_upload_image',
        ]], 400);
        break;
}
