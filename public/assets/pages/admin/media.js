let mediaApi;
const mediaOptions = {
    defaultColDef: {
        editable: true,
        filter: true,
        flex: 1,
        minWidth: 100,
    },
    columnDefs: [{ // Hành động (buttons)
            headerName: "Hành động",
            cellRenderer: (params) => {
                return `
                    <button class="btn btn-sm btn-primary" onclick="editMedia(${params.data.id})">Sửa</button>
                    <button class="btn btn-sm btn-danger" onclick="deleteMedia(${params.data.id})">Xóa</button>
                `;
            },
            pinned: 'right',
            maxWidth: 130,
        },
        {
            field: "id",
            headerName: "ID",
            minWidth: 70
        },
        {
            field: "filename",
            headerName: "Hình Ảnh",
            minWidth: 150
        },
        {
            field: "title",
            headerName: "Tiêu Đề",
            minWidth: 200
        },
        {
            field: "description",
            headerName: "Mô Tả",
            minWidth: 300
        },
        {
            field: "type",
            headerName: "Loại",
            minWidth: 100
        },
        {
            field: "status",
            headerName: "Trạng Thái",
            minWidth: 120
        },
        {
            field: "start_date",
            headerName: "Ngày Bắt Đầu",
            minWidth: 150
        },
        {
            field: "end_date",
            headerName: "Ngày Kết Thúc",
            minWidth: 150
        },
        {
            field: "duration",
            headerName: "Thời Lượng (phút)",
            minWidth: 150
        },
        {
            field: "genre",
            headerName: "Thể Loại",
            minWidth: 150
        },
        {
            field: "trailer",
            headerName: "Trailer",
            minWidth: 200
        },
        {
            field: "language",
            headerName: "Ngôn Ngữ",
            minWidth: 120
        },
        {
            field: "country",
            headerName: "Quốc Gia",
            minWidth: 120
        },
        {
            field: "classification",
            headerName: "Phân Loại",
            minWidth: 100
        },
        {
            field: "created_at",
            headerName: "Ngày Tạo",
            minWidth: 180
        },
        {
            field: "updated_at",
            headerName: "Ngày Cập Nhật",
            minWidth: 180
        },
    ],
    paginationAutoPageSize: true,
    pagination: true,
    localeText: {
        page: 'Trang',
        to: 'đến',
        of: 'trong tổng',
        nextPage: 'Trang sau',
        lastPage: 'Trang cuối',
        firstPage: 'Trang đầu',
        previousPage: 'Trang trước',
        loadingOoo: 'Đang tải...',
    },
};

function fetchAndRenderTable() {
    const type = document.querySelector('input[name="typeGet"]:checked').value;
    fetch(`http://localhost/CO3049_assignment/public/admin/getMedia?type=${type}`)
        .then(response => response.json())
        .then(data => {
            mediaApi.setGridOption("rowData", []);
            mediaApi.setGridOption("rowData", data.data);
        });
}

window.onload = function() {
    handleTypeChange();


    const params = new URLSearchParams(window.location.search);
    const view = params.get('view');

    document.getElementById('insertPage').style.display = 'none';
    document.getElementById('updatePage').style.display = 'none';

    if (view === 'insertPage') {
        document.getElementById('insertPage').style.display = 'block';
    } else {
        document.getElementById('updatePage').style.display = 'block';
    }

    // Thêm active cho nút
    const btnInsert = document.getElementById('btn-insert');
    const btnUpdate = document.getElementById('btn-update');

    if (view === 'insertPage') {
        btnInsert.classList.add('active');
    } else {
        btnUpdate.classList.add('active');
    }




    const gridDiv = document.querySelector("#mediaTable");
    mediaApi = agGrid.createGrid(gridDiv, mediaOptions);

    document.querySelectorAll('input[name="typeGet"]').forEach((radio) => {
        radio.addEventListener('change', fetchAndRenderTable);
    });

    fetchAndRenderTable();


};

