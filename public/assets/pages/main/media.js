
const urlParams = new URLSearchParams(window.location.search);
const mediaId = urlParams.get('media_id');
window.onload = function() {
    loadPage();
};

async function loadPage() {
    const response = await fetch(`http://localhost/CO3049_assignment/public/main/getMedia?id=${mediaId}`);
    const res = await response.json();
    if (res.status) {
        const movie = res.data[0];

        document.getElementById('image').innerHTML = `
            <div class="card-image" style="width: 100%; aspect-ratio: 2 / 3; overflow: hidden; position: relative; border-radius: 12px;">
                <div class="classification classification-${movie.classification}">
                    ${movie.classification}
                </div>
                <img 
                    src="http://localhost/CO3049_assignment/public/main/displayMedia?id=${mediaId}" 
                    alt="Poster"
                    style="width: 100%; height: 100%; object-fit: fill;" 
                />
            </div>
        `;

        document.getElementById('content').innerHTML = `
            <div class="movie-details">
                <h1 class="movie-title">${movie.title}</h1>
                <p class="movie-description">${movie.description}</p>
                <p class="movie-duration"><i class="bi bi-clock"></i> <strong>Thời gian:</strong> ${movie.duration} phút</p>
                <p class="movie-release"><i class="bi bi-calendar"></i> <strong>Ngày phát hành:</strong> ${movie.start_date}</p>
                <p class="movie-genre"><i class="bi bi-tags"></i> <strong>Thể loại:</strong> ${movie.genre}</p>
            </div>
        `;

        const today = new Date();
        const startDate = new Date(movie.start_date);

        if (startDate > today.setHours(0, 0, 0, 0)) {
            document.getElementById("showtimePage").style.display = "none";
        } else {
            loadCinema();
        }


        if (movie.trailer && movie.trailer.trim() !== "") {
            const trailerContainer = document.getElementById("trailer");

            trailerContainer.innerHTML = `
                <div class="mt-4">
                    <div class="ratio ratio-21x9">
                        <iframe src="${movie.trailer}" 
                                title="Trailer" 
                                allowfullscreen 
                                style="border-radius: 12px;">
                        </iframe>
                    </div>
                </div>
            `;
        } else {
            document.getElementById("trailer").style.display = "none";
        }


    }
}

async function loadCinema() {
    try {
        const response = await fetch(`http://localhost/CO3049_assignment/public/main/getCinema`);
        const data = (await response.json());
        const cinemaSelect = document.getElementById('cinemaSelect');
        cinemaSelect.innerHTML = '<option selected disabled>Chọn rạp</option>';
        console.log(data);
        data.data.forEach((cinema, index) => {
            const option = document.createElement('option');
            option.value = cinema.id;
            option.textContent = cinema.name;
            cinemaSelect.appendChild(option);
            if (index === 0) {
                option.selected = true;
            }
            loadDate();

        });
    } catch (error) {
        console.error("Lỗi khi xử lí:", error);
    }
}

document.getElementById('cinemaSelect').addEventListener('change', function() {
    const selectedCinema = this.value;
    const dateSelect = document.getElementById('dateSelect');
    dateSelect.innerHTML = 'Chưa có lịch chiếu cho ngày này. Hãy quay lại sau. Xin cám ơn.'; // Xóa nút cũ nếu có
    loadDate();
});

function loadDate() {
    try {
        const dateSelect = document.getElementById('dateSelect');
        dateSelect.innerHTML = ''; // Xóa nút cũ nếu có
        const weekdays = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
        const today = new Date();

        for (let i = 0; i < 7; i++) {
            const currentDate = new Date(today);
            currentDate.setDate(today.getDate() + i);

            const dayOfWeek = weekdays[currentDate.getDay()];
            const day = String(currentDate.getDate()).padStart(2, '0');
            const month = String(currentDate.getMonth() + 1).padStart(2, '0');
            const year = currentDate.getFullYear();

            const button = document.createElement('button');
            button.type = 'button';

            button.className = 'btn btn-outline-primary border-0';
            button.style.width = '70px';
            button.style.height = '60px';
            button.innerHTML = `
                <div class="text-center">${dayOfWeek}</div>
                <div class="text-center">${day}/${month}</div>
            `;

            button.value = `${year}-${month}-${day}`;


            button.addEventListener('click', function() {
                document.querySelectorAll('#dateSelect button').forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');
                const showtimeDetail = document.getElementById('showtime-detail');
                showtimeDetail.innerHTML = '';
                const selectedDate = this.value;
                loadTime(selectedDate);
            });

            dateSelect.appendChild(button);

        }
    } catch (error) {
        console.error("Lỗi khi xử lí:", error);
    }
}

async function loadTime(date) {
    try {
        const cinemaSelect = document.getElementById('cinemaSelect');
        const cinemaId = cinemaSelect.value;
        const response = await fetch(`http://localhost/CO3049_assignment/public/main/getShowtime?media_id=${mediaId}&cinema_id=${cinemaId}&date=${date}`);
        const data = await response.json();

        const showtimeDetail = document.getElementById('showtime-detail');

        if (!data.status) {
            showtimeDetail.innerHTML = 'Chưa có lịch chiếu cho ngày này. Hãy quay lại sau. Xin cám ơn.';
            return;
        }

        console.log(data);

        data.data.forEach(showtime => {
            const button = document.createElement('button');
            button.type = 'button';

            button.className = 'btn btn-outline-primary';

            const startTime = new Date(showtime.start_time);
            const endTime = new Date(showtime.end_time);

            const startHour = startTime.getHours().toString().padStart(2, '0');
            const startMinute = startTime.getMinutes().toString().padStart(2, '0');

            button.innerHTML = `
                <div class="time-button">
                    <div class="time-text text-center">${startHour}:${startMinute}</div>
                </div>
            `;

            button.value = `${showtime.id}`; // Lưu lại thời gian bắt đầu

            button.addEventListener('click', function() {
                window.location.href = `http://localhost/CO3049_assignment/public/main/booking?showtime_id=${showtime.id}`;
            });

            showtimeDetail.appendChild(button); // Thêm button vào DOM

            if (showtimeDetail.innerHTML === '') {
                showtimeDetail.innerHTML = 'Chưa có lịch chiếu cho ngày này. Hãy quay lại sau. Xin cám ơn.';
            }
        });

    } catch (error) {
        console.error("Lỗi khi xử lí:", error);
    }
}