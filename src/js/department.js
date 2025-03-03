fetch("sidebar.html")
  .then((response) => response.text())
  .then((data) => {
    document.getElementById("sidebar").innerHTML = data;
  });

let currentEditRow = null; // Biến lưu hàng đang sửa

function openModal() {
  document.getElementById("department-modal").style.display = "flex";
}

function closeModal() {
  document.getElementById("department-modal").style.display = "none";
  document.getElementById("tenPhongBan").value = "";
  document.getElementById("moTa").value = "";
  currentEditRow = null;
}

window.onclick = function (event) {
  let modal = document.getElementById("department-modal");
  if (event.target === modal) {
    closeModal();
  }
};

function saveDepartment() {
  const tenPhongBan = document.getElementById("tenPhongBan").value;
  const moTa = document.getElementById("moTa").value;

  if (!tenPhongBan || !moTa) {
    alert("Bạn cần nhập đủ thông tin");
    return;
  }

  if (tenPhongBan && moTa) {
    if (currentEditRow) {
      // Cập nhật hàng hiện tại với dữ liệu mới
      currentEditRow.cells[1].innerText = tenPhongBan;
      currentEditRow.cells[2].innerText = moTa;
    } else {
      const rows = document.querySelectorAll("#departments-body tr");
      const departmentCount = rows.length + 1;

      const newRow = `<tr>
                          <td>PB${String(departmentCount).padStart(2, "0")}</td>
                          <td>${tenPhongBan}</td>
                          <td>${moTa}</td>
                          <td>
                              <button class="edit-btn" onclick="editDepartment(this)">Sửa</button>
                              <button class="delete-btn" onclick="deleteDepartment(this)">Xóa</button>
                          </td>
                      </tr>`;

      document
        .getElementById("departments-body")
        .insertAdjacentHTML("beforeend", newRow);
    }
    closeModal();
    updateIDs();
  }
}

function editDepartment(button) {
  currentEditRow = button.closest("tr");
  const tenPhongBan = currentEditRow.cells[1].innerText;
  const moTa = currentEditRow.cells[2].innerText;

  document.getElementById("tenPhongBan").value = tenPhongBan;
  document.getElementById("moTa").value = moTa;

  document.getElementById("modal-title").innerText = "Sửa Phòng Ban";
  openModal();
}

function deleteDepartment(button) {
  button.closest("tr").remove();
  updateIDs();
}

function updateIDs() {
  const rows = document.querySelectorAll("#departments-body tr");
  rows.forEach((row, index) => {
    row.cells[0].innerText = `PB${String(index + 1).padStart(2, "0")}`;
  });
}
