<?php
header("Content-Type: application/json");
require "connect.php"; // Kết nối CSDL

$action = $_GET['action'];

$sql = "SELECT MaNV, TenNV, GioiTinh, NgaySinh, DiaChi, Email, Sdt, ChucVu, Phongban, Luong, HanhDong FROM nhanvien";
$result = $conn->query($sql);

switch ($action) {
    case 'get':
        getPositions($conn);
        break;
    case 'add':
        addPosition($conn);
        break;
    case 'update':
        updatePosition($conn);
        break;
    case 'delete':
        deletePosition($conn);
        break;
    default:
        echo json_encode(["success" => false, "message" => "Invalid action"]);
        break;
}

$conn->close();

function getEmployeeEmployee($conn) {
    $sql = "SELECT MaNV, TenNV, GioiTinh, NgaySinh, DiaChi, Email, Sdt, ChucVu, Phongban, Luong, HanhDong FROM nhanvien";
    $result = $conn->query($sql); 

    $positions = [];

    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $positions[] = $row;
        }
    }

    echo json_encode($positions);
}
function addEmployeeEmployee($conn) {
    $data = json_decode(file_get_contents("php://input"), true);
    $tenNhanVien = $data['tenNhanVien'];

       // Tạo MaNhanVienNhanVien tự động
       $sql = "SELECT MaNhanVien FROM NhanVien ORDER BY MaNhanVien DESC LIMIT 1";
       $result = $conn->query($sql);
       $lastMaNhanVien = $result->fetch_assoc()['MaChucVu'];
       $newMaNhanVien = 'NV' . str_pad((int)substr($lastMaNhanVien, 2) + 1, 2, '00', STR_PAD_LEFT);
   
       $sql = "INSERT INTO nhanvien (MaNhanVien, TenNhanVien, ) VALUES ('$newMaNhanVien', '$tenNhanVien')";
   
       if ($conn->query($sql) === TRUE) {
           echo json_encode(["success" => true]);
       } else {
           echo json_encode(["success" => false, "message" => $conn->error]);
       }
   }
   
function updatePosition($conn) {
    $data = json_decode(file_get_contents("php://input"), true);
    $maNhanVien = $data['maNhanVien'];
    $tenNhanVien = $data['tenNhanVien'];

    $sql = "UPDATE nhanvien SET TenNhanVien='$tenNhanVien' WHERE MaNhanVien='$maNhanVien'";

    if ($conn->query($sql) === TRUE) {
        echo json_encode(["success" => true]);
    } else {
        echo json_encode(["success" => false, "message" => $conn->error]);
    }
}

function deletePosition($conn) {
    $data = json_decode(file_get_contents("php://input"), true);
    $maNhanVien = $data['maNhanVien'];

    $sql = "DELETE FROM nhanvien WHERE MaNhanVien='$maNhanVien'";

    if ($conn->query($sql) === TRUE) {
        echo json_encode(["success" => true]);
    } else {
        echo json_encode(["success" => false, "message" => $conn->error]);
    }
}
?>