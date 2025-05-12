<?php

class StatusController {
    use Controller;
    public function __construct() {
    }
    public function error403() {
        $this->view('status/error403');
    }
    public function error404() {
        $this->view('status/error404');
    }
    public function error500() {
        $this->view('status/error500');
    }
    public function success() {
        $this->view('status/success');
    }
    public function cancel() {
        $this->view('status/cancel');
    }

   
    


}
