window.onload = function() {
    loadPoster();
    loadMovie();
};
async function loadPoster() {
    try {
        const response = await fetch('http://localhost/CO3049_assignment/public/main/getMedia?status=showing&type=poster');
        const res = await response.json();
        console.log(res);
        if (res.status) {
            let posters = res.data;
            const wrapper = document.querySelector('#displayPoster .swiper-wrapper');
            wrapper.innerHTML = '';

            posters.forEach(poster => {
                const slide = document.createElement('div');
                slide.classList.add('swiper-slide');
                slide.innerHTML = `
                    <div class="card-image" style="width: 100%; aspect-ratio: 21 / 7; overflow: hidden; position: relative; border-radius: 12px;">
                        <img 
                            src="http://localhost/CO3049_assignment/public/main/displayMedia?id=${poster.id}" 
                            alt="Poster"
                            style="width: 100%; height: 100%; object-fit: fill;" 
                        />
                    </div>
                `;
                wrapper.appendChild(slide);
            });

            new Swiper('#displayPoster', {
                loop: true
                , slidesPerView: 1
                , spaceBetween: 10
                , pagination: {
                    el: '#displayPoster .swiper-pagination'
                    , clickable: true
                , }
                , navigation: {
                    nextEl: '#displayPoster .swiper-button-next'
                    , prevEl: '#displayPoster .swiper-button-prev'
                , }
                , autoplay: {
                    delay: 4000
                    , disableOnInteraction: false
                , }
            });
        }
    } catch (error) {
        console.error('Error loading posters:', error);
    }
}

