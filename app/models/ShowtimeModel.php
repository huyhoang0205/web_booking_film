<?php
class ShowtimeModel
{

    use Model;
    use CSV;
    public function __construct() {
        $this->allowedColumns = [
            'room_id',
            'media_id',
            'cinema_id',
            'date',
            'start_time',
            'end_time',
        ];
        $this->table = 'showtime';
        $this->message = '';
    }

    public function getSeatByShowtime($data) {
        try {
            $showtime_id = $data['showtime_id'];
            $showtime = $this->where(['id' => $showtime_id]);

            if($showtime != false) {
                $showtime = $showtime[0];
                $room_id = $showtime->room_id;
                
                $seats = (new SeatModel())->where(['room_id' => $room_id]);
                

                $orderDetails = (new OrderDetailModel())->where(['showtime_id' => $showtime_id]);
                if($orderDetails != false) {
                    foreach ($orderDetails as $orderDetail) {

                        if ($orderDetail->status == 'pending') {
                            if (strtotime($orderDetail->time) + 5 * 60 < time()) {
                                $this->delete($orderDetail->id);
                            } else {
                                $seats[$orderDetail->seat_id - 1]->status = 'pending';
                            }
                        } else if ($orderDetail->status == 'completed') {
                            $seats[$orderDetail->seat_id - 1]->status = 'completed';
                        }
                    }



                    
                }

                return $seats;
                
            }
            return false;
        } catch (Exception $e) {
            $this->message = 'Error: ' . $e->getMessage();
            return false;
        }
    }

    

}
