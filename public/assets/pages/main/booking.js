
document.addEventListener("DOMContentLoaded", function() {
    const cancelBtn = document.getElementById("cancelBooking");
    const confirmBtn = document.getElementById("confirmBooking");

    const seatDisplay = document.getElementById("seatDisplay");
    const productDisplay = document.getElementById("productDisplay");
    const infoDisplay = document.getElementById("infoDisplay");

    const stepElements = document.querySelectorAll(".step-indicator .step");
    let step = 1;

    function updateStep() {
        // Ẩn tất cả các phần
        seatDisplay.classList.add("d-none");
        productDisplay.classList.add("d-none");
        infoDisplay.classList.add("d-none");

        // Cập nhật nội dung theo bước
        if (step === 1) {
            seatDisplay.classList.remove("d-none");
            cancelBtn.classList.add("d-none");
            confirmBtn.textContent = "Tiếp tục";
        } else if (step === 2) {
            productDisplay.classList.remove("d-none");
            cancelBtn.classList.remove("d-none");
            confirmBtn.textContent = "Tiếp tục";
        } else if (step === 3) {
            infoDisplay.classList.remove("d-none");
            cancelBtn.classList.remove("d-none");
            confirmBtn.textContent = "Xác nhận";
        }

        // Cập nhật trạng thái active của step indicator
        stepElements.forEach((el, index) => {
            if (index < step) {
                el.classList.add("active");
            } else {
                el.classList.remove("active");
            }
        });
    }

    confirmBtn.addEventListener("click", function() {
        if (step === 2) {
            fetch('http://localhost/CO3049_assignment/public/auth/getRole')
                .then(response => response.json())
                .then(data => {
                    if (data.status) {
                        confirmPayment();
                    } else {
                        step++; // Nếu không có quyền, chuyển sang bước tiếp theo
                        updateStep(); // Đảm bảo cập nhật lại giao diện nếu cần
                    }
                })
                .catch(error => {
                    console.error('Lỗi khi gọi API:', error);
                });
        } else if (step < 3) {
            step++;
            updateStep();
        } else {
            validInfo();
        }
    });



    cancelBtn.addEventListener("click", function() {
        if (step > 1) {
            step--;
            updateStep();
        }
    });

    updateStep(); // Gọi khi trang vừa load
});


const urlParams = new URLSearchParams(window.location.search);
const showtimeId = urlParams.get('showtime_id');
window.onload = function() {
    loadSeat();
    loadBookingInfo();

};


async function loadSeat() {
    try {
        const response = await fetch(`http://localhost/CO3049_assignment/public/main/getSeat?showtime_id=${showtimeId}`);
        const data = await response.json();
        if (data.status) {
            const seat = document.getElementById("seat");
            seat.innerHTML = "";
            const seatData = data.data;
            console.log(seatData);



            const rowMap = {};
            seatData.forEach(seat => {
                if (!rowMap[seat.row]) {
                    rowMap[seat.row] = [];
                }
                rowMap[seat.row].push(seat);
            });


            const col1 = document.createElement("div");
            col1.classList.add('col-2', 'd-flex', 'flex-column', 'p-0');
            const col2 = document.createElement("div");
            col2.classList.add('col-10', 'text-start', 'overflow-auto', 'p-0');
            col2.style.whiteSpace = "nowrap";


            Object.entries(rowMap).forEach(([rowIndex, seats]) => {
                const rowSeat2 = document.createElement("div");
                rowSeat2.className = "rowSeat";

                const rowSeat1 = document.createElement("div");
                rowSeat1.className = "rowSeat";


                const label = document.createElement("button");
                label.classList.add('seat', 'none');

                label.textContent = String.fromCharCode(64 + parseInt(rowIndex));
                rowSeat1.appendChild(label);
                col1.appendChild(rowSeat1);


                let numSeat = 0;


                seats.forEach(seat => {
                    if (seat.type !== 'none') {
                        numSeat += 1;
                    }

                    const button = document.createElement("button");
                    button.classList.add("border-0");
                    if (seat.type === 'couple') {
                        button.classList.add("doubleSeat");
                    } else {
                        button.classList.add("seat");
                    }


                    if (seat.status === 'pending') {
                        button.classList.add("pending")
                    } else if (seat.status === 'completed') {
                        button.classList.add("completed");
                    } else {
                        button.classList.add(seat.type); // thêm theo loại ghế, ví dụ 'couple', 'vip', v.v.
                    }


                    button.onclick = async function() {

                        const isPending = button.classList.contains("pending");
                        startCountdown();

                        const dataForm = new FormData();
                        dataForm.append("showtime_id", showtimeId);
                        dataForm.append("seat_id", seat.id);
                        dataForm.append("order_code", orderCode);

                        if (isPending) {
                            const response = await fetch(`http://localhost/CO3049_assignment/public/main/deleteOrderDetail`, {
                                method: "POST"
                                , body: dataForm
                            });
                            const data = await response.json();
                            if (data.status) {
                                loadSeat();
                                loadBookingInfo();
                            }
                        } else {
                            const response = await fetch(`http://localhost/CO3049_assignment/public/main/insertOrderDetail`, {
                                method: "POST"
                                , body: dataForm
                            });
                            const data = await response.json();
                            if (data.status) {
                                loadSeat();
                                loadBookingInfo();
                            }

                        }



                    };

                    button.innerHTML = seat.code || "&nbsp;";
                    rowSeat2.appendChild(button);
                });
                col2.appendChild(rowSeat2);

            });


            seat.appendChild(col1);
            seat.appendChild(col2);

        }

    } catch (error) {
        console.error('Error:', error);
    }
}


