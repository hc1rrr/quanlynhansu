<?php
header("Content-Type: application/json");
require "connect.php"; // Kết nối CSDL

$sql = "SELECT MaPhongBan, TenPhongBan, MoTa, MaQuanLy FROM phongban";
$result = $conn->query($sql);

$departments = [];
if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $departments[] = $row;
    }
}

echo json_encode($departments);
$conn->close();
?>
