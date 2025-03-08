fetch("sidebar.html")
  .then((response) => response.text())
  .then((data) => {
    document.getElementById("sidebar").innerHTML = data;
  });

let currentEditRow = null;

function openModal() {
  document.getElementById("attendance-modal").style.display = "flex";
}

function closeModal() {
  document.getElementById("attendance-modal").style.display = "none";
  document.getElementById("tenPhongBan").value = "";
  document.getElementById("thoiGianVao").value = "";
  document.getElementById("thoiGianRa").value = "";
  document.getElementById("date").value = "";
  currentEditRow = null;
}

window.onclick = function (event) {
  let modal = document.getElementById("attendance-modal");
  if (event.target === modal) {
    closeModal();
  }
};

function saveAttendance() {
  const tenPhongBan = document.getElementById("tenPhongBan").value;
  const thoiGianVao = document.getElementById("thoiGianVao").value;
  const thoiGianRa = document.getElementById("thoiGianRa").value;
  const date = document.getElementById("date").value;

  if (!tenPhongBan || !thoiGianVao || !thoiGianRa || !date) {
    alert("Bạn cần nhập đủ thông tin");
    return;
  }

  const morningStart = new Date(`${date} 08:00`);
  const morningDeadline = new Date(`${date} 09:00`);
  const morningEnd = new Date(`${date} 12:00`);

  const afternoonStart = new Date(`${date} 13:00`);
  const afternoonDeadline = new Date(`${date} 14:00`);
  const afternoonEnd = new Date(`${date} 17:00`);
  const overtimeStart = new Date(`${date} 17:00`);

  const timeIn = new Date(`${date} ${thoiGianVao}`);
  const timeOut = new Date(`${date} ${thoiGianRa}`);

  let workingHours = 0;
  let overtimeHours = 0;

  if (timeIn <= morningDeadline && timeOut >= morningEnd) {
    workingHours += 4;
  }

  if (timeIn <= afternoonDeadline && timeOut >= afternoonEnd) {
    workingHours += 4;
  }

  if (timeOut > overtimeStart) {
    overtimeHours = (timeOut - overtimeStart) / (1000 * 60 * 60);
  }

  if (currentEditRow) {
    currentEditRow.cells[1].innerText = tenPhongBan;
    currentEditRow.cells[2].innerText = thoiGianVao;
    currentEditRow.cells[3].innerText = thoiGianRa;
    currentEditRow.cells[4].innerText = date;
    currentEditRow.cells[5].innerText = `${workingHours.toFixed(0)} giờ`;
    currentEditRow.cells[6].innerText = `${overtimeHours.toFixed(0)} giờ`;
    currentEditRow = null;
  } else {
    const newRow = `<tr>
                        <td>NV${String(
                          document.querySelectorAll("#attendances-body tr")
                            .length + 1
                        ).padStart(2, "0")}</td>
                        <td>${tenPhongBan}</td>
                        <td>${thoiGianVao}</td>
                        <td>${thoiGianRa}</td>
                        <td>${date}</td>
                        <td>${workingHours.toFixed(0)} giờ</td>
                        <td>${overtimeHours.toFixed(0)} giờ</td>
                        <td>
                            <button class="edit-btn" onclick="editAttendance(this)">Sửa</button>
                            <button class="delete-btn" onclick="deleteAttendance(this)">Xóa</button>
                        </td>
                    </tr>`;

    document
      .getElementById("attendances-body")
      .insertAdjacentHTML("beforeend", newRow);
  }
  closeModal();
  updateIDs();
}

function editAttendance(button) {
  currentEditRow = button.closest("tr");
  const cells = currentEditRow.cells;

  document.getElementById("tenPhongBan").value = cells[1].innerText;
  document.getElementById("thoiGianVao").value = cells[2].innerText;
  document.getElementById("thoiGianRa").value = cells[3].innerText;
  document.getElementById("date").value = cells[4].innerText;

  document.getElementById("modal-title").innerText = "Sửa Chấm Công";
  openModal();
}

function deleteAttendance(button) {
  button.closest("tr").remove();
  updateIDs();
}

function updateIDs() {
  const rows = document.querySelectorAll("#attendances-body tr");
  rows.forEach((row, index) => {
    row.cells[0].innerText = `NV${String(index + 1).padStart(2, "0")}`;
  });
}