async function loadMovie() {
    try {
        const response = await fetch('http://localhost/CO3049_assignment/public/main/getMedia?status=showing&type=movie');
        const res = await response.json();
        console.log(res);

        if (res.status) {
            let movies = res.data;

            const today = new Date();
            const todayStr = today.toISOString().split('T')[0];

            // Filter movies
            const coming = movies.filter(movie => movie.start_date > todayStr);
            const showing = movies.filter(movie => movie.start_date <= todayStr);

            // Create the result object
            const result = {
                coming
                , showing
            };
            console.log(result);

            const wrapperShowing = document.querySelector('#displayShowing .swiper-wrapper');
            wrapperShowing.innerHTML = '';

            showing.forEach(movie => {
                const slide = document.createElement('div');
                slide.classList.add('swiper-slide');
                slide.onclick = function() {
                    window.open(`http://localhost/CO3049_assignment/public/main/media?media_id=${movie.id}`, '_blank');
                };

                slide.innerHTML = `
                    <div class="card-image" style="width: 100%; aspect-ratio: 2 / 3; overflow: hidden; position: relative; border-radius: 12px;">
                        <div class="classification classification-${movie.classification}">
                            ${movie.classification}
                        </div>

                        
                        <img 
                            src="http://localhost/CO3049_assignment/public/main/displayMedia?id=${movie.id}" 
                            alt="Poster"
                            style="width: 100%; height: 100%; object-fit: fill;" 
                        />
                    </div>
                    <div class="text-center mt-2">
                        <h5 class="d-flex text-primary fw-bold text-center movie-title"
                            style="
                                height: 3rem; /* cố định chiều cao 2 dòng */
                                line-height: 1.5rem; /* mỗi dòng cao 1.5rem */
                                display: -webkit-box;
                                -webkit-line-clamp: 2; /* hiển thị tối đa 2 dòng */
                                -webkit-box-orient: vertical;
                                overflow: hidden;
                                text-overflow: ellipsis;
                                justify-content: center; /* Căn giữa theo chiều ngang */
                                align-items: center; /* Căn giữa theo chiều dọc */
                            ">
                            ${movie.title}
                        </h5>
                        <p class="mb-2 ">
                            <i class="bi bi-clock text-warning me-1"></i>
                            <span class="fw-medium">Thời lượng:</span> ${movie.duration}
                        </p>
                        <p class="mb-0 ">
                            <i class="bi bi-tags text-success me-1"></i>
                            <span class="fw-medium">Thể loại:</span> ${movie.genre}
                        </p>
                        <div class="text-center">
                            <div class="btn btn-success mt-2">
                                Đặt vé
                            </div>
                        </div>
                    </div>


                `;

                wrapperShowing.appendChild(slide);
            });

            new Swiper('#displayShowing .swiper', {
                loop: true
                , breakpoints: {
                    0: { // Dưới 514px
                        slidesPerView: 3
                    }
                    , 1024: { // >= 1024px
                        slidesPerView: 4
                    }
                }
                , spaceBetween: 10
                , pagination: {
                    el: '#displayShowing .swiper-pagination'
                    , clickable: true
                , }
                , navigation: {
                    nextEl: '#displayShowing .swiper-button-next'
                    , prevEl: '#displayShowing .swiper-button-prev'
                , }
                , autoplay: {
                    delay: 4000
                    , disableOnInteraction: false
                , }
            });



            const wrapperComing = document.querySelector('#displayComing .swiper-wrapper');
            wrapperComing.innerHTML = '';

            coming.forEach(movie => {
                const slide = document.createElement('div');
                slide.classList.add('swiper-slide');
                slide.onclick = function() {
                    window.open(`http://localhost/CO3049_assignment/public/main/media?media_id=${movie.id}`, '_blank');
                };

                slide.innerHTML = `
                   <div class="card-image" style="width: 100%; aspect-ratio: 2 / 3; overflow: hidden; position: relative; border-radius: 12px;">
                        <div class="classification classification-${movie.classification}">
                            ${movie.classification}
                        </div>

                        
                        <img 
                            src="http://localhost/CO3049_assignment/public/main/displayMedia?id=${movie.id}" 
                            alt="Poster"
                            style="width: 100%; height: 100%; object-fit: fill;" 
                        />
                    </div>
                    <div class="text-center mt-2">
                        <h5 class="d-flex text-primary fw-bold text-center movie-title"
                            style="
                                height: 3rem; /* cố định chiều cao 2 dòng */
                                line-height: 1.5rem; /* mỗi dòng cao 1.5rem */
                                display: -webkit-box;
                                -webkit-line-clamp: 2; /* hiển thị tối đa 2 dòng */
                                -webkit-box-orient: vertical;
                                overflow: hidden;
                                text-overflow: ellipsis;
                                justify-content: center; /* Căn giữa theo chiều ngang */
                                align-items: center; /* Căn giữa theo chiều dọc */
                            ">
                            ${movie.title}
                        </h5>
                        <p class="mb-2 ">
                            <i class="bi bi-clock text-warning me-1"></i>
                            <span class="fw-medium">Thời lượng:</span> ${movie.duration}
                        </p>
                        <p class="mb-0 ">
                            <i class="bi bi-tags text-success me-1"></i>
                            <span class="fw-medium">Thể loại:</span> ${movie.genre}
                        </p>
                        <div class="text-center">
                            <a href="/dat-ve/${movie.id}" class="btn btn-outline-success mt-2">
                                Chi tiết
                            </a>
                        </div>
                    </div>
                `;

                wrapperComing.appendChild(slide);
            });

            new Swiper('#displayComing .swiper', {
                loop: true
                , breakpoints: {
                    0: { // Dưới 514px
                        slidesPerView: 3
                    }
                    , 1024: { // >= 1024px
                        slidesPerView: 4
                    }
                }
                , spaceBetween: 10
                , pagination: {
                    el: '#displayComing .swiper-pagination'
                    , clickable: true
                , }
                , navigation: {
                    nextEl: '#displayComing .swiper-button-next'
                    , prevEl: '#displayComing .swiper-button-prev'
                , }
                , autoplay: {
                    delay: 4000
                    , disableOnInteraction: false
                , }
            });
        } else {
            console.error('Failed to load movies:', res.message);

        }
    } catch (error) {
        console.error('Error loading :', error);
    }
}