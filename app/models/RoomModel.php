<?php
class RoomModel
{

    use Model;
    public function __construct() {
        $this->allowedColumns = [
            'cinema_id',
            'name',
            'location',
        ];
        $this->table = 'room';
        $this->message = '';
    }


}
