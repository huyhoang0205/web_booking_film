<?php

class RevenueController {
    use Controller;
    public function __construct() {
    }
    public function revenueFor14Days() {
        header('Content-Type: application/json');
        if($_SERVER['REQUEST_METHOD'] == 'GET') {
            unset($_GET['url']);
            $orderDetailModel = new OrderDetailModel();
            $result = $orderDetailModel->revenueFor14Days();
            if($result != false) {
                echo json_encode([
                    'status' => true, 
                    "data" => $result,
                ]);
                exit;
            }
            echo json_encode(['status' => false, 'message' => $orderDetailModel->message]);
            exit;

        }
        echo json_encode(['status' => false, 'message' => 'Invalid request']);
        exit;
    }
    public function revenueMovieHot() {
        header('Content-Type: application/json');
        if($_SERVER['REQUEST_METHOD'] == 'GET') {
            unset($_GET['url']);
            $orderDetailModel = new OrderDetailModel();
            $result = $orderDetailModel->revenueMovieHot();
            if($result != false) {
                echo json_encode([
                    'status' => true, 
                    "data" => $result,
                ]);
                exit;
            }
            echo json_encode(['status' => false, 'message' => $orderDetailModel->message]);
            exit;

        }
        echo json_encode(['status' => false, 'message' => 'Invalid request']);
        exit;
    }
    public function revenueChartCoverage() {
        header('Content-Type: application/json');
        if($_SERVER['REQUEST_METHOD'] == 'POST') {
            unset($_GET['url']);
            $orderDetailModel = new OrderDetailModel();
            $result = $orderDetailModel->revenueChartCoverage($_POST);
            if($result != false) {
                echo json_encode([
                    'status' => true, 
                    "data" => $result,
                ]);
                exit;
            }
            echo json_encode(['status' => false, 'message' => $orderDetailModel->message]);
            exit;

        }
        echo json_encode(['status' => false, 'message' => 'Invalid request']);
        exit;
    }

   
    


}
