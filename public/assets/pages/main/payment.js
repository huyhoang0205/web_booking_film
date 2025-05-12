window.onload = function() {
    loadPaymentInfo();


};

async function loadFooter() {
    const response = await fetch('http://localhost/CO3049_assignment/public/component/footer');
    const res = await response.text();
    document.getElementById('footer').innerHTML = res;
}



async function loadPaymentInfo() {
    const urlParams = new URLSearchParams(window.location.search);
    const rawData = urlParams.get('data');

    const data = JSON.parse(decodeURIComponent(rawData));
    console.log('Data:', data);
    watchPaymentStatus(data.orderCode);


    const res = await fetch('https://api.vietqr.io/v2/banks');
    const json = await res.json();
    const banks = json.data;
    const bank = banks.find(b => b.bin === data.bin);

    if (bank) {
        const logoElement = document.getElementById('logo');
        const bankNameElement = document.getElementById('bankName');
        const accountNumberElement = document.getElementById('accountNumber');
        const accountNameElement = document.getElementById('accountName');
        const amountElement = document.getElementById('amount');
        const descriptionElement = document.getElementById('description');

        logoElement.innerHTML = `<img src="${bank.logo}" alt="${bank.name}" class="img-fluid" />`;
        bankNameElement.innerText = bank.name;
        accountNumberElement.innerText = data.accountNumber;
        accountNameElement.innerText = data.accountName;
        amountElement.innerText = data.amount + ' VND';
        descriptionElement.innerText = data.description;
    }

    const qrCodeImg = document.getElementById("qrCode");
    const btn = document.getElementById("cancelBtn");
    btn.addEventListener("click", async function() {
        try {
            const dataF = new FormData();
            dataF.append('order_code', data.orderCode);

            const response = await fetch(`http://localhost/CO3049_assignment/public/main/cancelPayment`, {
                method: 'POST'
                , body: dataF
            , });

            const res = await response.json();

            if (res.status) {
                window.location.href = `http://localhost/CO3049_assignment/public/status/cancel`;
            } else {
                alert('Error: ' + res.message);
            }
        } catch (error) {
            console.error("Lỗi khi hủy thanh toán:", error);
            alert("Đã xảy ra lỗi khi hủy thanh toán.");
        }
    });

    // Tạo URL ảnh QR từ vietqr.io
    const qrUrl = `https://img.vietqr.io/image/${data.bin}-${data.accountNumber}-vietqr_pro.jpg?addInfo=${encodeURIComponent(data.description)}&amount=${data.amount}`;

    // Hiển thị ảnh QR code
    qrCodeImg.innerHTML = `
            <a href="${data.checkoutUrl}" target="_blank">
                <img src="${qrUrl}" alt="QR Code" class="img-fluid"  />
            </a>
        `;

}


async function watchPaymentStatus(orderCode) {
    let retryInterval = 5000; // Khoảng thời gian kiểm tra lại (5 giây)
    try {
        while (true) {
            const response = await fetch(`http://localhost/CO3049_assignment/public/main/getPayment?order_code=${orderCode}`);
            const data = await response.json();
            console.log(data.data);

            // Kiểm tra dữ liệu hợp lệ
            if (!data.status || !data.data) {
                console.error("Dữ liệu không hợp lệ");
                break;
            }

            const paymentData = data.data; // Sử dụng trực tiếp dữ liệu trả về

            const messageElement = document.getElementById('mesage');
            messageElement.innerHTML = '';

            // Xử lý trạng thái thanh toán
            switch (paymentData.status) {
                case 'PAID':
                    messageElement.innerHTML = `<div class="alert alert-success">Đã thanh toán thành công</div>`;
                    window.location.href = 'http://localhost/CO3049_assignment/public/status/success';
                    break;

                case 'PENDING':
                    messageElement.innerHTML = `<div class="alert alert-info">Chờ thanh toán</div>`;
                    break;

                case 'EXPIRED':
                    messageElement.innerHTML = `<div class="alert alert-danger">Thanh toán thất bại</div>`;
                    window.location.href = 'http://localhost/CO3049_assignment/public/status/cancel';
                    break;

                case 'CANCELLED':
                    messageElement.innerHTML = `<div class="alert alert-danger">Đơn hàng đã bị huỷ</div>`;
                    window.location.href = 'http://localhost/CO3049_assignment/public/status/cancel';
                    break;

                default:
                    messageElement.innerHTML = `<div class="alert alert-info">Trạng thái không xác định</div>`;
                    break;
            }

            if (['PAID', 'EXPIRED', 'CANCELLED'].includes(paymentData.status)) {
                break; // Nếu trạng thái là PAID, EXPIRED, hoặc CANCELLED, dừng theo dõi
            }

            // Đợi 5 giây rồi kiểm tra lại
            await new Promise(resolve => setTimeout(resolve, retryInterval));
        }
    } catch (error) {
        console.error('Lỗi khi theo dõi trạng thái thanh toán:', error);
    }
}