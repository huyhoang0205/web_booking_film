<?php

class AuthController {
    use Controller;
    public function __construct() {
    }

    public function register() {
        header('Content-Type: application/json');
        if ($_SERVER['REQUEST_METHOD'] == 'POST') {
            $userModel = new UserModel();
            $result = $userModel->register($_POST);

            if ($result != false) {
                echo json_encode([
                    'status' => true,
                    'message' => $userModel->message,
                ]);
                exit;
            } else {
                echo json_encode([
                    'status' => false,
                    'message' => $userModel->message,
                ]);
                exit;
            }
        }
        if (isset($_SESSION)) {
            if(isset($_SESSION['user'])) {
                if($_SESSION['user']['role'] == 'admin') { 
                    $this->view('admin/home');
                    exit;
                } else {
                    $this->view('main/home');
                    exit;
                }
            }
        }
        $this->view('auth/register');
    }
    
    public function login() {
        header('Content-Type: application/json');
        if( $_SERVER['REQUEST_METHOD'] == 'POST') {
            $userModel = new UserModel();
            $result = $userModel->login($_POST);

            if ($result != false) {
                echo json_encode([
                    'status' => true,
                    'message' => $userModel->message,
                ]);
                exit;
            } else {
                echo json_encode([
                    'status' => false,
                    'message' => $userModel->message,
                ]);
                exit;
            }
        }
        if (isset($_SESSION)) {
            if(isset($_SESSION['user'])) {
                if($_SESSION['user']['role'] == 'admin') { 
                    $this->view('admin/home');
                    exit;
                } else {
                    $this->view('main/home');
                    exit;
                }
            }
        }
        $this->view('auth/login');
    }
    
    public function getRole() {
        header ('Content-Type: application/json');
        if (isset($_SESSION)) {
            if(isset($_SESSION['user'])) {
                echo json_encode([
                    'status' => true,
                    'role' => $_SESSION['user']['role'],
                ]);
                exit;
            }
        }
        echo json_encode([
            'status' => false,
            'message' => 'User not logged in',
        ]);
        exit;
    }
    
    public function logout() {
        session_unset();
        session_destroy(); 
        if (isset($_COOKIE['remember_login'])) {
            list($selector, $validator) = explode(':', $_COOKIE['remember_login']);
            $userTokenModel = new UserTokenModel();
            $userTokenModel->deleteToken($selector);
            setcookie('remember_login', '', time() - 3600, '/');
        }
        $this->redirect('main/home');
    }
    
    public function forgot() {
        $this->view('auth/forgot');
    }
}