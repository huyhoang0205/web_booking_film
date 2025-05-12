<?php
class SeatModel
{

    use Model;
    public function __construct() {
        $this->allowedColumns = [
            'room_id',
            'cinema_id',
            'code',
            'row',
            'col',
            'type',
            'price'
        ];
        $this->table = 'seat';
        $this->message = '';
    }


}
