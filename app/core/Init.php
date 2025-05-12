<?php

spl_autoload_register(function ($classname) {
    $paths = ['../app/models/', '../app/middlewares/']; 
    foreach ($paths as $path) {
        $filename = $path . ucfirst($classname) . ".php";
        if (file_exists($filename)) {
            require $filename;
            break;
        }
    }
});


require 'Config.php';
require 'Database.php';
require 'Model.php';
require 'Controller.php';
require 'Routes.php';
require '../vendor/autoload.php';
require 'CSV.php';
require 'Function.php';

date_default_timezone_set('Asia/Ho_Chi_Minh');






