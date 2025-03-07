fetch("sidebar.html")
  .then((response) => response.text())
  .then((data) => {
    document.getElementById("sidebar").innerHTML = data;
});

document.addEventListener('DOMContentLoaded', function () {
    // Hàm tính lương
    function calculateSalary(monthlySalary, workingDays, overtimeDays, totalDaysInMonth) {
        const dailySalary = monthlySalary / totalDaysInMonth;
        const salary = (dailySalary * workingDays) + (dailySalary * overtimeDays * 1.5);
        return salary;
    }

    // Hàm tính số ngày làm việc từ thứ 2 đến thứ 6 trong khoảng thời gian
    function countWorkingDays(startDate, endDate) {
        let workingDays = 0;
        let currentDate = new Date(startDate);

        // Lặp qua các ngày trong khoảng thời gian
        while (currentDate <= endDate) {
            // Kiểm tra nếu là thứ 2 đến thứ 6 (tức là các ngày từ thứ 2 đến thứ 6)
            if (currentDate.getDay() >= 1 && currentDate.getDay() <= 5) {
                workingDays++;
            }
            // Tiến đến ngày tiếp theo
            currentDate.setDate(currentDate.getDate() + 1);
        }

        return workingDays;
    }

    // Lấy phần thân bảng lương
    const salaryTableBody = document.getElementById("salary-body");

    // Duyệt qua từng hàng trong bảng và tính lương
    salaryTableBody.querySelectorAll('tr').forEach(function(row) {
        const monthlySalary = parseFloat(row.cells[3].innerText.replace(/,/g, '')); // Lương tháng
        const overtimeDays = parseInt(row.cells[5].innerText); // Số ngày tăng ca
        const salaryPeriod = row.cells[2].innerText; // Lấy giá trị kỳ trả lương

        // Phân tích chuỗi kỳ trả lương (20/02/2024 - 19/03/2024)
        const periodParts = salaryPeriod.split(' - ');
        const startDateStr = periodParts[0]; // Ngày bắt đầu
        const endDateStr = periodParts[1]; // Ngày kết thúc

        // Chuyển đổi ngày bắt đầu và kết thúc từ chuỗi thành đối tượng Date
        const startDate = new Date(startDateStr.split('/').reverse().join('-')); // Đổi định dạng từ dd/mm/yyyy sang yyyy-mm-dd
        const endDate = new Date(endDateStr.split('/').reverse().join('-'));

        // Tính số ngày làm việc từ thứ 2 đến thứ 6 trong khoảng thời gian
        const workingDays = countWorkingDays(startDate, endDate);

        // Tính lương thực nhận
        const netSalary = calculateSalary(monthlySalary, workingDays, overtimeDays, 30); // Giả sử có 30 ngày trong tháng

        // Định dạng lương thực nhận theo định dạng tiền tệ Việt Nam
        const formattedSalary = netSalary.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });

        // Cập nhật cột "Lương thực nhận" với giá trị lương tính toán
        row.cells[6].innerText = formattedSalary;
    });
});
