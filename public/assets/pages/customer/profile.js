let cropper;
let currentAvatarUrl = 'http://localhost/CO3049_assignment/public/static/avatar.webp';

// Open file dialog when clicking change avatar
function inputAvatar() {
    document.getElementById('avatarInput').click();
}

// Handle file selection
document.getElementById('avatarInput').addEventListener('change', function(e) {
    if (e.target.files.length === 0) return;

    const file = e.target.files[0];
    if (!file.type.match('image.*')) {
        alert('Vui lòng chọn file ảnh');
        return;
    }

    const reader = new FileReader();
    reader.onload = function(event) {
        // Show modal with image
        const modal = document.getElementById('avatarModal');
        const cropImg = document.getElementById('cropImage');

        cropImg.src = event.target.result;
        modal.style.display = 'block';

        // Initialize cropper
        if (cropper) {
            cropper.destroy();
        }

        cropper = new Cropper(cropImg, {
            aspectRatio: 1
            , viewMode: 1
            , autoCropArea: 0.8
            , responsive: true
            , guides: false
        });
    };
    reader.readAsDataURL(file);
});

// Crop and save the image
async function cropImage() {
    if (!cropper) return;

    // Tạo canvas từ cropper
    const canvas = cropper.getCroppedCanvas({
        width: 300
        , height: 300
        , minWidth: 100
        , minHeight: 100
        , maxWidth: 800
        , maxHeight: 800
        , fillColor: '#fff'
        , imageSmoothingEnabled: true
        , imageSmoothingQuality: 'high'
    , });

    if (canvas) {
        canvas.toBlob(async function(blob) {
            const formData = new FormData();
            formData.append('file', blob, 'avatar.webp');

            try {
                const res = await fetch('http://localhost/CO3049_assignment/public/customer/uploadAvatar', {
                    method: 'POST'
                    , body: formData
                });

                const data = await res.json();

                if (data.success) {}

            } catch (error) {
                console.error('Lỗi khi gửi ảnh:', error);
                alert('Đã xảy ra lỗi!');
            } finally {
                closeModal();
            }
        }, 'image/webp', 0.9);
    }
}


// Close the modal
function closeModal() {
    document.getElementById('avatarModal').style.display = 'none';

    // Xóa cropper nếu tồn tại
    if (cropper) {
        cropper.destroy();
        cropper = null;
    }

    document.getElementById('avatarInput').value = '';
}


document.getElementById('avatarModal').addEventListener('click', function(e) {
    if (e.target === this) {
        closeModal();
    }
});

document.getElementById('avatarImage').addEventListener('click', inputAvatar);


const validation = new JustValidate('#changePasswordForm');

validation
    .addField('#oldPassword', [{
            rule: 'required'
            , errorMessage: 'Vui lòng nhập mật khẩu cũ'
        }
        , {
            rule: 'minLength'
            , value: 6
            , errorMessage: 'Mật khẩu tối thiểu 6 ký tự'
        }
    , ])
    .addField('#newPassword', [{
            rule: 'required'
            , errorMessage: 'Vui lòng nhập mật khẩu mới'
        }
        , {
            rule: 'minLength'
            , value: 6
            , errorMessage: 'Mật khẩu tối thiểu 6 ký tự'
        }
        , {
            validator: (value, fields) => {
                return value !== fields['#oldPassword'].elem.value;
            }
            , errorMessage: 'Mật khẩu mới không được trùng với mật khẩu cũ'
        , }
    , ])

    .addField('#confirmPassword', [{
            rule: 'required'
            , errorMessage: 'Vui lòng xác nhận mật khẩu'
        }
        , {
            validator: (value, fields) => {
                return value === fields['#newPassword'].elem.value;
            }
            , errorMessage: 'Mật khẩu xác nhận không khớp'
        , }
    , ])
    .onSuccess(async (event) => {
        event.preventDefault(); // Ngăn reload mặc định

        await changePassword(); // Gọi khi form hợp lệ
    });

async function changePassword() {
    const formData = new FormData(document.getElementById('changePasswordForm'));

    try {
        const response = await fetch('http://localhost/CO3049_assignment/public/customer/changePassword', {
            method: 'POST'
            , body: formData
        , });

        const data = await response.json();

        const messageDiv = document.getElementById('message');
        messageDiv.style.display = 'block';
        messageDiv.className = 'alert ' + (data.status ? 'alert-success' : 'alert-danger');

        if (data.status) {
            document.getElementById('changePasswordForm').reset();
            messageDiv.innerText = data.message || 'Thành công';
        } else {
            messageDiv.innerText = data.message || 'Thất bại';

        }

    } catch (error) {
        console.error('Có lỗi xảy ra:', error);
        messageDiv.style.display = 'block';
        messageDiv.className = 'alert alert-danger';
        messageDiv.innerText = 'Đã có lỗi xảy ra khi gửi yêu cầu.';
    }
}




