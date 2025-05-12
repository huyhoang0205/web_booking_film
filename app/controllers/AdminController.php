<?php

class AdminController {
    use Controller;
    use CSV;
    public function __construct() {
    }
    public function home() {
        $this->view('admin/home');
    }
    public function media() {
        $this->view('admin/media');
    }
    public function showtime() {
        $this->view('admin/showtime');
    }
    public function cinema() {
        $this->view('admin/cinema');
    }
    public function seat() {
        $this->view('admin/seat');
    }
    public function product() {
        $this->view('admin/product');
    }
    public function revenue() {
        $this->view('admin/revenue');
    }


    public function insertproduct() {
        header('Content-Type: application/json');
        if($_SERVER['REQUEST_METHOD'] == 'POST') {
            $productModel = new ProductModel();
            if ($_POST['id']) {
                $result = $productModel->update($_POST['id'], $_POST);
            } else {
                $result = $productModel->insert($_POST);
            }
            
            if($result != false) {
                echo json_encode([
                    'status' => true, 
                    'message' => $productModel->message
                ]);
                exit;
            }
            echo json_encode(['status' => false, 'message' => $productModel->message]);
        }
        echo json_encode(['status' => false, 'message' => 'Invalid request']);
        exit;
    }

    public function getMedia() {
        header('Content-Type: application/json');
        if($_SERVER['REQUEST_METHOD'] == 'GET') {
            unset($_GET['url']);
            $mediaModel = new MediaModel();
            $result = $mediaModel->where($_GET);
            if($result != false) {
                echo json_encode([
                    'status' => true, 
                    "data" => $result,
                ]);
                exit;
            }
            echo json_encode(['status' => false, 'message' => $mediaModel->message]);
            exit;

        }
        echo json_encode(['status' => false, 'message' => 'Invalid request']);
        exit;
    }

    public function getCinema() {
        header('Content-Type: application/json');
        if($_SERVER['REQUEST_METHOD'] == 'GET') {
            unset($_GET['url']);
            $cinemaModel = new CinemaModel();
            $result = $cinemaModel->where($_GET);
            if($result != false) {
                echo json_encode([
                    'status' => true, 
                    "data" => $result,
                ]);
                exit;
            }
            echo json_encode(['status' => false, 'message' => $cinemaModel->message]);
            exit;

        }
        echo json_encode(['status' => false, 'message' => 'Invalid request']);
        exit;
    }

    

    public function getRoom() {
        header('Content-Type: application/json');
        if($_SERVER['REQUEST_METHOD'] == 'GET') {
            unset($_GET['url']);
            $roomModel = new RoomModel();
            $result = $roomModel->where($_GET);
            if($result != false) {
                echo json_encode([
                    'status' => true, 
                    "data" => $result,
                ]);
                exit;
            }
            echo json_encode(['status' => false, 'message' => $roomModel->message]);
            exit;

        }
        echo json_encode(['status' => false, 'message' => 'Invalid request']);
        exit;
    }

    public function getSeat() {
        header('Content-Type: application/json');
        if($_SERVER['REQUEST_METHOD'] == 'GET') {
            unset($_GET['url']);
            $seatModel = new SeatModel();
            $result = $seatModel->where($_GET);
            if($result != false) {
                usort($result, function ($a, $b) {
                    if ($a->row == $b->row) {
                        return $a->col - $b->col;
                    }
                    return $a->row - $b->row;
                });
                
                echo json_encode([
                    'status' => true, 
                    "data" => $result,
                ]);
                exit;
            }
            echo json_encode(['status' => false, 'message' => $seatModel->message]);
            exit;

        }
        echo json_encode(['status' => false, 'message' => 'Invalid request']);
        exit;
    }

    public function getShowtime() {
        header('Content-Type: application/json');
        if($_SERVER['REQUEST_METHOD'] == 'GET') {
            unset($_GET['url']);
            $showtimeModel = new ShowtimeModel();
            $result = $showtimeModel->where($_GET);
            if($result != false) {
                usort($result, function ($a, $b) {
                    $timeA = strtotime($a->start_time);
                    $timeB = strtotime($b->start_time);
            
                    return $timeA - $timeB; // Sắp xếp tăng dần theo start_time
                });
                echo json_encode([
                    'status' => true, 
                    "data" => $result,
                ]);
                exit;
            }
            echo json_encode(['status' => false, 'message' => $showtimeModel->message]);
            exit;

        }
        echo json_encode(['status' => false, 'message' => 'Invalid request']);
        exit;
    }
    
    public function insertMedia() {
        header('Content-Type: application/json');
        if($_SERVER['REQUEST_METHOD'] == 'POST' && isset($_FILES['file'])) {
            $mediaModel = new MediaModel();
            $result = $mediaModel->insertMedia($_POST, $_FILES['file']);
            if($result != false) {
                echo json_encode([
                    'status' => true, 
                    'message' => $mediaModel->message
                ]);
                exit;
            }
            echo json_encode(['status' => false, 'message' => $mediaModel->message]);
        }
        echo json_encode(['status' => false, 'message' => 'Invalid request']);
        exit;
    }

