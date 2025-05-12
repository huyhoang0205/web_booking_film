const startHeader = `
<header class="p-4 container-lg" >
    <div class="navbar p-0">
        <a href="http://localhost/CO3049_assignment/public/" class="logo text-decoration-none fw-bold fs-2">
            <span>CINEMA</span>
        </a>
`;

const endHeader = `
    <div class="navbar p-0">
        <div>
            <a href="http://localhost/CO3049_assignment/public/main/cinema" class="text-decoration-none text-primary fw-bold">Rạp</a>
        </div>
        <div class="d-flex gap-4">
            <a href="http://localhost/CO3049_assignment/public/main/contact" class="text-decoration-none text-primary fw-bold">Contact</a>
            <a href="http://localhost/CO3049_assignment/public/main/about" class="text-decoration-none text-primary fw-bold">About</a>
        </div>
    </div>
</header>
`;

const adminHeader = `
    <div class="d-flex gap-1">
        <a href="http://localhost/CO3049_assignment/public/admin/home" class="btn btn-primary rounded-pill text-white text-decoration-none fw-bold">Quản lí</a>
        <a href="http://localhost/CO3049_assignment/public/auth/logout" class="btn text-decoration-none fw-bold text-danger">Đăng xuất</a>
    </div>
</div>
`;

const loginHeader = `
    <div class="dropdown">
        <a href="#" class="sidebar-link" id="userDropdown" data-bs-toggle="dropdown" aria-expanded="false">
            <i class="bi bi-person-circle text-primary fs-2"></i>
        </a>
        <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="userDropdown">
            <li><a class="dropdown-item" href="http://localhost/CO3049_assignment/public/customer/profile?view=profilePage"><span>Tài khoản</span></a></li>
            <li><a class="dropdown-item" href="http://localhost/CO3049_assignment/public/customer/profile?view=orderPage"><span>Lịch sử mua hàng</span></a></li>
            <li><hr class="dropdown-divider"></li>
            <li><a class="dropdown-item text-danger" href="http://localhost/CO3049_assignment/public/auth/logout"><span>Đăng xuất</span></a></li>
        </ul>
        </div>

    </div>
`;

const guestHeader = `
    <div class="d-flex gap-1">
        <a href="http://localhost/CO3049_assignment/public/auth/login" class="btn text-primary text-decoration-none fw-bold">Đăng nhập</a>
        <a href="http://localhost/CO3049_assignment/public/auth/register" class="btn btn-primary rounded-pill text-white text-decoration-none fw-bold">Đăng kí</a>
    </div>
</div>
`;

(async () => {
    let headerContent = "";

    try {
        const response = await fetch('http://localhost/CO3049_assignment/public/auth/getRole');
        const data = await response.json();

        if (data.status) {
            if (data.role === "admin") {
                headerContent = adminHeader;
            } else if (data.role === "customer") {
                headerContent = loginHeader;
            }
        } else {
            headerContent = guestHeader;
        }
    } catch (error) {
        console.error("Lỗi fetch:", error);
        headerContent = guestHeader;
    }

    document.querySelector('#header').innerHTML = startHeader + headerContent + endHeader;
})();
