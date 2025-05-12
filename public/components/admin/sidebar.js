document.querySelector('#sidebar').insertAdjacentHTML("beforeend", `
    <div class="sidebar-wrapper active">
        <div class="sidebar-header position-relative">
            <a href="http://localhost/CO3049_assignment/public/admin/home" class="logo text-decoration-none fw-bold fs-2">
                <span>CINEMA</span>
            </a>
            <div class="d-flex justify-content-between align-items-center">
                <div class="sidebar-toggler x">
                    <a href="#" class="sidebar-hide d-xl-none d-block"><i class="bi bi-x bi-middle"></i></a>
                </div>
            </div>
        </div>
        <div class="sidebar-menu">
            <ul class="menu">
                <li class="sidebar-title">Menu</li>
    
                <li class="sidebar-item">
                    <a href="http://localhost/CO3049_assignment/public/admin/home" class='sidebar-link'>
                        <i class="bi bi-grid-fill"></i>
                        <span>Home</span>
                    </a>
                </li>
                <li class="sidebar-item has-sub">
                    <a href="#" class='sidebar-link'>
                        <i class="bi bi-journal-check"></i>
                        <span>Tác vụ media</span>
                    </a>
                    <ul class="submenu">
                        <li class="submenu-item">
                            <a href="http://localhost/CO3049_assignment/public/admin/media?view=UpdatePage" class='submenu-link'>
                                <span>Sửa media</span>
                            </a>
                        </li>
                        <li class="submenu-item">
                            <a href="http://localhost/CO3049_assignment/public/admin/media?view=insertPage" class='submenu-link'>
                                <span>Thêm media</span>
                            </a>
                        </li>
                    </ul>
                </li>
                <li class="sidebar-item has-sub">
                    <a href="#" class='sidebar-link'>
                        <i class="bi bi-journal-check"></i>
                        <span>Tác vụ với rạp</span>
                    </a>
                    <ul class="submenu ">
                        <li class="submenu-item ">
                            <a href="http://localhost/CO3049_assignment/public/admin/cinema?view=cinemaPage" class='submenu-link'>
                                <span>Thông tin rạp</span>
                            </a>
                        </li>
                        <li class="submenu-item">
                            <a href="http://localhost/CO3049_assignment/public/admin/cinema?view=seatPage" class='submenu-link'>
                                <span>Sơ đồ phòng</span>
                            </a>
                        </li>
                        <li class="submenu-item">
                            <a href="http://localhost/CO3049_assignment/public/admin/cinema?view=showtimePage" class='submenu-link'>
                                <span>Lịch chiếu</span>
                            </a>
                        </li>
                        <li class="submenu-item">
                            <a href="http://localhost/CO3049_assignment/public/admin/cinema?view=productPage" class='submenu-link'>
                                <span>Sản phẩm bán</span>
                            </a>
                        </li>
                    </ul>
                </li>
                <li class="sidebar-item has-sub">
                    <a href="#" class='sidebar-link'>
                        <i class="bi bi-journal-check"></i>
                        <span>Doanh thu</span>
                    </a>
                    <ul class="submenu ">
                        <li class="submenu-item ">
                            <a href="http://localhost/CO3049_assignment/public/admin/revenue?view=productPage" class='submenu-link'>
                                <span>Danh số theo sản phẩm</span>
                            </a>
                        </li>
                        <li class="submenu-item">
                            <a href="http://localhost/CO3049_assignment/public/admin/revenue?view=moviePage" class='submenu-link'>
                                <span>Doanh số theo phim</span>
                            </a>
                        </li>
                        <li class="submenu-item">
                            <a href="http://localhost/CO3049_assignment/public/admin/revenue?view=cinemaPage" class='submenu-link'>
                                <span>Doanh số theo rạp</span>
                            </a>
                        </li>
                    </ul>
                </li>
                



            </ul>
        </div>
    </div>
    `);
    
    // Đánh dấu mục đang active dựa vào URL
    const currentUrl = window.location.href;

    document.querySelectorAll('.submenu-link').forEach(link => {
        if (link.href === currentUrl) {
            // Thêm class active cho chính link
            link.classList.add('active');

            // Nếu nằm trong submenu-item
            const submenuItem = link.closest('.submenu-item');
            if (submenuItem) {
                submenuItem.classList.add('active');

                // Mở menu cha cấp trên (li.has-sub)
                const hasSub = link.closest('.has-sub');
                if (hasSub) {
                    hasSub.classList.add('active');
                }
            } else {
                // Nếu là sidebar-item trực tiếp
                const parentItem = link.closest('.submenu-item');
                if (parentItem) {
                    parentItem.classList.add('active');
                }
            }
        }
    });


    
//     <li class="sidebar-item has-sub">
//     <a href="#" class='sidebar-link'>
//         <i class="bi bi-journal-check"></i>
//         <span>Người dùng</span>
//     </a>
//     <ul class="submenu ">
//         <li class="submenu-item ">
//             <a href="http://localhost/CO3049_assignment/public/admin..." class='submenu-link'>
//                 <span>Hỏi đáp</span>
//             </a>
//         </li>
//         <li class="submenu-item ">
//             <a href="http://localhost/CO3049_assignment/public/admin..." class='submenu-link'>
//                 <span>Tài khoản</span>
//             </a>
//         </li>
//     </ul>
// </li>
// <li class="sidebar-item has-sub">
//     <a href="#" class='sidebar-link'>
//         <i class="bi bi-journal-check"></i>
//         <span>Giao dịch</span>
//     </a>
//     <ul class="submenu ">
//         <li class="submenu-item ">
//             <a href="http://localhost/CO3049_assignment/public/admin..." class='submenu-link'>
//                 <span></span>
//             </a>
//         </li>
//         <li class="submenu-item ">
//             <a href="http://localhost/CO3049_assignment/public/admin..." class='submenu-link'>
//                 <span>Tài khoản</span>
//             </a>
//         </li>
//     </ul>
// </li>
