<?php
class UserTokenModel
{

    use Model;
    public function __construct() {
        $this->allowedColumns = [
            'user_id',
            'selector',
            'hashed_validator',
            'type',
            'expires_at',
            'created_at',
            
        ];
        $this->table = 'user_token';
        $this->message = '';
    }

    public function createToken($userId, $type) {
        try {
            $selector = bin2hex(random_bytes(8));
            $validator = bin2hex(random_bytes(32));
            $hashedValidator = password_hash($validator, PASSWORD_BCRYPT);
            $expiresAt = date('Y-m-d H:i:s', time() + WAIT_TIME);
            $createdAt = date('Y-m-d H:i:s');
            
            $this->insert([
                'user_id' => $userId,
                'selector' => $selector,
                'hashed_validator' => $hashedValidator,
                'type' => $type,
                'expires_at' => $expiresAt,
                'created_at' => $createdAt,
            ]);
            
            return [
                'selector' => $selector,
                'validator' => $validator,
            ];
        } catch (Exception $e) {
            return false;
        }
    }
    // 489062063b535f12%3Aed852dac5feb49c1e05e38b9c526d2af0646cf26ae6414ec5227649d45ca4669
    public function verifyToken($selector, $validator) {
        try {
            // Lấy token từ CSDL
            $token = $this->where(['selector' => $selector]);

            // Kiểm tra nếu có token và nếu token chưa hết hạn
            if ($token && strtotime($token[0]->expires_at) > time()) {
                // So sánh validator với hash
                
                if (password_verify($validator, $token[0]->hashed_validator)) {

                    return true;
                }
                
            }
            return false;
        } catch (Exception $e) {
            return false;
        }
    }

    public function deleteToken($selector) {
        try {
            $id = $this->where(['selector' => $selector]);
            if ($id) {
                $this->delete(['id' => $id[0]->id]);
            }
            $this->delete($id);
            return true;
        } catch (Exception $e) {
            return false;
        }
    }
    
    

    public function isLogin() {
        try {
            // Kiểm tra cookie nhớ đăng nhập
            if (isset($_COOKIE['remember_login'])) {
                list($selector, $validator) = explode(':', $_COOKIE['remember_login']);
                // Xác thực token
                
                if ($this->verifyToken($selector, $validator)) {
                    // Lấy thông tin token từ CSDL
                    $token = $this->where(['selector' => $selector]);
                    if ($token) {
                        // Lấy thông tin người dùng từ model UserModel
                        $userModel = new UserModel();
                        $user = $userModel->where(['id' => $token[0]->user_id]);
                        if ($user) {
                            // Đăng nhập lại người dùng
                            $_SESSION['user'] = [
                                'id' => $user[0]->id,
                                'role' => $user[0]->role,
                            ];
                            return true;
                        }
                    }
                }
            }
            return false;
        } catch (Exception $e) {
            return false;
        }
    }
    
    

}
