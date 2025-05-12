const THEME_KEY = "theme"

function toggleDarkTheme() {
  const newTheme = document.documentElement.getAttribute("data-bs-theme") === 'dark'
    ? "light"
    : "dark";
  setTheme(newTheme);
}

/**
 * Set theme for the website and ag-Grid
 * @param {"dark"|"light"} theme
 * @param {boolean} persist 
 */
function setTheme(theme, persist = false) {
  // Thay đổi theme cho trang (data-bs-theme)
  document.body.classList.add(theme);
  document.documentElement.setAttribute('data-bs-theme', theme);
  
  // Cập nhật data-ag-theme-mode cho ag-Grid
  const gridElement = document.querySelector("[data-ag-theme-mode]");
  if (gridElement) {
    gridElement.setAttribute("data-ag-theme-mode", theme);
  }

  // Lưu theme vào localStorage nếu persist là true
  if (persist) {
    localStorage.setItem(THEME_KEY, theme);
  }
}

/**
 * Init theme from setTheme()
 */
function initTheme() {
  // Nếu người dùng đã thiết lập theme, sẽ tải theme đã lưu
  const storedTheme = localStorage.getItem(THEME_KEY);
  if (storedTheme) {
    return setTheme(storedTheme, true);
  }

  // Nếu không, tự động phát hiện theo sở thích màu sắc của người dùng
  if (!window.matchMedia) {
    return;
  }

  // Media query để phát hiện sở thích tối
  const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

  // Đăng ký lắng nghe sự thay đổi sở thích màu sắc
  mediaQuery.addEventListener("change", (e) =>
    setTheme(e.matches ? "dark" : "light", true)
  );
  return setTheme(mediaQuery.matches ? "dark" : "light", true);
}

window.addEventListener('DOMContentLoaded', () => {
  const toggler = document.getElementById("toggle-dark");
  const theme = localStorage.getItem(THEME_KEY);

  // Thiết lập trạng thái của công tắc theme từ localStorage
  if (toggler) {
    toggler.checked = theme === "dark";
    
    // Lắng nghe sự kiện thay đổi từ công tắc và cập nhật theme
    toggler.addEventListener("input", (e) => {
      setTheme(e.target.checked ? "dark" : "light", true);
    });
  }
});

initTheme();
