<?php
class OrderDetailModel
{

    use Model;
    public function __construct() {
        $this->allowedColumns = [
            'order_code',
            'showtime_id',
            'seat_id',
            'product_id',
            'quantity',
            'status',
            'time'

        ];
        $this->table = 'orderdetail';
        $this->message = '';

        
    }

    public function insertOrderDetail($data) {
        try {
            $order_code = $data['order_code'];
            $result = $this->where($data);
            if ($result) {
                $update = $this->update($result[0]->id, $data);
                if ($update) {
                    return true;
                }
            } else {
                $insert = $this->insert($data);
                if ($insert) {
                    return true;
                }
            }
            return false;
        } catch (Exception $e) {
            $this->message = 'Error: ' . $e->getMessage();
            return false;
        }
    }

    public function deleteOrderDetail($data) {
        try {
            $order_code = $data['order_code'];
            $result = $this->where($data);
            if ($result) {
                $delete = $this->delete($result[0]->id);
                if ($delete) {
                    return true;
                }
            } else {
                return false;
            }
        } catch (Exception $e) {
            $this->message = 'Error: ' . $e->getMessage();
            return false;
        }
    }

    public function getBookingInfo($data) {
        try {
            // Cập nhật thời gian cho tất cả các bản ghi có order_code tương ứng

            $returnData = [];
            $order_code = $data['order_code'];
            $showtime_id = $data['showtime_id'];

            $updateQuery = "UPDATE orderDetail SET time = CURRENT_TIMESTAMP WHERE order_code = :order_code";
            $this->PDOquery($updateQuery, ['order_code' => $order_code]);

            $showtime = (new ShowtimeModel())->where(['id' => $showtime_id]);
            if($showtime != false) {
                $showtime = $showtime[0];
                $movie = (new MediaModel())->where(['id' => $showtime->media_id]);
                if($movie != false) {
                    $movie = $movie[0];
                    $returnData['movie_name'] = $movie->title;
                }

                $cinema = (new CinemaModel())->where(['id' => $showtime->cinema_id]);
                if($cinema != false) {
                    $cinema = $cinema[0];
                    $returnData['cinema_name'] = $cinema->name;
                }

                $room = (new RoomModel())->where(['id' => $showtime->room_id]);
                if($room != false) {
                    $room = $room[0];
                    $returnData['room_name'] = $room->name;
                }

                $returnData['showtime'] = $showtime->start_time;
            }

            $orderDetail = $this->where(['order_code' => $order_code, 'showtime_id' => $showtime_id]);
            if($orderDetail != false) {
                $returnData['total_price'] = 0;
                $returnData['product_list'] = '';      // Khởi tạo chuỗi rỗng
                $returnData['seat_list'] = '';     // Khởi tạo chuỗi rỗng


                foreach($orderDetail as $item) {
                    if($item->product_id != null) {
                        $product = (new ProductModel())->where(['id' => $item->product_id]);
                        if($product != false) {
                            $product = $product[0];
                            $returnData['product_list'] .= $product->name . 'x' . $item->quantity . ' ';
                            $returnData['total_price'] += $product->price * $item->quantity;
                        }
                    } else {
                        $seat = (new SeatModel())->where(['id' => $item->seat_id]);
                        if($seat != false) {
                            $seat = $seat[0];
                            $returnData['total_price'] += $seat->price;
                            $returnData['seat_list'] .= $seat->code . ' ';
                        }
                    }
                }
            }

            return $returnData;
            
        } catch (Exception $e) {
            $this->message = 'Error: ' . $e->getMessage();
            return false;
        }
    }

    public function revenueFor14Days() {
        $query = 
            "SELECT " .
                "DATE(od.time) AS date, " .
                "SUM(COALESCE(s.price, 0)) AS total_seat_price, " .
                "SUM(COALESCE(p.price * od.quantity, 0)) AS total_product_price, " .
                "SUM(COALESCE(s.price, 0) + COALESCE(p.price * od.quantity, 0)) AS total_revenuee " .
            "FROM " . $this->table . " od " .
            "LEFT JOIN seat s ON od.seat_id = s.id " .
            "LEFT JOIN product p ON od.product_id = p.id " .
            "WHERE od.status = :status " .
            "AND od.time >= CURDATE() - INTERVAL 13 DAY " .
            "GROUP BY DATE(od.time) " .
            "ORDER BY DATE(od.time)";
    
        $data = ['status' => 'completed'];
        return $this->PDOquery($query, $data);
    }

    public function revenueMovieHot() {
        $query = "SELECT " . 
                    "m.title, " .  // Lấy title từ bảng media
                    "DATE(od.time) AS date, " . 
                    "COUNT(od.order_code) AS total_orders " . 
                "FROM " . $this->table . " od " . 
                "JOIN showtime s ON od.showtime_id = s.id " . 
                "JOIN media m ON s.media_id = m.id " .  // Tham gia với bảng media
                "WHERE od.status = :status " . 
                "GROUP BY m.title, DATE(od.time) " . 
                "ORDER BY DATE(od.time) DESC";
    
        $data = ['status' => 'completed']; // Lọc chỉ các đơn hàng đã hoàn thành
        
        return $this->PDOquery($query, $data);
    }

    public function revenueChartCoverage($data) {
        try {
            $query = "SELECT m.title, " .  // Lấy tiêu đề từ bảng media
            "COUNT(DISTINCT od.seat_id) AS total_orders, " .  // Đếm số ghế duy nhất trong orderDetail
            "(COUNT(se.id) * 1.0 / COUNT(DISTINCT od.seat_id)) AS total_seats " .  // Tính tỷ lệ ghế trên mỗi đơn hàng
            "FROM orderDetail od " . 
            "INNER JOIN showtime s ON od.showtime_id = s.id " .  // Kết nối bảng orderDetail và showtime
            "INNER JOIN seat se ON se.room_id = s.id " .  // Kết nối bảng seat và showtime theo room_id
            "INNER JOIN media m ON s.media_id = m.id " .  // Kết nối bảng showtime và media để lấy title
            "WHERE od.status = :status " .  // Lọc theo trạng thái đơn hàng
            "AND od.seat_id IS NOT NULL " .  // Kiểm tra seat_id không null
            "AND od.time BETWEEN :start_date AND :end_date " .  // Điều kiện thời gian
            "GROUP BY m.title";  // Nhóm theo title trong bảng media (thay vì showtime_id)
    
            // Tham số truy vấn
            $params = [
                'status' => 'completed',
                'start_date' => $data['start_date'],
                'end_date' => $data['end_date']
            ];
            
            return $this->PDOquery($query, $params);
        } catch (Exception $e) {
            $this->message = 'Error: ' . $e->getMessage();
            return false;
        }
    }
    
    
    
    
    
    
    
    
    
    
    
    

}
