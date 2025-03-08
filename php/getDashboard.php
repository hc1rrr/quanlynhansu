<?php
require "connect.php"; // Kết nối CSDL

header("Content-Type: application/json"); // Định dạng JSON

// Mở file debug
file_put_contents("debug.txt2", "=== BẮT ĐẦU DEBUG MỚI ===\n");

// Truy vấn số lượng nhân viên từ bảng nhanvien
$sqlEmployee = "SELECT COUNT(*) AS total FROM nhanvien";
$resultEmployee = $conn->query($sqlEmployee);
$employeeCount = ($resultEmployee->num_rows > 0) ? $resultEmployee->fetch_assoc()["total"] : 0;
file_put_contents("debug.txt2", "Số nhân viên: $employeeCount\n", FILE_APPEND);

// Truy vấn số lượng chức vụ từ bảng chucvu
$sqlPosition = "SELECT COUNT(*) AS total FROM chucvu";
$resultPosition = $conn->query($sqlPosition);
$positionCount = ($resultPosition->num_rows > 0) ? $resultPosition->fetch_assoc()["total"] : 0;
file_put_contents("debug.txt2", "Số chức vụ: $positionCount\n", FILE_APPEND);

// Truy vấn số lượng phòng ban từ bảng phongban
$sqlDepartment = "SELECT COUNT(*) AS total FROM phongban";
$resultDepartment = $conn->query($sqlDepartment);
$departmentCount = ($resultDepartment->num_rows > 0) ? $resultDepartment->fetch_assoc()["total"] : 0;
file_put_contents("debug.txt2", "Số phòng ban: $departmentCount\n", FILE_APPEND);

// Truy vấn danh sách chức vụ và số lượng nhân viên theo chức vụ
$sqlPositions = "SELECT chucvu.TenChucVu, COUNT(nhanvien.MaNhanVien) AS SoLuong 
                 FROM chucvu 
                 LEFT JOIN nhanvien ON chucvu.MaChucVu = nhanvien.MaChucVu 
                 GROUP BY chucvu.MaChucVu";
$resultPositions = $conn->query($sqlPositions);
$positions = [];
while ($row = $resultPositions->fetch_assoc()) {
    $positions[$row["TenChucVu"]] = $row["SoLuong"];
}
file_put_contents("debug.txt2", "Danh sách chức vụ: " . print_r($positions, true) . "\n", FILE_APPEND);

// Truy vấn danh sách phòng ban và số lượng nhân viên theo phòng ban
$sqlDepartments = "SELECT phongban.TenPhongBan, COUNT(nhanvien.MaNhanVien) AS SoLuong 
                   FROM phongban 
                   LEFT JOIN nhanvien ON phongban.MaPhongBan = nhanvien.MaPhongBan 
                   GROUP BY phongban.MaPhongBan";
$resultDepartments = $conn->query($sqlDepartments);
$departments = [];
while ($row = $resultDepartments->fetch_assoc()) {
    $departments[$row["TenPhongBan"]] = $row["SoLuong"];
}
file_put_contents("debug.txt2", "Danh sách phòng ban: " . print_r($departments, true) . "\n", FILE_APPEND);

// Đóng kết nối
$conn->close();

// Trả về dữ liệu JSON
echo json_encode([
    "employee_count" => $employeeCount,
    "position_count" => $positionCount,
    "department_count" => $departmentCount,
    "positions" => $positions,
    "departments" => $departments
]);
?>
