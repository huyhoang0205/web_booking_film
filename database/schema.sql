DROP DATABASE IF EXISTS db;
CREATE DATABASE db;
USE db;

-- Thiết lập múi giờ Việt Nam (UTC+7)
SET time_zone = '+07:00';  -- Việt Nam (UTC+7)

-- Bảng Users (Khách hàng và Quản trị viên)
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE ,
    email VARCHAR(100) UNIQUE ,
    password VARCHAR(100) ,
    role ENUM('admin', 'customer') DEFAULT 'customer',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    name VARCHAR(100),
    avatar VARCHAR(255),
    phone VARCHAR(20),
    address VARCHAR(255),
    id_card VARCHAR(50),
    point INT DEFAULT 0,

    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS user_token (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    selector CHAR(20) NOT NULL,
    hashed_validator CHAR(64) NOT NULL,
    type ENUM('activation', 'reset', 'login') NOT NULL,
    expires_at DATETIME NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (selector)
);


CREATE TABLE IF NOT EXISTS media (
    id INT AUTO_INCREMENT PRIMARY KEY,
    filename VARCHAR(255),
    title VARCHAR(255),
    description TEXT,
    type ENUM('movie', 'poster', 'deal') default 'movie',
    status ENUM('showing', 'hidden') DEFAULT 'hidden',

    start_date DATE ,
    end_date DATE ,
    duration INT,  -- Thời lượng phim (phút)
    genre VARCHAR(100),  -- Thể loại phim
    trailer VARCHAR(500),  -- URL trailer phim
    language VARCHAR(50),  -- Ngôn ngữ phim
    country VARCHAR(100),  -- Quốc gia sản xuất
    classification ENUM('P', 'K', 'T13', 'T16', 'T18', 'C') DEFAULT 'C',  -- Phân loại phim

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Bảng Cinema (Rạp chiếu phim)
CREATE TABLE IF NOT EXISTS cinema (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) ,
    location VARCHAR(255) ,
    open_time TIME ,
    close_time TIME 
);

-- Bảng Room (Phòng chiếu)
CREATE TABLE IF NOT EXISTS room (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cinema_id INT ,
    name VARCHAR(100) ,
    location VARCHAR(255)
);

-- Bảng Seat (Ghế ngồi)
CREATE TABLE IF NOT EXISTS seat (
    id INT AUTO_INCREMENT PRIMARY KEY,
    room_id INT,
    code VARCHAR(10),
    row INT,
    col INT,  
    type ENUM('standard', 'vip', 'couple', 'maintenance', 'none') DEFAULT 'standard',  
    price DECIMAL(10,2)
);

-- Bảng Showtime (Suất chiếu)
CREATE TABLE IF NOT EXISTS showtime (
    id INT AUTO_INCREMENT PRIMARY KEY,
    room_id INT,
    cinema_id INT,
    media_id INT ,
    date DATE ,

    start_time DATETIME ,
    end_time DATETIME
);