    public function deleteMedia() {
        header('Content-Type: application/json');
        if($_SERVER['REQUEST_METHOD'] == 'POST') {
            $mediaModel = new MediaModel();
            $result = $mediaModel->deleteMedia($_POST);
            if($result != false) {
                echo json_encode([
                    'status' => true, 
                    'message' => $mediaModel->message
                ]);
                exit;
            }
            echo json_encode(['status' => false, 'message' => $mediaModel->message]);
        }
        echo json_encode(['status' => false, 'message' => 'Invalid request']);
        exit;
    }

    public function updateMedia() {
        header('Content-Type: application/json');
        if($_SERVER['REQUEST_METHOD'] == 'POST') {
            $mediaModel = new MediaModel();
            $result = $mediaModel->update($_POST['id'], $_POST);
            if($result != false) {
                echo json_encode([
                    'status' => true, 
                    'message' => $mediaModel->message
                ]);
                exit;
            }
            echo json_encode(['status' => false, 'message' => $mediaModel->message]);
            exit;
        }
        echo json_encode(['status' => false, 'message' => 'Invalid request']);
        exit;
    }

    public function updateCinema() {
        header('Content-Type: application/json');
        if($_SERVER['REQUEST_METHOD'] == 'POST') {
            $cinemaModel = new CinemaModel();
            $result = $cinemaModel->update($_POST['id'], $_POST);
            if($result != false) {
                echo json_encode([
                    'status' => true, 
                    'message' => $cinemaModel->message
                ]);
                exit;
            }
            echo json_encode(['status' => false, 'message' => $cinemaModel->message]);
            exit;
        }
        echo json_encode(['status' => false, 'message' => 'Invalid request']);
        exit;
    }

    public function insertSeat() {
        header('Content-Type: application/json');
        if($_SERVER['REQUEST_METHOD'] == 'POST') {
            $seatModel = new SeatModel();
            $result = $seatModel->insert($_POST);
            if($result != false) {
                echo json_encode([
                    'status' => true, 
                    'message' => $seatModel->message
                ]);
                exit;
            }
            echo json_encode(['status' => false, 'message' => $seatModel->message]);
        }
        echo json_encode(['status' => false, 'message' => 'Invalid request']);
        exit;
    }

    public function insertShowtime() {
        header('Content-Type: application/json');
        if($_SERVER['REQUEST_METHOD'] == 'POST') {
            $showtimeModel = new ShowtimeModel();
            $result = $showtimeModel->insert($_POST);
            if($result != false) {
                echo json_encode([
                    'status' => true, 
                    'message' => $showtimeModel->message
                ]);
                exit;
            }
            echo json_encode(['status' => false, 'message' => $showtimeModel->message]);
        }
        echo json_encode(['status' => false, 'message' => 'Invalid request']);
        exit;
    }

    public function deleteShowtime() {
        header('Content-Type: application/json');
        if($_SERVER['REQUEST_METHOD'] == 'POST') {
            $showtimeModel = new ShowtimeModel();
            $result = $showtimeModel->delete($_POST['id']);
            if($result != false) {
                echo json_encode([
                    'status' => true, 
                    'message' => $showtimeModel->message
                ]);
                exit;
            }
            echo json_encode(['status' => false, 'message' => $showtimeModel->message]);
        }
        echo json_encode(['status' => false, 'message' => 'Invalid request']);
        exit;
    }

    public function getMediaCSV() {
        if ($_SERVER['REQUEST_METHOD'] == 'GET') {
            unset($_GET['url']);
            
            // Tạo đối tượng model để truy vấn dữ liệu
            $mediaModel = new MediaModel();
            $result = $mediaModel->where($_GET);
            
            // Kiểm tra nếu có dữ liệu
            if ($result !== false) {
                insertEmpty($result);
                $this->exportCSV($result, 'media'. date('Y-m-d'));
            }
        }
        
        // Nếu không phải phương thức GET
        echo json_encode(['status' => false, 'message' => 'Invalid request']);
        exit;
    }

    public function getShowtimeCSV() {
        if ($_SERVER['REQUEST_METHOD'] == 'GET') {
            unset($_GET['url']);
            
            // Tạo đối tượng model để truy vấn dữ liệu
            $showtimeModel = new ShowtimeModel();
            $result = $showtimeModel->where($_GET);
            
            // Kiểm tra nếu có dữ liệu
            if ($result !== false) {
                insertEmpty($result);
                $this->exportCSV($result, 'showtime'. date('Y-m-d'));
            }
        }
        
        // Nếu không phải phương thức GET
        echo json_encode(['status' => false, 'message' => 'Invalid request']);
        exit;
    }

    public function getProduct() {
        if ($_SERVER['REQUEST_METHOD'] == 'GET') {
            unset($_GET['url']);
            
            // Tạo đối tượng model để truy vấn dữ liệu
            $productModel = new ProductModel();
            $result = $productModel->where($_GET);
            
            // Kiểm tra nếu có dữ liệu
            if ($result !== false) {
                echo json_encode([
                    'status' => true, 
                    "data" => $result,
                ]);
                exit;
            }
        }
        
        // Nếu không phải phương thức GET
        echo json_encode(['status' => false, 'message' => 'Invalid request']);
        exit;
    }

    public function deleteProduct() {
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            $id = $_POST['id'];
    
            if ($id) {
                $productModel = new ProductModel();
                $result = $productModel->delete($id);
                if ($result) {
                    echo json_encode(['status' => true]);
                    exit;
                }
            }
        }
        echo json_encode(['status' => false, 'message' => 'Invalid request']);
        exit;
    }
    


}
