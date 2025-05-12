<?php

trait Controller
{
    public function view($name)
    {
        header('Content-Type: text/html');

        $extensions = ['php', 'html'];
        $filename = null;

        foreach ($extensions as $ext) {
            $path = __DIR__ . "/../views/{$name}.{$ext}";
            if (file_exists($path)) {
                $filename = $path;
                break;
            }
        }

        if (!isset($filename)) {
            $filename = __DIR__ . "/../views/status/error404.html";
        }

        require $filename;
    }
    public function redirect($name)
    {
        header("Location: " . ROOT . $name);
        exit;
    }
    public function back()
    {
        header("Location: " . $_SERVER['HTTP_REFERER']);
        exit;
    }
}
