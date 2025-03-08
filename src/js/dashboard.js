fetch("sidebar.html")
  .then((response) => response.text())
  .then((data) => {
    document.getElementById("sidebar").innerHTML = data;
  });

document.addEventListener("DOMContentLoaded", function () {
  fetch("http://localhost/qlns_clone/php/getDashboard.php")
    .then((response) => response.json())
    .then((data) => {
      console.log("Dữ liệu nhận từ API:", data); // Kiểm tra dữ liệu

      // Cập nhật số lượng nhân viên, chức vụ, phòng ban
      document.getElementById("employee-count").textContent =
        data.employee_count;
      document.getElementById("position-count").textContent =
        data.position_count;
      document.getElementById("department-count").textContent =
        data.department_count;

      // Cập nhật danh sách chức vụ
      const positionsBody = document.getElementById("positions-body");
      positionsBody.innerHTML = ""; // Xóa nội dung cũ
      Object.entries(data.positions).forEach(([position, count]) => {
        let row = `<tr><td>${position}</td><td>${count}</td></tr>`;
        positionsBody.insertAdjacentHTML("beforeend", row);
      });

      // Cập nhật danh sách phòng ban
      const departmentsBody = document.getElementById("departments-body");
      departmentsBody.innerHTML = ""; // Xóa nội dung cũ
      Object.entries(data.departments).forEach(([department, count]) => {
        let row = `<tr><td>${department}</td><td>${count}</td></tr>`;
        departmentsBody.insertAdjacentHTML("beforeend", row);
      });
    })
    .catch((error) => console.error("Lỗi khi tải dữ liệu:", error));
});