document.getElementById("type").addEventListener("change", handleTypeChange);

function handleTypeChange() {
    const selectedType = document.getElementById("type").value;
    const infoMovie = document.getElementById("infoMovie");

    if (selectedType === "movie") {
        infoMovie.classList.remove("d-none");
    } else {
        infoMovie.classList.add("d-none");
    }
}


const validationMeida = new JustValidate('#mediaForm');

validationMeida
    .addField('#file', [{
        rule: 'minFilesCount',
        value: 1,
        errorMessage: 'Vui lòng thêm ảnh'
    }, ])
    .addField('[name="title"]', [{
            rule: 'required',
            errorMessage: 'Tiêu đề không được bỏ trống'
        },
        {
            rule: 'minLength',
            value: 3,
            errorMessage: 'Độ dài phải lớn hơn 3 ký tự'
        },
    ])
    .addField('[name="description"]', [{
            rule: 'required',
            errorMessage: 'Mô tả không được bỏ trống'
        },
        {
            rule: 'minLength',
            value: 3,
            errorMessage: 'Độ dài phải lớn hơn 3 ký tự'
        },
    ])
    .addField('[name="start_date"]', [{
            rule: 'required',
            errorMessage: 'Ngày bắt đầu không được bỏ trống'
        },
        {
            validator: (value) => !isNaN(Date.parse(value)),
            errorMessage: 'Ngày không hợp lệ'
        },
    ])
    .addField('[name="end_date"]', [{
            rule: 'required',
            errorMessage: 'Ngày kết thúc không được bỏ trống'
        },
        {
            validator: (value) => !isNaN(Date.parse(value)),
            errorMessage: 'Ngày không hợp lệ'
        },
        {
            validator: (value, fields) => {
                const startDate = new Date(fields['[name="start_date"]'].elem.value);
                const endDate = new Date(value);
                return endDate > startDate;
            },
            errorMessage: 'Ngày kết thúc phải sau ngày bắt đầu',
        },
    ]);

if (document.querySelector('#mediaForm select[name="type"]').value === "movie") {
    validationMeida
        .addField('[name="duration"]', [{
                rule: 'required',
                errorMessage: 'Thời gian không được bỏ trống'
            },
            {
                rule: 'integer',
                errorMessage: 'Thời gian phải là số nguyên'
            },
        ])
        .addField('[name="genre"]', [{
                rule: 'required',
                errorMessage: 'Thể loại không được bỏ trống'
            },
            {
                rule: 'minLength',
                value: 3,
                errorMessage: 'Thể loại phải có ít nhất 3 ký tự'
            },
            {
                rule: 'customRegexp',
                value: /^[a-zA-Z\s]+$/,
                errorMessage: 'Thể loại chỉ chấp nhận chữ và khoảng trắng'
            } // Optional check for genre
        ]);
}



// Gắn submit listener 1 lần duy nhất
document.getElementById('mediaForm').addEventListener('submit', async function(e) {
    e.preventDefault();

    const isValid = await validationMedia.validate();
    if (isValid) {
        insertMedia();
    } else {
        console.log('Form has errors.');
    }
});

// Hàm xử lý gửi dữ liệu
async function insertMedia() {
    try {
        const form = document.getElementById('mediaForm');
        const dataForm = new FormData(form);
        dataForm.append('file', document.getElementById('file').files[0]);

        const response = await fetch('http://localhost/CO3049_assignment/public/admin/insertMedia', {
            method: 'POST',
            body: dataForm,
        });

        const res = await response.json();
        if (res.status) {
            document.getElementById('message').innerHTML = 'Thêm mới thành công!';
            document.getElementById('message').style.color = 'green';
            form.reset();
        } else {
            document.getElementById('message').innerHTML = res.message || 'Thêm mới thất bại!';
            document.getElementById('message').style.color = 'red';
        }
    } catch (error) {
        console.error('Error:', error);
        document.getElementById('message').innerHTML = 'Đã xảy ra lỗi!';
        document.getElementById('message').style.color = 'red';
    }
}

