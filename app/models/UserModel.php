<?php
class UserModel
{

    use Model;
    public function __construct() {
        $this->allowedColumns = [
            'email',
            'password',
            'username',
            'name',
            'phone',
            'address',
            'avatar',
            'id_card',
            'point',
        ];
        $this->table = 'users';
        $this->message = '';
    }
    
    public function register($data) {
        try {
            $email = $data['email'];
            $password = $data['password'];
            $username = $data['username'];  

            if(empty($email) || empty($password) || empty($username)) {
                $this->message = 'Vui lòng nhập đầy đủ thông tin';
                return false;
            }

            if(!filter_var($email, FILTER_VALIDATE_EMAIL)) {
                $this->message = 'Email không hợp lệ';
                return false;
            }

            if(strlen($password) < 6) {
                $this->message = 'Mật khẩu phải có ít nhất 6 ký tự';
                return false;
            }

            if($this->where(['email' => $email])) {
                $this->message = 'Email đã tồn tại';
                return false;
            }

            if($this->where(['username' => $username])) {
                $this->message = 'Tên đăng nhập đã tồn tại';
                return false;
            }
            $password = password_hash($password, PASSWORD_BCRYPT);
            $this->insert([
                'email' => $email,
                'password' => $password,
                'username' => $username,
            ]);
            $this->message = 'Đăng ký thành công';
            return true;
        } catch (Exception $e) {
            $this->message = 'Error: ' . $e->getMessage();
            return false;
        }
    }

    public function login($data) {
        try {
            $remember = $data['remember'];
            unset($data['remember']);
            $account = $data['account'];
            unset($data['account']);
            $password = $data['password'];
            unset($data['password']);

            if(empty($account) || empty($password)) {
                $this->message = 'Vui lòng nhập đầy đủ thông tin';
                return false;
            }
            // Xác định loại tài khoản: email hoặc username
            if (filter_var($account, FILTER_VALIDATE_EMAIL)) {
                $data['email'] = $account;
            } else {
                $data['username'] = $account;
            }


            

            $user = $this->where($data);
            if (!$user) {
                $this->message = 'Tài khoản không tồn tại';
                return false;
            }
            if (!password_verify($password, $user[0]->password)) {
                $this->message = 'Mật khẩu không đúng';
                return false;
            }

            $_SESSION['user'] = [
                'id' => $user[0]->id,
                'role' => $user[0]->role,
                'username' => $user[0]->username,
            ];

            if ($remember == 'on') {
                $userTokenModel = new UserTokenModel();
                $tokenData = $userTokenModel->createToken($user[0]->id, 'login');
                if ($tokenData) {
                    setcookie(
                        'remember_login', 
                        $tokenData['selector'] . ':' . $tokenData['validator'], 
                        [
                            'expires' => time() + WAIT_TIME,  // Thời gian sống của cookie
                            'path' => '/',                    // Cookie có hiệu lực trên toàn bộ site
                            'httponly' => true,               // Ngăn JavaScript truy cập cookie
                            'secure' => isset($_SERVER['HTTPS']), // Chỉ gửi cookie khi giao thức HTTPS
                            'samesite' => 'Strict',           // Giảm nguy cơ tấn công CSRF
                        ]
                    );
                } else {
                    $this->message = 'Lỗi tạo token';
                    return false;
                }
                
            }
            $this->message = 'Đăng nhập thành công';
            return true;

        } catch (Exception $e) {
            $this->message = 'Error: ' . $e->getMessage();
            return false;
        }
    }


    public function getUserInfo() {
        try {
            if (isset($_SESSION['user'])) {

                $userId = $_SESSION['user']['id'];

                $user = $this->where(['id' => $userId]);
                $dir = '../uploads/images/users/';
                $username = $_SESSION['user']['username'];  // Accessing 'username' as an array key
                $dir = $dir . $username . '/';

                // Kiểm tra và tạo thư mục nếu chưa tồn tại
                if (is_dir($dir)) {
                    $avatar = ROOT. 'customer/displayAvatar?avatar=' . $username;
                }
                if ($user != false) {

                    $return  = (object) [
                        'email' => $user[0]->email,
                        'username' => $user[0]->username,
                        'role' => $user[0]->role,
                        'name' => $user[0]->name ,
                        'phone' => $user[0]->phone,
                        'address' => $user[0]->address,
                        'avatar' => $user[0]->avatar,
                        'id_card' => $user[0]->id_card,
                        'point' => $user[0]->point,
                        'avatar' => $avatar,
                    ];
                    return $return;
                }
            }
            return false;
        } catch (Exception $e) {
            return false;
        }
    }
    public function getOrder() {
        try {
            if (isset($_SESSION['user'])) {

                $userId = $_SESSION['user']['id'];
                $order = (new OrderModel())->where(['user_id'=>$userId]);
                return  $order;
               
            }
            return false;
        } catch (Exception $e) {
            return false;
        }
    }

    public function updateUserInfo($data) {
        try {
            if (isset($_SESSION['user'])) {
                $userId = $_SESSION['user']['id'];
                $resul = $this->update($userId, $data);
                if ($resul != false) {
                    return true;
                }
            }
            return false;
        } catch (Exception $e) {
            return false;
        }
    }
    public function updatePassword($data) {
        try {
            $id = $_SESSION['user']['id'];
            $password = $data['oldPassword'];
            $user = $this->where(['id'=>$id]);
            if (!password_verify($password, $user[0]->password)) {
                $this->message = 'Mật khẩu cũ không đúng';
                return false;
            }
            $password = password_hash($data['newPassword'], PASSWORD_BCRYPT);
            $this->update($id, ['password' => $password]);

            return true;
        } catch (Exception $e) {
            return false;
        }
    }

    public function uploadAvatar($data, $file) {
        try {
            $dir = '../uploads/images/users/';
            $username = $_SESSION['user']['username'];  // Accessing 'username' as an array key
            $dir = $dir . $username . '/';

            // Kiểm tra và tạo thư mục nếu chưa tồn tại
            if (!is_dir($dir)) {
                mkdir($dir, 0777, true);  // Tạo thư mục nếu chưa có
            }

    
            // Di chuyển tệp tải lên vào thư mục người dùng với tên là avatar.webp
            $filePath = $dir . 'avatar.webp';  // Đảm bảo rằng tệp sẽ được lưu đúng nơi
    
            // Kiểm tra nếu tệp di chuyển thành công
            if (move_uploaded_file($file['tmp_name'], $filePath)) {
                return true;
            }
    
            // Nếu có lỗi trong quá trình lưu file
            $this->message = 'Lỗi khi lưu file';
            return false;
        } catch (Exception $e) {
            // Bắt lỗi và trả thông báo lỗi
            $this->message = 'Lỗi: ' . $e->getMessage();
            return false;
        }
    }
    
}
