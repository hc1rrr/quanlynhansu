fetch("sidebar.html")
  .then((response) => response.text())
  .then((data) => {
    document.getElementById("sidebar").innerHTML = data;
  });

document.addEventListener("DOMContentLoaded", function () {
    const addButton = document.querySelector(".add-btn");
    const salaryBody = document.getElementById("salary-body");

    addButton.addEventListener("click", function () {
        openSalaryModal();
    });
});

function openSalaryModal(salary = null, row = null) {
    const modalHtml = `
        <div class="modal" id="salary-modal">
            <div class="modal-content">
                <span class="close-btn" onclick="closeSalaryModal()">&times;</span>
                <h3>${salary ? "Chỉnh sửa lương" : "Thêm lương"}</h3>
                <input type="text" id="employee-id" placeholder="Mã nhân viên" value="${salary ? salary.id : ""}">
                <input type="text" id="employee-name" placeholder="Tên nhân viên" value="${salary ? salary.name : ""}">
                <input type="text" id="pay-period" placeholder="Kỳ trả lương" value="${salary ? salary.period : ""}">
                <input type="number" id="workday" placeholder="Số ngày công" value="${salary ? salary.workday : ""}">
                <input type="number" id="salary-amount" placeholder="Mức lương" value="${salary ? salary.salary : ""}">
                <input type="number" id="total-salary" placeholder="Lương thực nhận" value="${salary ? salary.total : ""}" readonly>
                <button class="save-btn" onclick="${salary ? `updateSalary(${row.rowIndex})` : "saveSalary()"}">${salary ? "Cập nhật" : "Lưu"}</button>
            </div>
        </div>`;
    
    document.body.insertAdjacentHTML("beforeend", modalHtml);
}

function closeSalaryModal() {
    const modal = document.getElementById("salary-modal");
    if (modal) {
        modal.remove();
    }
}

function saveSalary() {
    const id = document.getElementById("employee-id").value;
    const name = document.getElementById("employee-name").value;
    const period = document.getElementById("pay-period").value;
    const workday = parseFloat(document.getElementById("workday").value) || 0;
    const salary = parseFloat(document.getElementById("salary-amount").value) || 0;
    const total = workday * salary;

    if (!id || !name || !salary) {
        alert("Vui lòng nhập đầy đủ thông tin!");
        return;
    }

    const newRow = document.createElement("tr");
    newRow.innerHTML = `
        <td>${id}</td>
        <td>${name}</td>
        <td>${period}</td>
        <td>${workday}</td>
        <td>${salary}</td>
        <td>${total}</td>
        <td>
            <button class="edit-btn" onclick="editSalary(this)">Sửa</button>
            <button class="delete-btn" onclick="deleteSalary(this)">Xóa</button>
        </td>
    `;

    document.getElementById("salary-body").appendChild(newRow);
    closeSalaryModal();
}

function deleteSalary(button) {
    const row = button.closest("tr");
    row.remove();
}

function editSalary(button) {
    const row = button.closest("tr");
    const cells = row.getElementsByTagName("td");
    
    const salary = {
        id: cells[0].textContent,
        name: cells[1].textContent,
        period: cells[2].textContent,
        workday: cells[3].textContent,
        salary: cells[4].textContent,
        total: cells[5].textContent
    };
    
    openSalaryModal(salary, row);
}

function updateSalary(rowIndex) {
    const table = document.getElementById("salary-body");
    const row = table.rows[rowIndex - 1];
    const cells = row.getElementsByTagName("td");

    cells[0].textContent = document.getElementById("employee-id").value;
    cells[1].textContent = document.getElementById("employee-name").value;
    cells[2].textContent = document.getElementById("pay-period").value;
    cells[3].textContent = document.getElementById("workday").value;
    cells[4].textContent = document.getElementById("salary-amount").value;
    cells[5].textContent = parseFloat(cells[3].textContent) * parseFloat(cells[4].textContent);
    
    closeSalaryModal();
}
