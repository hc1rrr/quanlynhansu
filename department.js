fetch("sidebar.html")
  .then((response) => response.text())
  .then((data) => {
    document.getElementById("sidebar").innerHTML = data;
  });

// ✅ Hàm lấy danh sách phòng ban từ PHP
function fetchDepartments() {
  console.log("Gọi API lấy danh sách phòng ban...");
  
  fetch("http://localhost/qlns_clone/php/getDepartment.php?action=get")
    .then((response) => response.json())
    .then((data) => {
      console.log("Dữ liệu nhận được:", data);

      const departmentsBody = document.getElementById("departments-body");
      departmentsBody.innerHTML = ""; // Xóa nội dung cũ

      data.forEach((department) => {
        const newRow = `
          <tr>
            <td>${department.MaPhongBan}</td>
            <td>${department.TenPhongBan}</td>
            <td>
              <button class="edit-btn" onclick="editDepartment('${department.MaPhongBan}', '${department.TenPhongBan}')">Sửa</button>
              <button class="delete-btn" onclick="deleteDepartment('${department.MaPhongBan}')">Xóa</button>
            </td>
          </tr>
        `;
        departmentsBody.insertAdjacentHTML("beforeend", newRow);
      });
    })
    .catch((error) => {
      console.error("Lỗi khi fetch dữ liệu phòng ban:", error);
    });
}

// ✅ Mở modal thêm phòng ban
function openModal() {
  document.getElementById("department-modal").style.display = "flex";
  document.getElementById("modal-title").innerText = "Thêm Phòng Ban";
  document.getElementById("tenPhongBan").value = "";
  document.getElementById("moTa").value = "";
  document.getElementById("save-btn").setAttribute("onclick", "saveDepartment()");
}

// ✅ Đóng modal
function closeModal() {
  document.getElementById("department-modal").style.display = "none";
}

// ✅ Lưu phòng ban (Thêm hoặc Cập nhật)
function saveDepartment(maPhongBan = null) {
  const tenPhongBan = document.getElementById("tenPhongBan").value;

  if (!tenPhongBan) {
    alert("Bạn cần nhập tên phòng ban");
    return;
  }

  let url = "http://localhost/qlns_clone/php/getDepartment.php?action=" + (maPhongBan ? "update" : "add");
  let method = maPhongBan ? "PUT" : "POST";
  let data = { tenPhongBan };

  if (maPhongBan) data.maPhongBan = maPhongBan;

  fetch(url, {
    method: method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .then((result) => {
      alert(result.message);
      if (result.success) {
        closeModal();
        fetchDepartments();
      }
    })
    .catch((error) => console.error("Lỗi:", error));
}

// ✅ Mở modal chỉnh sửa phòng ban
function editDepartment(maPhongBan, tenPhongBan) {
  openModal();
  document.getElementById("modal-title").innerText = "Sửa Phòng Ban";
  document.getElementById("tenPhongBan").value = tenPhongBan;
  document.getElementById("save-btn").setAttribute("onclick", `saveDepartment('${maPhongBan}')`);
}

// ✅ Xóa phòng ban
function deleteDepartment(maPhongBan) {
  if (!confirm("Bạn có chắc muốn xóa phòng ban này?")) return;

  fetch("http://localhost/qlns_clone/php/getDepartment.php?action=delete", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ maPhongBan }),
  })
    .then((response) => response.json())
    .then((result) => {
      alert(result.message);
      if (result.success) {
        fetchDepartments();
      }
    })
    .catch((error) => console.error("Lỗi:", error));
}

// ✅ Gọi fetch khi tải trang
document.addEventListener("DOMContentLoaded", fetchDepartments);

document.addEventListener("DOMContentLoaded", function () {
    fetch("http://localhost/qlns_clone/php/department.php?action=get")
        .then(response => response.json())
        .then(data => {
            const tbody = document.getElementById("departments-body");
            tbody.innerHTML = "";

            data.forEach(dept => {
                const row = document.createElement("tr");
                row.innerHTML = `
                    <td>${dept.MaPhongBan || "Không có mã"}</td>
                    <td>${dept.TenPhongBan || "Không có tên"}</td>
                    <td>${dept.MoTa && dept.MoTa.trim() ? dept.MoTa : "Không có mô tả"}</td>
                    <td style="white-space: nowrap;">
                        <button class="edit-btn" onclick="editDepartment(this)">Sửa</button>
                        <button class="delete-btn" onclick="deleteDepartment(this)">Xóa</button>
                    </td>
                `;
                tbody.appendChild(row);
            });
        })
        .catch(error => console.error("Lỗi khi tải dữ liệu:", error));
});


