fetch("sidebar.html")
  .then((response) => response.text())
  .then((data) => {
    document.getElementById("sidebar").innerHTML = data;
  });

let currentEditRow = null; // Biến lưu hàng đang sửa

function openModal() {
  document.getElementById("position-modal").style.display = "flex";
}

function closeModal() {
  document.getElementById("position-modal").style.display = "none";
  document.getElementById("tenChucVu").value = "";
  currentEditRow = null;
}

window.onclick = function (event) {
  let modal = document.getElementById("position-modal");
  if (event.target === modal) {
    closeModal();
  }
};

function savePosition() {
  const tenChucVu = document.getElementById("tenChucVu").value;

  if (tenChucVu) {
    if (currentEditRow) {
      // Cập nhật hàng hiện tại với dữ liệu mới
      currentEditRow.cells[1].innerText = tenChucVu;
    } else {
      const rows = document.querySelectorAll("#positions-body tr");
      const positionCount = rows.length + 1;

      const newRow = `<tr>
                          <td>CV${String(positionCount).padStart(2, "0")}</td>
                          <td>${tenChucVu}</td>
                          <td>
                              <button class="edit-btn" onclick="editPosition(this)">Sửa</button>
                              <button class="delete-btn" onclick="deletePosition(this)">Xóa</button>
                          </td>
                      </tr>`;

      document
        .getElementById("positions-body")
        .insertAdjacentHTML("beforeend", newRow);
    }
    closeModal();
  }
}

function editPosition(button) {
  currentEditRow = button.closest("tr");
  const tenPhongBan = currentEditRow.cells[1].innerText;

  document.getElementById("tenChucVu").value = tenPhongBan;

  document.getElementById("modal-title").innerText = "Sửa Chức Vụ";
  openModal();
}

function deletePosition(button) {
  const row = button.closest("tr");
  row.remove();
}
