<?php
session_start();
require "connect.php"; // Kết nối CSDL

header("Content-Type: application/json"); // Đảm bảo phản hồi là JSON

// Ghi log để debug
file_put_contents("debug.txt", "=== BẮT ĐẦU DEBUG MỚI ===\n", FILE_APPEND);

// Kiểm tra request POST
if ($_SERVER["REQUEST_METHOD"] != "POST") {
    file_put_contents("debug.txt", "❌ Không phải request POST\n", FILE_APPEND);
    echo json_encode(["status" => "error", "message" => "Không phải request POST"]);
    exit;
}

// Nhận dữ liệu từ form
$email = $_POST["email"] ?? "";
$password = $_POST["password"] ?? "";

// Ghi log dữ liệu nhận được
file_put_contents("debug.txt", "🔹 Dữ liệu nhận được từ HTML:\n" . print_r($_POST, true) . "\n", FILE_APPEND);

// Truy vấn CSDL để lấy VaiTro
$sql = "SELECT Email, VaiTro FROM nguoidung WHERE Email = '$email' AND MatKhau = '$password'";
$result = $conn->query($sql);

// Ghi log truy vấn SQL
file_put_contents("debug.txt", "🔹 Truy vấn SQL: $sql\n", FILE_APPEND);
file_put_contents("debug.txt", "🔹 Số dòng tìm thấy: " . $result->num_rows . "\n", FILE_APPEND);

if ($result->num_rows > 0) {
    $row = $result->fetch_assoc();
    $_SESSION["user"] = $email;
    $_SESSION["VaiTro"] = $row["VaiTro"];

    // Kiểm tra vai trò
    $role = (strtolower(trim($row["VaiTro"])) === "quản trị viên") ? "admin" : "not admin";

    // Ghi log trước khi gửi phản hồi
    file_put_contents("debug.txt", "✅ Đăng nhập thành công! Vai trò: " . $role . "\n", FILE_APPEND);

    echo json_encode(["status" => "success", "message" => "Đăng nhập thành công!", "role" => $role]);
} else {
    file_put_contents("debug.txt", "❌ Đăng nhập thất bại: Email hoặc mật khẩu không đúng!\n", FILE_APPEND);
    echo json_encode(["status" => "error", "message" => "Email hoặc mật khẩu không đúng!"]);
}

$conn->close();
?>
