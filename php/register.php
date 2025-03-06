<?php
require "connect.php"; // Kết nối CSDL

error_reporting(E_ALL);
ini_set('display_errors', 1);
header("Content-Type: application/json"); // Đảm bảo phản hồi là JSON

file_put_contents("debug_log.txt", print_r($_POST, true), FILE_APPEND);

// Kiểm tra request POST
if ($_SERVER["REQUEST_METHOD"] != "POST") {
    echo json_encode(["status" => "error", "message" => "Không phải request POST"]);
    exit;
}

// Nhận dữ liệu từ form
$fullname = trim($_POST["fullname"] ?? "");
$email = trim($_POST["email"] ?? "");
$password = trim($_POST["password"] ?? "");

file_put_contents("debug.txt", "Dữ liệu nhận được:\n" . print_r($_POST, true), FILE_APPEND);

// Kiểm tra dữ liệu đầu vào
if (empty($fullname) || empty($email) || empty($password)) {
    echo json_encode(["status" => "error", "message" => "Vui lòng nhập đầy đủ thông tin!"]);
    exit;
}

// Kiểm tra email đã tồn tại chưa
$stmt = $conn->prepare("SELECT * FROM nguoidung WHERE Email = ?");
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    echo json_encode(["status" => "error", "message" => "Email đã tồn tại!"]);
    exit;
}
$stmt->close();

// 🌟 Tạo MaNguoiDung tự động (ND01, ND02, ...)
$sql = "SELECT MaNguoiDung FROM nguoidung ORDER BY MaNguoiDung DESC LIMIT 1";
$result = $conn->query($sql);
$lastMaNguoiDung = $result->fetch_assoc()['MaNguoiDung'] ?? 'ND00'; // Nếu chưa có dữ liệu, bắt đầu từ ND00
$newMaNguoiDung = 'ND' . str_pad((int)substr($lastMaNguoiDung, 2) + 1, 2, '0', STR_PAD_LEFT);

// 🌟 Chèn dữ liệu vào bảng nguoidung
$stmt = $conn->prepare("INSERT INTO nguoidung (MaNguoiDung, HoTen, Email, MatKhau) VALUES (?, ?, ?, ?)");
$stmt->bind_param("ssss", $newMaNguoiDung, $fullname, $email, $password);

if ($stmt->execute()) {
    echo json_encode(["status" => "success", "message" => "Đăng ký thành công!"]);
} else {
    echo json_encode(["status" => "error", "message" => "Đăng ký thất bại, thử lại sau!"]);
}

file_put_contents("debug.txt", "\nTruy vấn SQL: INSERT INTO nguoidung (MaNguoiDung, HoTen, Email, MatKhau) VALUES ('$newMaNguoiDung', '$fullname', '$email', '$password')\n", FILE_APPEND);

$stmt->close();
$conn->close();
?>