async function deleteMedia(id) {
    console.log(id);
    try {
        if (!confirm("Bạn có chắc chắn muốn xóa không?")) return;
        dataForm = new FormData();
        dataForm.append('id', id);
        const response = await fetch(`http://localhost/CO3049_assignment/public/admin/deleteMedia`, {
            method: 'POST',
            body: dataForm
        });
        const result = await response.json();
        if (result.status) {
            fetchAndRenderTable();
        } else {
            console.error("Lỗi khi xóa:", result.message);
        }
    } catch (error) {
        console.error("Lỗi khi xóa:", error);
    }
}

async function viewMedia(id) {
    try {
        document.getElementById('mediaDetails').innerHTML = '';
        document.getElementById('mediaDetails').innerHTML = `
            <div class="text-center"><img src="http://localhost/CO3049_assignment/public/main/displayMedia?id=${id}" alt="Media Image" class="img-fluid"></div>
        `;
        const mediaModal = new bootstrap.Modal(document.getElementById('mediaModal'));
        mediaModal.show();

    } catch (error) {
        console.error("Lỗi ", error);
    }

}

async function editMedia(id) {
    try {
        const response = await fetch(`http://localhost/CO3049_assignment/public/admin/getMedia?id=${id}`);
        const result = await response.json();
        if (!result.status) {
            console.error("Lỗi khi lấy dữ liệu:", result.message);
            return;
        }
        const movie = result.data[0];
        document.querySelector('#updateModal #img').innerHTML = `
            <img src="http://localhost/CO3049_assignment/public/main/displayMedia?id=${id}" alt="Media Image" style="height: 200px;">
        `;


        document.querySelector('#updateModal input[name="id"]').value = id;

        document.querySelector('#updateModal input[name="type"]').value = movie.type || null;
        console.log(movie);

        document.querySelector('#updateModal input[name="title"]').value = movie.title;
        document.querySelector('#updateModal input[name="description"]').value = movie.description;
        document.querySelector('#updateModal input[name="status"]').value = movie.status;

        document.querySelector('#updateModal input[name="start_date"]').value = movie.start_date;
        document.querySelector('#updateModal input[name="end_date"]').value = movie.end_date;
        document.querySelector('#updateModal input[name="duration"]').value = movie.duration;
        document.querySelector('#updateModal input[name="genre"]').value = movie.genre;
        document.querySelector('#updateModal input[name="trailer"]').value = movie.trailer;
        document.querySelector('#updateModal input[name="language"]').value = movie.language;
        document.querySelector('#updateModal input[name="country"]').value = movie.country;
        document.querySelector('#updateModal input[name="classification"]').value = movie.classification;




        const updateModal = new bootstrap.Modal(document.getElementById('updateModal'));
        updateModal.show();
    } catch (error) {
        console.error("Lỗi ", error);
    }
}

async function updateMedia() {
    try {
        const dataForm = new FormData(document.getElementById('updateForm'));

        const response = await fetch(`http://localhost/CO3049_assignment/public/admin/updateMedia`, {
            method: 'POST',
            body: dataForm
        });
        const result = await response.json();
        if (result.status) {
            document.getElementById('updateMessage').innerHTML = 'Cập nhật thành công!';
            document.getElementById('updateMessage').style.color = 'green';
            fetchAndRenderTable();
        } else {
            document.getElementById('updateMessage').innerHTML = result.message || 'Cập nhật thất bại!';
            document.getElementById('updateMessage').style.color = 'red';
        }
    } catch (error) {
        console.error("Lỗi ", error);
        document.getElementById('updateMessage').innerHTML = 'Đã xảy ra lỗi!';
        document.getElementById('updateMessage').style.color = 'red';
    }
}

function getMediaCSV() {
    const type = document.querySelector('input[name="typeGet"]:checked').value;
    window.location.href = `http://localhost/CO3049_assignment/public/admin/getMediaCSV?type=${type}`;
}
