<?php

// autoload_static.php @generated by Composer

namespace Composer\Autoload;

class ComposerStaticInit2821528c0faafcfeb84a1d3636585864
{
    public static $prefixLengthsPsr4 = array (
        'P' => 
        array (
            'PayOS\\' => 6,
            'PHPMailer\\PHPMailer\\' => 20,
        ),
    );

    public static $prefixDirsPsr4 = array (
        'PayOS\\' => 
        array (
            0 => __DIR__ . '/..' . '/payos/payos/src',
        ),
        'PHPMailer\\PHPMailer\\' => 
        array (
            0 => __DIR__ . '/..' . '/phpmailer/phpmailer/src',
        ),
    );

    public static $classMap = array (
        'Composer\\InstalledVersions' => __DIR__ . '/..' . '/composer/InstalledVersions.php',
    );

    public static function getInitializer(ClassLoader $loader)
    {
        return \Closure::bind(function () use ($loader) {
            $loader->prefixLengthsPsr4 = ComposerStaticInit2821528c0faafcfeb84a1d3636585864::$prefixLengthsPsr4;
            $loader->prefixDirsPsr4 = ComposerStaticInit2821528c0faafcfeb84a1d3636585864::$prefixDirsPsr4;
            $loader->classMap = ComposerStaticInit2821528c0faafcfeb84a1d3636585864::$classMap;

        }, null, ClassLoader::class);
    }
}