const orderCode = generateCode(); // Generate the code when the page loads
function generateCode() {
    const timestamp = Date.now().toString(); // vd: 1713685800123
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    const code = (timestamp + random).slice(-8); // Lấy 8 số cuối
    return code;
}



let countdownInterval = null;
let countdownDuration = 5 * 60; // 5 phút

function startCountdown() {
    // Nếu đang đếm thì dừng lại
    if (countdownInterval !== null) {
        clearInterval(countdownInterval);
    }

    countdownDuration = 5 * 60; // Reset về 5 phút

    const countdownElement = document.getElementById("countdown");
    const confirmBtn = document.getElementById("confirmBooking");

    confirmBtn.disabled = false; // Cho phép lại nếu trước đó đã disable
    confirmBtn.classList.remove("btn-secondary");
    confirmBtn.classList.add("btn-primary");

    countdownInterval = setInterval(() => {
        const minutes = Math.floor(countdownDuration / 60);
        const seconds = countdownDuration % 60;

        countdownElement.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;

        if (countdownDuration <= 0) {
            clearInterval(countdownInterval);
            countdownInterval = null;

            confirmBtn.disabled = true;
            confirmBtn.classList.add("btn-secondary");
            confirmBtn.classList.remove("btn-primary");

            countdownElement.textContent = "Hết thời gian";
        }

        countdownDuration--;
    }, 1000);
}


async function loadBookingInfo() {
    try {
        const response = await fetch(`http://localhost/CO3049_assignment/public/main/getBookingInfo?showtime_id=${showtimeId}&order_code=${orderCode}`);
        const data = await response.json();
        if (data.status) {
            const bookingInfo = data.data;
            console.log(bookingInfo);
            document.getElementById("movieName").innerHTML = bookingInfo.movie_name;
            document.getElementById("cinemaName").innerHTML = bookingInfo.cinema_name;
            document.getElementById("roomName").innerHTML = bookingInfo.room_name;
            document.getElementById("showtime").innerHTML = bookingInfo.showtime;
            document.getElementById("seatList").innerHTML = bookingInfo.seat_list || "Chưa chọn ghế";
            document.getElementById("productList").innerHTML = bookingInfo.product_list || "Chưa chọn sản phẩm";
            document.getElementById("totalPrice").innerHTML = bookingInfo.total_price || "0";
            loadProduct();
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

function validInfo() {
    const name = document.querySelector('#paymentForm input[name="name"]');
    const email = document.querySelector('#paymentForm input[name="email"]');
    const message = document.getElementById('message');

    message.innerText = ''; // Xóa thông báo cũ

    if (!name.value.trim()) {
        message.innerText = 'Vui lòng nhập họ tên.';
        name.focus();
        return;
    }

    if (!email.value.trim()) {
        message.innerText = 'Vui lòng nhập email.';
        email.focus();
        return;
    }

    // Kiểm tra định dạng email cơ bản
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.value)) {
        message.innerText = 'Email không hợp lệ.';
        email.focus();
        return;
    }

    // Nếu hợp lệ
    message.innerText = ''; // Hoặc thông báo thành công nếu cần
    confirmPayment();
}
async function confirmPayment() {
    try {


        const dataForm = new FormData(document.getElementById("paymentForm"));
        dataForm.append("order_code", orderCode);
        const response = await fetch(`http://localhost/CO3049_assignment/public/main/confirmPayment`, {
            method: "POST"
            , body: dataForm
        });

        const result = await response.json();
        if (result.status) {
            const encodedData = encodeURIComponent(JSON.stringify(result.data));
            window.location.href = `http://localhost/CO3049_assignment/public/main/payment?data=${encodedData}`;
        } else {
            alert("Có lỗi xảy ra, vui lòng thử lại.");
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

async function loadProduct() {
    try {
        const response = await fetch(`http://localhost/CO3049_assignment/public/main/getProductByShowtime?id=${showtimeId}`);
        const data = await response.json();

        if (data.status && data.data.length > 0) {
            const tableBody = document.querySelector(".table tbody");
            tableBody.innerHTML = ""; // Xoá dòng cũ

            data.data
                .filter(product => product.type === "combo") // Lọc theo combo (hoặc popcorn, drink...)
                .forEach(product => {
                    const formattedPrice = Number(product.price).toLocaleString("vi-VN") + " ₫";

                    const row = document.createElement("tr");
                    row.classList.add("ticketing-cart-item");

                    row.innerHTML = `
                    <td class="ticketing-cart-item-name">
                        ${product.name}
                        <span class="text-muted d-block">Mô tả: ${product.description || "Combo ${product.type}"}</span>
                    </td>
                    <td class="ticketing-cart-item-price text-right">${formattedPrice}</td>
                    <td class="ticketing-cart-item-quantity text-right">
                        <div class="quantity-toggle">
                            <a class="btn btn-sm btn-rounded-circle btn-white disabled">-</a>
                            <input type="text" min="0" max="${product.quality}" class="form-control form-control-flush text-dark text-center d-inline" readonly value="0" style="width: 30px;">
                            <a class="btn btn-sm btn-rounded-circle btn-white">+</a>
                        </div>
                    </td>
                `;

                    tableBody.appendChild(row);
                });
        } else {
            alert("Không có sản phẩm combo nào.");
        }
    } catch (error) {
        console.error("Lỗi khi load sản phẩm:", error);
    }
}
