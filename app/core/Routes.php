<?php

class Routes
{
    private $controller = 'Status';
    private $method = 'error404';

    private function splitURL()
    {
        $URL = $_GET['url'] ?? 'main/home';
        $URL = explode("/", trim($URL, '/'));
        return $URL;
    }

    public function loadController()
    {
        $URL = $this->splitURL();
        $controllerName = ucfirst($URL[0]) . "Controller";
        $methodName = $URL[1] ?? null;
    
        $filename = "../app/controllers/" . $controllerName . ".php";
    
        if (file_exists($filename)) {
            require $filename;
            $this->controller = $controllerName;
            unset($URL[0]);
        } else {
            require "../app/controllers/StatusController.php";
            $this->controller = "StatusController";
            $this->method = "error404";
            $controller = new $this->controller;
            call_user_func_array([$controller, $this->method], []);
            return;
        }
    
        $controller = new $this->controller;
    
        if (!empty($methodName) && method_exists($controller, $methodName)) {
            $this->method = $methodName;
            unset($URL[1]);
        } elseif (!empty($methodName)) {
            // Method không tồn tại ⇒ chuyển sang error404 của StatusController
            require "../app/controllers/StatusController.php";
            $this->controller = "StatusController";
            $controller = new $this->controller;
            $this->method = "error404";
            call_user_func_array([$controller, $this->method], []);
            return;
        }
    
        call_user_func_array([$controller, $this->method], $URL);
    }
    

}
