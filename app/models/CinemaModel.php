<?php
class CinemaModel
{

    use Model;
    public function __construct() {
        $this->allowedColumns = [
            'name',
            'location',
            'open_time',
            'close_time',
        ];
        $this->table = 'cinema';
        $this->message = '';
    }


}