CREATE TABLE IF NOT EXISTS product (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cinema_id INT,
    name VARCHAR(100),
    price DECIMAL(10,2),
    type ENUM('popcorn', 'drink', 'food', 'combo', 'other') DEFAULT 'other',
    status ENUM('available', 'unavailable') DEFAULT 'available',
    quantity INT DEFAULT 999,
    has_stock BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS `order` (
    user_id INT,
    email VARCHAR(255) ,
    name VARCHAR(100),
    order_code INT  PRIMARY KEY,
    total_price DECIMAL(10,2) ,
    status ENUM('pending', 'completed', 'failed') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS orderDetail (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_code INT ,
    showtime_id INT,
    seat_id INT,
    product_id INT,
    quantity INT ,
    status ENUM('pending', 'completed', 'failed') DEFAULT 'pending',
    time TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS payment (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_code INT ,
    total_price DECIMAL(10,2) ,
    status ENUM('pending', 'completed', 'failed') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE IF NOT EXISTS contact (
    id INT AUTO_INCREMENT PRIMARY KEY,
    admin_id INT,
    name VARCHAR(100),
    email VARCHAR(255) ,
    phone VARCHAR(20),
    subject VARCHAR(255),
    message TEXT,
    status ENUM('pending', 'in_progress', 'completed') DEFAULT 'pending',
    sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);









USE db;
INSERT INTO users
(username, email, password, role)
VALUES
('admin1', 'admin1@example.com', '$2y$10$DU/RMRXCUrleYJwj4YP3VecyPz2C5Td5lOgJ5atH1HcMTOw9hTvUa', 'admin'),
('admin2', 'admin2@example.com', '$2y$10$DU/RMRXCUrleYJwj4YP3VecyPz2C5Td5lOgJ5atH1HcMTOw9hTvUa', 'admin'),
('admin3', 'admin3@example.com', '$2y$10$DU/RMRXCUrleYJwj4YP3VecyPz2C5Td5lOgJ5atH1HcMTOw9hTvUa', 'admin'),
('admin4', 'admin4@example.com', '$2y$10$DU/RMRXCUrleYJwj4YP3VecyPz2C5Td5lOgJ5atH1HcMTOw9hTvUa', 'admin'),
('admin5', 'admin5@example.com', '$2y$10$DU/RMRXCUrleYJwj4YP3VecyPz2C5Td5lOgJ5atH1HcMTOw9hTvUa', 'admin'),
('user1', 'user1@example.com', '$2y$10$DU/RMRXCUrleYJwj4YP3VecyPz2C5Td5lOgJ5atH1HcMTOw9hTvUa', 'customer'),
('user2', 'user2@example.com', '$2y$10$DU/RMRXCUrleYJwj4YP3VecyPz2C5Td5lOgJ5atH1HcMTOw9hTvUa', 'customer'),
('user3', 'user3@example.com', '$2y$10$DU/RMRXCUrleYJwj4YP3VecyPz2C5Td5lOgJ5atH1HcMTOw9hTvUa', 'customer'),
('user4', 'user4@example.com', '$2y$10$DU/RMRXCUrleYJwj4YP3VecyPz2C5Td5lOgJ5atH1HcMTOw9hTvUa', 'customer'),
('user5', 'user5@example.com', '$2y$10$DU/RMRXCUrleYJwj4YP3VecyPz2C5Td5lOgJ5atH1HcMTOw9hTvUa', 'customer'),
('user6', 'user6@example.com', '$2y$10$DU/RMRXCUrleYJwj4YP3VecyPz2C5Td5lOgJ5atH1HcMTOw9hTvUa', 'customer'),
('user7', 'user7@example.com', '$2y$10$DU/RMRXCUrleYJwj4YP3VecyPz2C5Td5lOgJ5atH1HcMTOw9hTvUa', 'customer'),
('user8', 'user8@example.com', '$2y$10$DU/RMRXCUrleYJwj4YP3VecyPz2C5Td5lOgJ5atH1HcMTOw9hTvUa', 'customer'),
('user9', 'user9@example.com', '$2y$10$DU/RMRXCUrleYJwj4YP3VecyPz2C5Td5lOgJ5atH1HcMTOw9hTvUa', 'customer'),
('user10', 'user10@example.com', '$2y$10$DU/RMRXCUrleYJwj4YP3VecyPz2C5Td5lOgJ5atH1HcMTOw9hTvUa', 'customer');



INSERT INTO media ( filename, title, description, type, status, start_date, end_date, duration, genre, trailer, language, country, classification)
VALUES
('movie1.webp', 'Cuộc Chiến Cuối Cùng', 'Một nhóm chiến binh gan dạ hợp lực để chống lại thế lực bóng tối đe dọa nhân loại.', 'movie', 'showing', '2025-09-01', '2026-05-20', 120, 'Hành động', 'https://youtube.com/trailer1', 'Tiếng Việt', 'Việt Nam', 'T13'),
('movie2.webp', 'Hẹn Hò Với Sao Hollywood', 'Một cô gái Việt tình cờ gặp gỡ một diễn viên nổi tiếng người Mỹ và tạo nên câu chuyện tình lãng mạn hài hước.', 'movie', 'showing', '2025-09-01', '2026-05-19', 110, 'Hài', 'https://youtube.com/trailer2', 'Tiếng Anh', 'Mỹ', 'P'),
('movie3.webp', 'Bóng Ma Nhà Cũ', 'Một gia đình chuyển đến một ngôi nhà mới và phát hiện ra những bí mật kinh hoàng được chôn giấu từ quá khứ.', 'movie', 'showing', '2025-09-01', '2026-05-18', 90, 'Kinh dị', 'https://youtube.com/trailer3', 'Tiếng Việt', 'Hàn Quốc', 'T16'),
('movie4.webp', 'Lá Thư Từ Mùa Thu', 'Một mối tình sâu đậm giữa hai người trẻ tuổi vượt qua nhiều rào cản để đến được với nhau.', 'movie', 'showing', '2025-09-30', '2026-05-15', 105, 'Tình cảm', 'https://youtube.com/trailer4', 'Tiếng Hàn', 'Hàn Quốc', 'T18'),
('movie5.webp', 'Thế Giới Của Totoro', 'Một câu chuyện phiêu lưu cảm động trong thế giới kỳ ảo của sinh vật thần kỳ Totoro.', 'movie', 'showing', '2025-09-28', '2026-05-14', 100, 'Hoạt hình', 'https://youtube.com/trailer5', 'Tiếng Nhật', 'Nhật Bản', 'K'),
('movie6.webp', 'Du Hành Giữa Các Vì Sao', 'Nhóm phi hành gia khám phá một hành tinh mới và phải đối mặt với những sinh vật ngoài hành tinh kỳ bí.', 'movie', 'showing', '2025-09-25', '2026-05-10', 115, 'Viễn tưởng', 'https://youtube.com/trailer6', 'Tiếng Anh', 'Mỹ', 'T13'),
('movie7.webp', 'Thiếu Niên Anh Hùng', 'Một cậu bé bình thường phát hiện mình sở hữu siêu năng lực và bắt đầu hành trình trở thành anh hùng.', 'movie', 'showing', '2025-09-27', '2026-05-09', 95, 'Hành động', 'https://youtube.com/trailer7', 'Tiếng Việt', 'Trung Quốc', 'C'),
('movie8.webp', 'Chuyến Phiêu Lưu Paris', 'Hai anh em vô tình đi lạc đến Paris và sống những ngày tháng đầy bất ngờ và kỳ diệu.', 'movie', 'showing', '2025-09-29', '2026-05-11', 102, 'Phiêu lưu', 'https://youtube.com/trailer8', 'Tiếng Pháp', 'Pháp', 'T16'),
('movie9.webp', 'Bí Mật Phòng Tối', 'Một nhiếp ảnh gia phát hiện những điều rùng rợn qua các bức ảnh chụp bằng máy film cổ.', 'movie', 'showing', '2025-09-26', '2026-05-12', 108, 'Kịch tính', 'https://youtube.com/trailer9', 'Tiếng Đức', 'Đức', 'T13'),
('movie10.webp', 'Ngày Nào Ta Còn Bên Nhau', 'Một cặp đôi già hồi tưởng lại những khoảnh khắc đáng nhớ trong suốt cuộc đời.', 'movie', 'showing', '2025-09-27', '2025-05-15', 98, 'Hài', 'https://youtube.com/trailer10', 'Tiếng Ý', 'Ý', 'P');

INSERT INTO media ( filename, title, description, type, status, start_date, end_date, duration, genre, trailer, language, country, classification)
VALUES
('movie11.webp', 'Biệt Đội Báo Thù', 'Một nhóm siêu anh hùng hợp lực để cứu thế giới khỏi kẻ thù tàn ác.', 'movie', 'showing', '2025-04-01', '2026-06-01', 110, 'Hành động', 'https://youtube.com/trailer11', 'Tiếng Việt', 'Việt Nam', 'T13'),
('movie12.webp', 'Thư Ký Bất Đắc Dĩ', 'Câu chuyện hài hước về một anh chàng lười biếng bỗng dưng trở thành trợ lý cho nữ CEO khó tính.', 'movie', 'showing', '2025-04-07', '2026-05-01', 120, 'Hài', 'https://youtube.com/trailer12', 'Tiếng Anh', 'Mỹ', 'P'),
('movie13.webp', 'Tiếng Gọi Từ Nghĩa Địa', 'Một hồn ma trở về báo thù những người đã giết hại mình.', 'movie', 'showing', '2025-04-02', '2026-07-01', 115, 'Kinh dị', 'https://youtube.com/trailer13', 'Tiếng Hàn', 'Hàn Quốc', 'T18'),
('movie14.webp', 'Yêu Như Lần Đầu', 'Câu chuyện tình yêu đẹp nhưng buồn giữa hai người trẻ bị chia cắt bởi số phận.', 'movie', 'showing', '2025-04-03', '2026-06-15', 105, 'Tình cảm', 'https://youtube.com/trailer14', 'Tiếng Nhật', 'Nhật Bản', 'T13'),
('movie15.webp', 'Thế Giới Của Bé Gấu', 'Một bộ phim hoạt hình ấm áp về tình bạn giữa con người và động vật.', 'movie', 'showing', '2025-04-10', '2026-03-20', 100, 'Hoạt hình', 'https://youtube.com/trailer15', 'Tiếng Anh', 'Anh', 'K'),
('movie16.webp', 'Hành Tinh Thứ 9', 'Một nhà khoa học phát hiện ra hành tinh bí ẩn có thể thay đổi số phận nhân loại.', 'movie', 'showing', '2025-04-05', '2026-04-18', 95, 'Viễn tưởng', 'https://youtube.com/trailer16', 'Tiếng Trung', 'Trung Quốc', 'C'),
('movie17.webp', 'Chìa Khóa Ký Ức', 'Một cậu bé tìm lại ký ức bị mất thông qua những chuyến đi kỳ lạ.', 'movie', 'showing', '2025-04-03', '2026-08-10', 90, 'Phiêu lưu', 'https://youtube.com/trailer17', 'Tiếng Pháp', 'Pháp', 'T16'),
('movie18.webp', 'Góc Khuất Sự Thật', 'Một nhà báo điều tra bí mật động trời trong chính gia đình mình.', 'movie', 'showing', '2025-04-09', '2026-09-01', 105, 'Kịch tính', 'https://youtube.com/trailer18', 'Tiếng Đức', 'Đức', 'T18'),
('movie19.webp', 'Hỏa Lò Biển Đông', 'Một đội cứu hỏa phải đối mặt với vụ cháy khủng khiếp trên giàn khoan biển.', 'movie', 'showing', '2025-04-08', '2026-05-30', 118, 'Hành động', 'https://youtube.com/trailer19', 'Tiếng Việt', 'Việt Nam', 'T13'),
('movie20.webp', 'Cha Và Con', 'Chuyến hành trình gắn kết giữa người cha nghiêm khắc và cậu con trai nổi loạn.', 'movie', 'showing', '2025-04-06', '2026-04-10', 112, 'Hài', 'https://youtube.com/trailer20', 'Tiếng Ý', 'Ý', 'P');

INSERT INTO media ( filename, title, description, type, status, start_date, end_date)
VALUES
('poster1.webp', 'Lễ Hội Phim Việt 2025', 'Poster giới thiệu các bộ phim nổi bật trong lễ hội điện ảnh Việt Nam năm 2025.', 'poster', 'showing', '2025-08-01', '2026-10-31'),
('poster2.webp', 'Tuần Lễ Phim Hài Quốc Tế', 'Chương trình chiếu phim hài đến từ nhiều quốc gia khác nhau.', 'poster', 'showing', '2025-05-01', '2026-06-30'),
('poster3.webp', 'Mùa Hè Rực Rỡ', 'Poster chiến dịch phim mùa hè với những tác phẩm điện ảnh sôi động và hấp dẫn.', 'poster', 'showing', '2025-06-01', '2026-08-31'),
('poster4.webp', 'Khám Phá Thế Giới Hoạt Hình', 'Tổng hợp các bộ phim hoạt hình kinh điển và mới nhất.', 'poster', 'showing', '2025-07-01', '2026-09-30'),
('poster5.webp', 'Rạp Chiếu Phim Mới', 'Poster quảng bá rạp chiếu phim hiện đại mới khai trương tại trung tâm thành phố.', 'poster', 'showing', '2025-04-01', '2026-06-30'),
('poster6.webp', 'Góc Nhìn Điện Ảnh Châu Âu', 'Tổng hợp các tác phẩm nổi bật từ nền điện ảnh Pháp, Đức và Ý.', 'poster', 'showing', '2025-09-01', '2026-11-30'),
('poster7.webp', 'Kinh Dị Tháng 10', 'Chuỗi phim kinh dị đặc sắc ra mắt trong tháng Halloween.', 'poster', 'showing', '2025-10-01', '2026-10-31'),
('poster8.webp', 'Cảm Xúc Mùa Thu', 'Poster bộ sưu tập phim tình cảm dành cho mùa thu.', 'poster', 'showing', '2025-09-01', '2026-11-15'),
('poster9.webp', 'Bom Tấn Hành Động', 'Poster các siêu phẩm hành động với kỹ xảo đỉnh cao.', 'poster', 'showing', '2025-05-15', '2026-08-15'),
('poster10.webp', 'Thế Giới Tương Lai', 'Chủ đề phim khoa học viễn tưởng và khám phá vũ trụ.', 'poster', 'showing', '2025-07-01', '2026-09-30');


INSERT INTO cinema (name, location, open_time, close_time) VALUES
('Galaxy Nguyễn Du', '116 Nguyễn Du, Q.1, TP.HCM', '08:00:00', '23:00:00'),
('CGV Crescent Mall', '101 Tôn Dật Tiên, Q.7, TP.HCM', '09:00:00', '22:30:00'),
('Lotte Cinema Nam Sài Gòn', '3F Lotte Mart Q.7, TP.HCM', '08:30:00', '23:30:00'),
('BHD Star Bitexco', 'L3-04 Bitexco, 2 Hải Triều, Q.1, TP.HCM', '09:00:00', '00:00:00');

INSERT INTO room (cinema_id, name, location) VALUES
(1, 'Phòng 1', 'Tầng 1'),
(1, 'Phòng 2', 'Tầng 2'),
(2, 'Rạp A', 'Lầu 3'),
(2, 'Rạp B', 'Lầu 3'),
(3, 'Phòng chiếu 1', 'Tầng 2'),
(4, 'Rạp Bitexco 1', 'Lầu 3'),
(4, 'Rạp Bitexco 2', 'Lầu 4');

DELIMITER $$

CREATE PROCEDURE generate_seats_for_room(IN roomId INT)
BEGIN
    INSERT INTO seat (room_id, code, row, col, type, price)
    SELECT 
        roomId,
        CONCAT(CHAR(64 + rws.row_index), cls.col_index),
        rws.row_index,
        cls.col_index,
        CASE
            WHEN rws.row_index BETWEEN 1 AND 3 THEN 'standard'
            WHEN rws.row_index BETWEEN 4 AND 6 THEN 'vip'
            WHEN rws.row_index = 8 THEN 'couple'
            ELSE 'standard'
        END,
        CASE
            WHEN rws.row_index BETWEEN 1 AND 3 THEN 1000.00
            WHEN rws.row_index BETWEEN 4 AND 6 THEN 1200.00
            WHEN rws.row_index = 8 THEN 1500.00
            ELSE 1000.00
        END
    FROM 
        (SELECT 1 AS row_index UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL 
         SELECT 4 UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8) AS rws
    JOIN
        (
            SELECT 1 AS col_index UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4 UNION ALL SELECT 5 
            UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9 UNION ALL SELECT 10
        ) AS cls
    ON (rws.row_index != 8 OR cls.col_index <= 5);
END $$

DELIMITER ;

CALL generate_seats_for_room(1);
CALL generate_seats_for_room(2);
CALL generate_seats_for_room(3);
CALL generate_seats_for_room(4);
CALL generate_seats_for_room(5);
CALL generate_seats_for_room(6);
CALL generate_seats_for_room(7);


