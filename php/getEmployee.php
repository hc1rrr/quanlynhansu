<?php
header("Content-Type: application/json");
require "connect.php"; // Đảm bảo file này đã đúng thông tin kết nối CSDL

if ($conn->connect_error) {
    echo json_encode(["success" => false, "message" => "Kết nối CSDL thất bại: " . $conn->connect_error]);
    exit;
}

// Lấy action từ query ?action=
$action = $_GET['action'] ?? null;

if (!$action) {
    echo json_encode(["success" => false, "message" => "Thiếu action"]);
    exit;
}

switch ($action) {
    case 'get':
        getEmployee($conn);
        break;
    case 'add':
        addEmployee($conn);
        break;
    case 'update':
        updateEmployee($conn);
        break;
    case 'delete':
        deleteEmployee($conn);
        break;
    default:
        echo json_encode(["success" => false, "message" => "Hành động không hợp lệ", "action" => $action]);
}

$conn->close();

// Hàm lấy danh sách nhân viên
function getEmployee($conn) {
    $sql = "SELECT MaNhanVien, HoTen, GioiTinh, NgaySinh, DiaChi, Email, SDT, MaChucVu, MaPhongban FROM nhanvien";
    $result = $conn->query($sql);

    $employees = [];
    while ($row = $result->fetch_assoc()) {
        $employees[] = $row;
    }

    echo json_encode(["success" => true, "data" => $employees]);
}

// Hàm thêm nhân viên
function addEmployee($conn) {
    $data = json_decode(file_get_contents("php://input"), true);

    if (empty($data['tenNhanVien'])) {
        echo json_encode(["success" => false, "message" => "Thiếu tên nhân viên"]);
        return;
    }

    function generateEmployeeId($conn) {
        $sql = "SELECT MaNhanVien FROM nhanvien ORDER BY MaNhanVien DESC LIMIT 1";
        $result = $conn->query($sql);
    
        if ($result->num_rows > 0) {
            $lastId = $result->fetch_assoc()['MaNhanVien']; // VD: NV015
            $number = (int) substr($lastId, 2); // Lấy ra phần số 015
            $newNumber = $number + 1; // Tăng số lên 1
            return 'NV' . str_pad($newNumber, 3, '0', STR_PAD_LEFT); // Trả về dạng NV001, NV002, ...
        } else {
            return 'NV001'; // Nếu chưa có ai thì là NV001
        }
    }
    
}

// Hàm cập nhật thông tin nhân viên
function updateEmployee($conn) {
    $data = json_decode(file_get_contents("php://input"), true);

    if (empty($data['maNhanVien']) || empty($data['tenNhanVien'])) {
        echo json_encode(["success" => false, "message" => "Thiếu mã hoặc tên nhân viên"]);
        return;
    }

    $maNhanVien = $conn->real_escape_string($data['maNhanVien']);
    $tenNhanVien = $conn->real_escape_string($data['tenNhanVien']);

    $sql = "UPDATE nhanvien SET HoTen='$tenNhanVien' WHERE MaNhanVien='$maNhanVien'";

    if ($conn->query($sql) === TRUE) {
        echo json_encode(["success" => true, "message" => "Cập nhật thành công"]);
    } else {
        echo json_encode(["success" => false, "message" => "Lỗi: " . $conn->error]);
    }
}

// Hàm xóa nhân viên
function deleteEmployee($conn) {
    $data = json_decode(file_get_contents("php://input"), true);

    if (empty($data['maNhanVien'])) {
        echo json_encode(["success" => false, "message" => "Thiếu mã nhân viên"]);
        return;
    }

    $maNhanVien = $conn->real_escape_string($data['maNhanVien']);
    $sql = "DELETE FROM nhanvien WHERE MaNhanVien='$maNhanVien'";

    if ($conn->query($sql) === TRUE) {
        echo json_encode(["success" => true, "message" => "Xóa thành công"]);
    } else {
        echo json_encode(["success" => false, "message" => "Lỗi: " . $conn->error]);
    }
}

// Hàm sinh Mã Nhân Viên tự động
function generateEmployeeId($conn) {
    $sql = "SELECT MaNhanVien FROM nhanvien ORDER BY MaNhanVien DESC LIMIT 1";
    $result = $conn->query($sql);

    if ($result->num_rows > 0) {
        $lastId = $result->fetch_assoc()['MaNhanVien'];
        $number = (int) substr($lastId, 2) + 1; // Bỏ 'NV' và +1
        return 'NV' . str_pad($number, 4, '0', STR_PAD_LEFT);
    } else {
        return 'NV0001'; // Trường hợp chưa có ai
    }
}
?>
