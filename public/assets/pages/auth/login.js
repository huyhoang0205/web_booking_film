const validationLogin = new JustValidate('#loginForm');

validationLogin
    .addField('[name="account"]', [{
            rule: 'required',
            errorMessage: 'Vui lòng không được bỏ trống'
        },
        {
            rule: 'minLength',
            value: 3,
            errorMessage: 'Độ dài phải lớn hơn 3 ký tự'
        },
    ])
    .addField('[name="password"]', [{
            rule: 'required',
            errorMessage: 'Mật khẩu không được bỏ trống'
        },
        {
            rule: 'minLength',
            value: 6,
            errorMessage: 'Mật khẩu phải có ít nhất 6 ký tự'
        },
    ]);

document.getElementById('loginForm').addEventListener('submit', async function(e) {
    e.preventDefault();

    const isValid = await validationLogin.validate();
    if (isValid) {
        login(); // Gọi hàm xử lý submit nếu form hợp lệ
    } else {
        console.log('Form has errors.');
    }
});

async function login() {
    try {
        const errorMessage = document.getElementById("error-message");

        const dataForm = new FormData(document.getElementById("loginForm"));
        const rememberCheckbox = document.getElementById('flexCheckDefault');
        if (rememberCheckbox.checked) {
            dataForm.append('remember', 'on');
        } else {
            dataForm.append('remember', 'off');
        }
        // Gửi yêu cầu đăng ký đến server
        const response = await fetch('http://localhost/CO3049_assignment/public/auth/login', {
            method: 'POST',
            body: dataForm,
        });

        const data = await response.json();
        console.log(data);
        if (data.status) {
            errorMessage.textContent = data.message || "Đăng nhập thành công.";
            errorMessage.classList.remove("alert-danger");
            errorMessage.classList.add("alert-success");
            errorMessage.style.display = "block";


            window.location.href = 'http://localhost/CO3049_assignment/public/';
        } else {
            errorMessage.textContent = data.message || "Đăng nhập thất bại. Vui lòng thử lại.";
            errorMessage.classList.add("alert-danger");
            errorMessage.style.display = "block";
        }
    } catch (error) {
        console.error("Lỗi khi gửi form", error);
    }
}