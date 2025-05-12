document.addEventListener("DOMContentLoaded", async function() {
    try {
        // Fetch dữ liệu từ API
        const response = await fetch('http://localhost/CO3049_assignment/public/revenue/revenueFor14Days');
        const data = await response.json();

        // Xử lý dữ liệu để phù hợp với định dạng ApexCharts
        const categories = data.data.map(item => item.date);
        const totalSeatPrice = data.data.map(item => parseFloat(item.total_seat_price));
        const totalProductPrice = data.data.map(item => parseFloat(item.total_product_price));

        // Cấu hình chart
        var options = {
            series: [{
                name: 'Doanh thu vé',
                data: totalSeatPrice
            }, {
                name: 'Doanh thu thực phẩm',
                data: totalProductPrice
            }],
            chart: {
                type: 'bar',
                height: 350,
                stacked: true,
                toolbar: {
                    show: true
                },
                zoom: {
                    enabled: true
                }
            },
            title: {
                text: 'Doanh thu VNĐ',
                align: 'left'
            },
            responsive: [{
                breakpoint: 480,
                options: {
                    legend: {
                        position: 'bottom',
                        offsetX: -10,
                        offsetY: 0
                    }
                }
            }],
            plotOptions: {
                bar: {
                    horizontal: false,
                    borderRadius: 10,
                    borderRadiusApplication: 'end',
                    borderRadiusWhenStacked: 'last',
                    dataLabels: {
                        total: {
                            enabled: true,
                            style: {
                                fontSize: '13px',
                                fontWeight: 900
                            }
                        }
                    }
                },
            },
            xaxis: {
                type: 'category',
                categories: categories,
            },
            legend: {
                position: 'right',
                offsetY: 40
            },
            fill: {
                opacity: 1
            }
        };

        // Render chart
        var chartElement = document.querySelector("#chart1");
        if (chartElement) {
            var chart = new ApexCharts(chartElement, options);
            chart.render();
        } else {
            console.error("Chart element not found.");
        }
    } catch (error) {
        console.error("Error fetching data: ", error);
    }
});

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

    var chart = new ApexCharts(document.querySelector("#chart2"), options);
    chart.render();
});