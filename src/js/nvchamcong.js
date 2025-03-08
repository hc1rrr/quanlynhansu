fetch("sidebar.html")
  .then((response) => response.text())
  .then((data) => {
    document.getElementById("sidebar").innerHTML = data;
  });

function openModalIn() {
  document.getElementById("myModalIn").style.display = "flex";
}

function openModalOut() {
  document.getElementById("myModalOut").style.display = "flex";
}

function closeModal() {
  document.getElementById("myModalIn").style.display = "none";
  document.getElementById("myModalOut").style.display = "none";
}

function calculateWorkingHours(thoiGianVao, thoiGianRa, date) {
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
    overtimeHours = Math.max(0, overtimeHours.toFixed(0)); // Làm tròn 2 chữ số thập phân
  }

  return { workingHours, overtimeHours };
}

function addAttendance(thoiGian, date, isIn) {
  const tbody = document.getElementById("attendances-body");
  if (!tbody) {
    console.error("Không tìm thấy bảng chấm công!");
    return;
  }

  const rows = tbody.getElementsByTagName("tr");

  if (isIn) {
    // Nếu là chấm công vào, thêm hàng mới
    const newRow = document.createElement("tr");
    newRow.innerHTML = `
        <td>NV01</td>
        <td>Nguyễn Văn A</td>
        <td>${thoiGian}</td>
        <td></td>
        <td>${date}</td>
        <td>0 giờ</td>
        <td>0 giờ</td>
      `;
    tbody.appendChild(newRow);
  } else {
    // Nếu là chấm công ra, tìm hàng chấm công vào cùng ngày
    let found = false;
    for (let row of rows) {
      const dateCell = row.cells[4].textContent; // Cột ngày tháng
      if (dateCell === date && row.cells[3].textContent === "") {
        const thoiGianVao = row.cells[2].textContent; // Thời gian vào
        const { workingHours, overtimeHours } = calculateWorkingHours(
          thoiGianVao,
          thoiGian,
          date
        );

        row.cells[3].textContent = thoiGian; // Cập nhật thời gian ra
        row.cells[5].textContent = `${workingHours} giờ`; // Cập nhật giờ làm việc
        row.cells[6].textContent = `${overtimeHours} giờ`; // Cập nhật giờ tăng ca

        found = true;
        break;
      }
    }
    if (!found) {
      alert(
        "Không tìm thấy chấm công vào cho ngày này hoặc đã chấm công ra rồi."
      );
    }
  }
}

// Xử lý sự kiện khi xác nhận chấm công vào
document.getElementById("chamCongInForm").onsubmit = function (event) {
  event.preventDefault();
  const thoiGianVao = document.getElementById("thoiGianVao").value;
  const dateIn = document.getElementById("dateIn").value;
  addAttendance(thoiGianVao, dateIn, true);

  document.getElementById("thoiGianVao").value = "";
  document.getElementById("dateIn").value = "";
  closeModal();
};

// Xử lý sự kiện khi xác nhận chấm công ra
document.getElementById("chamCongOutForm").onsubmit = function (event) {
  event.preventDefault();
  const thoiGianRa = document.getElementById("thoiGianRa").value;
  const dateOut = document.getElementById("dateOut").value;
  addAttendance(thoiGianRa, dateOut, false);

  document.getElementById("thoiGianRa").value = "";
  document.getElementById("dateOut").value = "";
  closeModal();
};
