<?php
class OrderModel
{
    use Model;

    public function __construct() {
        $this->order_column = 'order_code'; 
        $this->allowedColumns = [
            'order_code',
            'user_id',
            'total_price',
            'status',
            'name',
            'email',
        ];
        $this->table = '`order`';
        $this->message = '';
    }
}
