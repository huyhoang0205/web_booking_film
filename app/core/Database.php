<?php
trait Database {


    private function connect() {
        $string = DBDRIVER . ":host=" . DBHOST . ";dbname=" . DBNAME;
        try {
            $pdo = new PDO($string, DBUSER, DBPASS);
            $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            return $pdo;
            echo "Connection successful!";
        } catch (PDOException $e) {
            echo "Connection failed: " . $e->getMessage();
        }
    }

    public function PDOquery($query, $data = [])
    {
        try {
            $con = $this->connect();
            $stm = $con->prepare($query);
            $check = $stm->execute($data);

            $queryType = strtoupper(trim(explode(' ', $query)[0]));

            // Nếu là SELECT, SHOW, DESCRIBE, EXPLAIN thì fetch kết quả
            if (in_array($queryType, ['SELECT', 'SHOW', 'DESCRIBE', 'EXPLAIN'])) {
                $result = $stm->fetchAll(PDO::FETCH_OBJ);
                if (is_array($result) && count($result)) {
                    return $result;
                }
            }

            // Nếu là UPDATE, DELETE, INSERT thì trả về số dòng bị ảnh hưởng
            if (in_array($queryType, ['UPDATE', 'DELETE', 'INSERT'])) {
                return $stm->rowCount();
            }

            return false;
        } catch (PDOException $e) {
            die("Lỗi SQL: " . $e->getMessage());
        }
    }



    public function get_first($query, $data = [])
    {
        $con = $this->connect();
        $stm = $con->prepare($query);

        $check = $stm->execute($data);
        if ($check) {
            $result = $stm->fetchAll(PDO::FETCH_OBJ);
            if (is_array($result) && count($result)) {
                return $result[0];
            }
        }
        return false;
    }
}