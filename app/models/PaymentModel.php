<?php
use PayOS\PayOS;

class PaymentModel
{

    use Model;
    private $payOS;
    public function __construct() {
        $this->allowedColumns = [
            'order_code',
            'total_price',
            'status'
        ];
        $this->table = 'payment';
        $this->message = '';
        $this->payOS = new PayOS(CLIENT_ID, API_KEY, CHECKSUM_KEY);
    }

    public function confirmPayment($data) {
        try {
            $name = $data['name'];
            $email = $data['email'];
            $user_id = null;
            if (isset($_SESSION)) {
                if(isset($_SESSION['user'])) {
                    $user_id = $_SESSION['user']['id'];   
                }
            }
            $total_price = 0;


            $order_code = $data['order_code'];

            $orderDetail = (new OrderDetailModel())->where(['order_code'=> $order_code]);
            if($orderDetail != false) {


                foreach($orderDetail as $item) {
                    if($item->product_id != null) {
                        $product = (new ProductModel())->where(['id' => $item->product_id]);
                        if($product != false) {
                            $product = $product[0];
                            $total_price += $product->price * $item->quantity;
                        }
                    } else {
                        $seat = (new SeatModel())->where(['id' => $item->seat_id]);
                        if($seat != false) {
                            $seat = $seat[0];
                            $total_price += $seat->price;
                        }
                    }
                }
            }

            $order = (new OrderModel())->insert([
                'email' => $email,
                'order_code' => $order_code,
                'total_price' => $total_price,
                'user_id' => $user_id,
            ]);

            if($order == false) {
                return false;
            }

            $payment = $this->insert([
                'order_code' => $order_code,
                'total_price' => $total_price,
            ]);

            if($payment == false) {
                return false;
            }

            $payos = $this->payOS->createPaymentLink([
                "orderCode" => (int) $order_code,
                "amount" => $total_price,
                "description" => "Pay order $order_code", // <= 25 ký tự
                "email" => $email,
                "name" => $name,
                "expiredAt" => time() + 600, // timestamp tương lai
        
                "returnUrl" => "http://localhost/PHP_MVC/public/status/success",
                "cancelUrl" => "http://localhost/PHP_MVC/public/status/cancel",
            ]);

            return $payos;





        } catch (Exception $e) {
            $this->message = 'Error: ' . $e->getMessage();
            return false;
        }

    }


    public function cancelPayment($data) {
        try {
            $order_code = $data['order_code'];
            $payos = $this->payOS->cancelPaymentLink($order_code);
            if($payos == false) {
                return false;
            }

            $this->PDOquery("UPDATE `order` SET status = 'failed' WHERE order_code = ?", [$order_code]);
            $this->PDOquery("UPDATE `orderDetail` SET status = 'failed' WHERE order_code = ?", [$order_code]);
            $this->PDOquery("UPDATE `payment` SET status = 'failed' WHERE order_code = ?", [$order_code]);







            return $payos;

        } catch (Exception $e) {
            $this->message = 'Error: ' . $e->getMessage();
            return false;
        }
    }

    public function getPayment($data) {
        $order_code = $data['order_code'];
        $payos = $this->payOS->getPaymentLinkInformation($order_code);
        if($payos == false) {
            return false;
        }

        switch($payos['status']) {
            case 'PAID':
                $this->PDOquery("UPDATE `order` SET status = 'completed' WHERE order_code = ?", [$order_code]);
                $this->PDOquery("UPDATE `orderDetail` SET status = 'completed' WHERE order_code = ?", [$order_code]);
                $this->PDOquery("UPDATE `payment` SET status = 'completed' WHERE order_code = ?", [$order_code]);
                break;
            case 'EXPIRED':
            case 'CANCELED':
                $this->PDOquery("UPDATE `order` SET status = 'failed' WHERE order_code = ?", [$order_code]);
                $this->PDOquery("UPDATE `orderDetail` SET status = 'failed' WHERE order_code = ?", [$order_code]);
                $this->PDOquery("UPDATE `payment` SET status = 'failed' WHERE order_code = ?", [$order_code]);
                break;
            defaukt:
                break;

        }
        return $payos;
    }

    


}
