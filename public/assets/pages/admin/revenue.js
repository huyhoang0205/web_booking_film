document.addEventListener("DOMContentLoaded", async function() {
    const response = await fetch('http://localhost/CO3049_assignment/public/revenue/revenueMovieHot');
    const data = await response.json();

    const movieData = data.data;

    // Tạo danh sách các ngày và các phim
    const titles = Array.from(new Set(movieData.map(item => item.title))); // Lấy danh sách các phim
    const dates = Array.from(new Set(movieData.map(item => item.date))); // Lấy danh sách các ngày
    dates.sort((a, b) => new Date(a) - new Date(b));
    // Tạo series cho từng phim
    const series = titles.map(title => {
        // Tính tổng đơn hàng cho từng ngày và từng phim
        const totalOrdersByDate = dates.map(date => {
            return movieData
                .filter(item => item.title === title && item.date === date)
                .reduce((acc, item) => acc + item.total_orders, 0);
        });

        return {
            name: title, // Tên phim
            data: totalOrdersByDate // Dữ liệu cho phim đó
        };
    });

    // Tạo options cho chart
    var options = {
        series: series, // Thêm tất cả các series của từng phim
        chart: {
            height: 350,
            type: 'line',
            zoom: {
                enabled: false
            }
        },
        dataLabels: {
            enabled: false
        },
        stroke: {
            width: [5],
            curve: 'smooth'
        },
        title: {
            text: 'Tổng số vé bán ra theo Phim',
            align: 'left'
        },
        markers: {
            size: 5,
            hover: {
                sizeOffset: 6
            }
        },
        xaxis: {
            categories: dates, // Sử dụng các ngày làm categories cho x-axis
        },
        tooltip: {
            y: [{
                title: {
                    formatter: function(val) {
                        return val;
                    }
                }
            }]
        },
        grid: {
            borderColor: '#f1f1f1',
        }
    };

    var chart = new ApexCharts(document.querySelector("#chart1"), options);
    chart.render();
});

document.addEventListener("DOMContentLoaded", () => {
    const today = new Date().toISOString().split('T')[0];
    document.querySelector('[name="start_date"]').value = today;
    document.querySelector('[name="end_date"]').value = today;


    const validationMeida = new JustValidate('#coverageForm');

    validationMeida
        .addField('[name="start_date"]', [{
                rule: 'required',
                errorMessage: 'Ngày bắt đầu không được bỏ trống'
            },
            {
                validator: (value) => !isNaN(Date.parse(value)),
                errorMessage: 'Ngày không hợp lệ'
            },
        ])
        .addField('[name="end_date"]', [{
                rule: 'required',
                errorMessage: 'Ngày kết thúc không được bỏ trống'
            },
            {
                validator: (value) => !isNaN(Date.parse(value)),
                errorMessage: 'Ngày không hợp lệ'
            },
            {
                validator: (value, fields) => {
                    const startDate = new Date(fields['[name="start_date"]'].elem.value);
                    const endDate = new Date(value);
                    return endDate >= startDate;
                },
                errorMessage: 'Ngày kết thúc phải sau ngày bắt đầu',
            },
        ])
        .onSuccess(async (event) => {
            event.preventDefault(); // Ngăn reload mặc định
            await loadchartCoverage();
        });
});

async function loadchartCoverage() {
    const dataForm = new FormData(document.getElementById('coverageForm'));

    try {
        const response = await fetch('http://localhost/CO3049_assignment/public/revenue/revenueChartCoverage', {
            method: 'POST',
            body: dataForm,
        });
        const chartCoverageContainer = document.querySelector('#chartCoverage');
        chartCoverageContainer.innerHTML = '';

        const data = await response.json();
        console.log(data);
        if (!data.status || !data.data) chartCoverageContainer.innerHTML = "Không có dữ liệu";
        // Tạo biểu đồ tròn cho mỗi showtime
        data.data.forEach(item => {
            const totalOrders = parseFloat(item.total_orders); // Đặt vé
            const totalSeats = parseFloat(item.total_seats); // Tổng số ghế
            const emptySeats = totalSeats - totalOrders; // Ghế còn trống

            // Tạo một phần tử div cho mỗi biểu đồ tròn
            const chartContainer = document.createElement('div');
            chartContainer.classList.add('card-body');

            // Thêm biểu đồ vào #chartCoverage
            document.querySelector('#chartCoverage').appendChild(chartContainer);

            // Tạo biểu đồ tròn với ApexCharts và điều chỉnh kích thước
            const chart = new ApexCharts(chartContainer, {
                series: [totalOrders, emptySeats], // Các phần của biểu đồ
                chart: {
                    type: 'pie',
                    width: '500px', // Thay đổi kích thước biểu đồ
                },
                labels: [`${item.title} - Ghế được đặt`, `${item.title} - Ghế trống`], // Nhãn
            });

            chart.render();
        });


    } catch (error) {
        console.error('Lỗi khi gửi dữ liệu:', error);
    }
}