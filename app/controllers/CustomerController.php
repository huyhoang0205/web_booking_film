<?php

class CustomerController {
    use Controller;
    public function __construct() {
    }

    public function profile() {
        $this->view('customer/profile');
    }
    public function order() {
        $this->view('customer/order');
    }
    

    public function getInfo() {
        header('Content-Type: application/json');
        if ($_SERVER['REQUEST_METHOD'] == 'GET') {
            $user = new UserModel();
            $result = $user->getUserInfo();
            if ($result != false) {
                echo json_encode([
                    'status' => true,
                    'data' => $result
                ]);
                exit;
            }
        }
        echo json_encode([
            'status' => false,
            'message' => 'User not found'
        ]);
        exit;
    }

    public function updateInfo() {
        header('Content-Type: application/json');
        if ($_SERVER['REQUEST_METHOD'] == 'POST') {
            $user = new UserModel();
            $result = $user->updateUserInfo($_POST);
            if ($result != false) {
                echo json_encode([
                    'status' => true,
                    'message' => 'Update successful'
                ]);
                exit;
            }
        }
        echo json_encode([
            'status' => false,
            'message' => 'Update failed'
        ]);
        exit;
    }
    

    public function uploadAvatar() {
        header('Content-Type: application/json');
        if($_SERVER['REQUEST_METHOD'] == 'POST' && isset($_FILES['file'])) {
            $userModel = new userModel();
            $result = $userModel->uploadAvatar($_POST, $_FILES['file']);
            if($result != false) {
                echo json_encode([
                    'status' => true, 
                    'message' => $userModel->message
                ]);
                exit;
            }
            echo json_encode(['status' => false, 'message' => $userModel->message]);
            exit;
        }
        echo json_encode(['status' => false, 'message' => 'Invalid request']);
        exit;
    }
    public function displayAvatar() {
        if ($_SERVER['REQUEST_METHOD'] == 'GET') {
            if (isset($_GET['avatar'])) {
                $dir = '../uploads/images/users/';
                $username = basename($_GET['avatar']); // tránh khai thác đường dẫn
                $path = $dir . $username . '/avatar.webp';
    
                if (file_exists($path)) {
                    header('Content-Type: image/webp');
                    readfile($path);
                    exit;
                } else {
                    echo json_encode(['status' => false, 'message' => 'Avatar not found']);
                    exit;
                }
            }
        }
    
        echo json_encode(['status' => false, 'message' => 'Invalid request']);
        exit;
    }
    public function changePassword() {
        header('Content-Type: application/json');
        if($_SERVER['REQUEST_METHOD'] == 'POST') {
            $userModel = new userModel();
            $result = $userModel->updatePassword($_POST);
            if($result != false) {
                echo json_encode([
                    'status' => true, 
                    'message' => $userModel->message
                ]);
                exit;
            }
            echo json_encode(['status' => false, 'message' => $userModel->message]);
            exit;
        }
        echo json_encode(['status' => false, 'message' => 'Invalid request']);
        exit;
    }
    

    public function getOrder() {
        
        header('Content-Type: application/json');
        if ($_SERVER['REQUEST_METHOD'] == 'GET') {
            $user = new UserModel();
            $result = $user->getOrder();
            if ($result != false) {
                echo json_encode([
                    'status' => true,
                    'data' => $result
                ]);
                exit;
            }
        }
        echo json_encode([
            'status' => false,
            'message' => 'User not found'
        ]);
        exit;
    }
}