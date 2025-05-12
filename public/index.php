<?php
session_start();

require "../app/core/Init.php";

$app = new Routes;
$app->loadController();
