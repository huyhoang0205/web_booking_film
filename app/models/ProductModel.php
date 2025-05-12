<?php
class ProductModel
{

    use Model;
    public function __construct() {
        $this->allowedColumns = [
            'name',
            'price',
            'quatity',
            'cinema_id',
            'type',
            'status',
            'has_stock',
        ];
        $this->table = 'product';
        $this->message = '';
    }


}
