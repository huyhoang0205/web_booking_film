let allCinemas = []; // Dữ liệu rạp gốc
let currentPage = 1;
const itemsPerPage = 7; // Số rạp hiển thị trên mỗi trang
async function getCinema() {
    try {
        const response = await fetch('http://localhost/CO3049_assignment/public/main/getCinema');
        const result = await response.json();
        if (result.status) {
            allCinemas = result.data;
            renderCinemas(allCinemas);
            setupPagination(allCinemas);
        } else {
            console.error('Không có dữ liệu rạp');
        }
    } catch (error) {
        console.error('Lỗi khi lấy dữ liệu rạp:', error);
    }
}

function renderCinemas(cinemas) {
    const listCinema = document.getElementById('listCinema');
    if (!listCinema) return;

    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedItems = cinemas.slice(startIndex, startIndex + itemsPerPage);

    if (paginatedItems.length === 0) {
        listCinema.innerHTML = `<p class="text-muted">Không tìm thấy rạp nào phù hợp.</p>`;
        return;
    }

    listCinema.innerHTML = paginatedItems.map(cinema => `
        <div class="cinema-card-wrapper mb-3">
            <div class="card shadow-sm" style="cursor: pointer;" onclick="getMovieByCinema(${cinema.id}, this.parentElement)">
                <div class="card-body">
                    <h5 class="card-title">${cinema.name}</h5>
                    <p class="card-text">
                        <i class="bi bi-geo-alt-fill text-danger me-1"></i>${cinema.location}<br>
                        <i class="bi bi-clock-fill text-primary me-1"></i>${cinema.open_time} - ${cinema.close_time}
                    </p>
                </div>
            </div>
        </div>
    `).join('');
}

function setupPagination(items) {
    const pagination = document.getElementById('pagination');
    pagination.innerHTML = '';

    const pageCount = Math.ceil(items.length / itemsPerPage);

    if (pageCount <= 1) return;

    // Previous button
    const prevLi = document.createElement('li');
    prevLi.className = `page-item ${currentPage === 1 ? 'disabled' : ''}`;
    prevLi.innerHTML = `<a class="page-link" href="#" aria-label="Previous" onclick="changePage(${currentPage - 1})">
        <span aria-hidden="true">&laquo;</span>
    </a>`;
    pagination.appendChild(prevLi);

    // Page numbers
    for (let i = 1; i <= pageCount; i++) {
        const li = document.createElement('li');
        li.className = `page-item ${i === currentPage ? 'active' : ''}`;
        li.innerHTML = `<a class="page-link" href="#" onclick="changePage(${i})">${i}</a>`;
        pagination.appendChild(li);
    }

    // Next button
    const nextLi = document.createElement('li');
    nextLi.className = `page-item ${currentPage === pageCount ? 'disabled' : ''}`;
    nextLi.innerHTML = `<a class="page-link" href="#" aria-label="Next" onclick="changePage(${currentPage + 1})">
        <span aria-hidden="true">&raquo;</span>
    </a>`;
    pagination.appendChild(nextLi);
}

function changePage(page) {
    if (page < 1 || page > Math.ceil(allCinemas.length / itemsPerPage)) return;

    currentPage = page;
    renderCinemas(allCinemas);
    setupPagination(allCinemas);

    // Scroll to top of list
    document.getElementById('listCinema').scrollIntoView({
        behavior: 'smooth'
    });
}

document.getElementById('cinemaSearch').addEventListener('input', function(e) {
    const searchTerm = e.target.value.toLowerCase();
    const filteredCinemas = allCinemas.filter(cinema =>
        cinema.name.toLowerCase().includes(searchTerm) ||
        cinema.location.toLowerCase().includes(searchTerm)
    );

    renderCinemas(filteredCinemas);
    setupPagination(filteredCinemas);
});

document.addEventListener('DOMContentLoaded', function() {
    getCinema();
});

async function getMovieByCinema(cinemaId, container) {
    try {
        const existingMovieList = container.querySelector('.movie-by-cinema');
        if (existingMovieList) {
            existingMovieList.remove(); // Nếu đang mở, thì ẩn đi
            return;
        }

        let url = 'http://localhost/CO3049_assignment/public/main/getShowtime';
        if (cinemaId) {
            url += `?cinema_id=${cinemaId}`;
        }

        const response = await fetch(url);
        const result = await response.json();

        const movieSection = document.createElement('div');
        movieSection.classList.add('movie-by-cinema');
        if (result.status) {
            const grouped = {};
            for (const showtime of result.data) {
                if (!grouped[showtime.media_id]) {
                    grouped[showtime.media_id] = [];
                }
                grouped[showtime.media_id].push(showtime);
            }

            for (const [media_id, showtimes] of Object.entries(grouped)) {
                const groupedByDate = {};
                for (const s of showtimes) {
                    if (!groupedByDate[s.date]) {
                        groupedByDate[s.date] = [];
                    }
                    groupedByDate[s.date].push(s);
                }

                const movieCard = document.createElement('div');
                movieCard.innerHTML = `
                    <div class="row mb-3">
                        <div class="col-3 d-flex align-items-center">
                            <div class="card-image" style="width: 100%; aspect-ratio: 3 / 5; overflow: hidden; border-radius: 12px;">
                                <img 
                                    src="http://localhost/CO3049_assignment/public/main/displayMedia?id=${media_id}" 
                                    alt="Poster"
                                    style="width: 100%; height: 100%; object-fit: cover; transition: transform 0.3s ease;" 
                                    class="rounded-3 shadow-sm hover-zoom"
                                />
                            </div>
                        </div>
                        <div class="col-9 p-4">
                            <div class="card border-0 shadow-lg rounded-4 overflow-hidden mb-4">
                                <div class="p-4">
                                    <h5 class="card-title text-primary fw-bold mb-4 d-flex align-items-center">
                                       Phim ID: ${media_id}
                                    </h5>
                                    ${Object.entries(groupedByDate).map(([date, slots]) => `
                                        <div class="mb-4 pb-3 border-bottom">
                                            <div class="fw-semibold mb-2 d-flex align-items-center">
                                               ${date}
                                            </div>
                                            <div class="d-flex flex-wrap gap-2">
                                                ${slots.map(slot => `
                                                    <a href="http://localhost/CO3049_assignment/public/main/booking?showtime_id=${slot.id}" 
                                                    class="btn btn-outline-primary px-3 py-2 rounded-pill shadow-sm fw-medium"
                                                    style="transition: all 0.2s ease-in-out;">
                                                       ${slot.start_time.slice(11, 16)}
                                                    </a>
                                                `).join('')}
                                            </div>
                                        </div>
                                    `).join('')}
                                </div>
                            </div>
                        </div>
                    </div>
                 </div>
                 
            `;


                movieSection.appendChild(movieCard);
            }
        } else {
            movieSection.innerHTML = `
                <div class="d-flex justify-content-center align-items-center border rounded" style="height: 200px;">
                    <div class="text-muted fs-5 fst-italic">Chưa có phim khởi chiếu</div>
                </div>
            `;
        }

        container.appendChild(movieSection);
    } catch (error) {
        console.error('Lỗi khi lấy dữ liệu phim:', error);
    }
}