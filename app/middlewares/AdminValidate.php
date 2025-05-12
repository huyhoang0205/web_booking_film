<?php

class AdminValidate {
    use Controller;
    public function __construct() {
        $this->checkAdmin(); 
    }

    public function checkAdmin() {
        if (!isset($_SESSION['user']) || $_SESSION['user']['role'] !== 'admin') {
            $this->redirect('error/error_404');
        }
    }
}
