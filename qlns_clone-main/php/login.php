<?php
session_start();
require "connect.php"; // Kết nối CSDL

header("Content-Type: application/json"); // Đảm bảo phản hồi là JSON

file_put_contents("debug.txt", "=== BẮT ĐẦU DEBUG MỚI ===\n");

// Kiểm tra request POST
if ($_SERVER["REQUEST_METHOD"] != "POST") {
    echo json_encode(["status" => "error", "message" => "Không phải request POST"]);
    exit;
}

// Nhận dữ liệu từ form
$email = trim($_POST["email"] ?? "");
$password = trim($_POST["password"] ?? "");

file_put_contents("debug.txt", "Dữ liệu nhận được:\n" . print_r($_POST, true), FILE_APPEND);

// Kiểm tra dữ liệu đầu vào
if (empty($email) || empty($password)) {
    echo json_encode(["status" => "error", "message" => "Vui lòng nhập email và mật khẩu"]);
    exit;
}

// Truy vấn CSDL
$stmt = $conn->prepare("SELECT * FROM nguoidung WHERE Email = ? AND MatKhau = ?");
$stmt->bind_param("ss", $email, $password);
$stmt->execute();
$result = $stmt->get_result();

file_put_contents("debug.txt", "\nSố dòng tìm thấy: " . $result->num_rows . "\n", FILE_APPEND);

if ($result->num_rows > 0) {
    $_SESSION["user"] = $email;
    echo json_encode(["status" => "success", "message" => "Đăng nhập thành công!"]);
} else {
    echo json_encode(["status" => "error", "message" => "Email hoặc mật khẩu không đúng!"]);
}

file_put_contents("debug.txt", "\nTruy vấn SQL: SELECT * FROM nguoidung WHERE Email = '$email' AND MatKhau = '$password'\n", FILE_APPEND);

$stmt->close();
$conn->close();
?>