loadOrder();

async function loadOrder() {
    try {
        const response = await fetch("http://localhost/CO3049_assignment/public/customer/getOrder");
        const result = await response.json();

        if (result.status && Array.isArray(result.data)) {
            const tbody = document.querySelector("#table1 tbody");
            tbody.innerHTML = ""; // clear cũ nếu có

            result.data.forEach((order) => {
                const actionBtn = order.status === "completed" ?
                    `<td class="text-center">
               <button class="btn btn-sm btn-primary" onclick="showOrder(${order.order_code})">Xem hóa đơn</button>
             </td>` :
                    `<td></td>`;

                const statusClass = {
                    pending: "text-warning fw-bold"
                    , failed: "text-danger fw-bold"
                    , completed: "text-success fw-bold"
                , } [order.status] || "";

                const row = `
            <tr>
              <td>${order.order_code}</td>
              <td>${parseFloat(order.total_price).toLocaleString("vi-VN")} đ</td>
              <td class="${statusClass}">${order.status}</td>
              <td>${order.created_at.split(" ")[0]}</td>
              ${actionBtn}
            </tr>
          `;

                tbody.insertAdjacentHTML("beforeend", row);
            });

        }
    } catch (err) {
        console.error("Lỗi khi load đơn hàng:", err);
    }
}



window.onload = function() {
    const params = new URLSearchParams(window.location.search);
    const view = params.get('view');

    // Ẩn tất cả các form
    document.getElementById('profilePage').style.display = 'none';
    document.getElementById('changePasswordPage').style.display = 'none';
    document.getElementById('orderPage').style.display = 'none';

    // Hiện form tương ứng
    loadInfo();
    if (view === 'orderPage') {
        document.getElementById('orderPage').style.display = 'block';
    } else if (view === 'changePasswordPage') {
        document.getElementById('changePasswordPage').style.display = 'block';
    } else {
        document.getElementById('profilePage').style.display = 'block';
        loadInfo();
    }

    // Xử lý active menu
    const links = document.querySelectorAll('#chosePage a');
    links.forEach(link => {
        link.classList.remove('active');

        const url = new URL(link.href);
        const linkView = url.searchParams.get('view');

        if (view === linkView || (view === null && linkView === 'profilePage')) {
            link.classList.add('active');
        }
    });
};

function getRankInfo(point) {
    if (point < 500) return {
        name: "Đồng"
        , color: "secondary"
        , min: 0
        , max: 500
    };
    if (point < 1000) return {
        name: "Bạc"
        , color: "info"
        , min: 500
        , max: 1000
    };
    if (point < 2000) return {
        name: "Vàng"
        , color: "warning"
        , min: 1000
        , max: 2000
    };
    return {
        name: "VIP"
        , color: "danger"
        , min: 2000
        , max: 3000
    }; // Giả định max để hiển thị % dễ
}
async function loadInfo() {
    const response = await fetch('http://localhost/CO3049_assignment/public/customer/getInfo');
    const data = await response.json();
    if (data.status) {
        const info = data.data;
        console.log(data.data);
        document.querySelector('#profilePage input[name="name"]').value = info.name;
        document.querySelector('#profilePage input[name="username"]').value = info.username;
        document.querySelector('#profilePage input[name="email"]').value = info.email;
        document.querySelector('#profilePage input[name="phone"]').value = info.phone;
        document.querySelector('#profilePage input[name="address"]').value = info.address;
        document.querySelector('#profilePage input[name="id_card"]').value = info.id_card;

        // --- Cập nhật điểm & hạng ---
        const point = parseInt(info.point);
        const rank = getRankInfo(point);

        const percent = Math.min(100, ((point - rank.min) / (rank.max - rank.min)) * 100);

        document.getElementById("pointDisplay").textContent = `Điểm: ${point}`;
        const rankDisplay = document.getElementById("rankDisplay");
        rankDisplay.textContent = `Hạng: ${rank.name}`;
        rankDisplay.className = `badge bg-${rank.color}`;

        const progressBar = document.getElementById("rankProgress");
        progressBar.style.width = `${percent}%`;
        progressBar.setAttribute("aria-valuenow", percent);

        const avatarImage = document.getElementById("avatarImage");
        if (info.avatar && info.avatar.trim() !== "") {
            avatarImage.src = info.avatar;
        }
    } else {
        alert(data.message);
    }
}

async function updateInfo() {
    const form = document.getElementById('profileForm');
    const formData = new FormData(form);
    const response = await fetch('http://localhost/CO3049_assignment/public/customer/updateInfo', {
        method: 'POST'
        , body: formData
    });
    const data = await response.json();
    if (data.status) {
        alert(data.message);
        loadInfo();
    } else {
        alert(data.message);
    }
}