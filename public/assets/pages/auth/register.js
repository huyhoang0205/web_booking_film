const validationRegister = new JustValidate('#registerForm');

validationRegister
    .addField('[name="username"]', [{
        rule: 'required',
        errorMessage: 'Vui lòng không được bỏ trống'
    }, {
        rule: 'minLength',
        value: 3,
        errorMessage: 'Độ dài phải lớn hơn 3 ký tự'
    }, ])
    .addField('[name="email"]', [{
        rule: 'required',
        errorMessage: 'Email không được bỏ trống'
    }, {
        rule: 'email',
        errorMessage: 'Email không hợp lệ'
    }, ])
    .addField('[name="password"]', [{
        rule: 'required',
        errorMessage: 'Mật khẩu không được bỏ trống'
    }, {
        rule: 'minLength',
        value: 6,
        errorMessage: 'Mật khẩu phải có ít nhất 6 ký tự'
    }, ])
    .addField('[name="confirm-password"]', [{
        rule: 'required',
        errorMessage: 'Vui lòng nhập lại mật khẩu'
    }, {
        validator: (value, fields) => {
            return value === fields['[name="password"]'].elem.value;
        },
        errorMessage: 'Mật khẩu xác nhận không khớp',
    }, ]);

document.getElementById('registerForm').addEventListener('submit', async function(e) {
    e.preventDefault();

    const isValid = await validationRegister.validate();
    if (isValid) {
        register(); // Gọi hàm xử lý submit nếu form hợp lệ
    } else {
        console.log('Form has errors.');
    }
});



async function register() {
    try {
        const errorMessage = document.getElementById("error-message");
        const dataForm = new FormData(document.getElementById("registerForm"));
        // Gửi yêu cầu đăng ký đến server
        const response = await fetch('http://localhost/CO3049_assignment/public/auth/register', {
            method: 'POST',
            body: dataForm,
        });

        const data = await response.json();
        console.log(data);
        if (data.status) {
            errorMessage.textContent = data.message || "Đăng ký thành công.";
            errorMessage.classList.remove("alert-danger");
            errorMessage.classList.add("alert-success");
            errorMessage.style.display = "block";


            window.location.href = 'http://localhost/CO3049_assignment/public/auth/login';
        } else {
            errorMessage.textContent = data.message || "Đăng ký thất bại. Vui lòng thử lại.";
            errorMessage.classList.add("alert-danger");
            errorMessage.style.display = "block";
        }
    } catch (error) {
        console.error("Lỗi khi gửi form", error);
    }
}