<?php
class MediaModel
{

    use Model;
    public function __construct() {
        $this->allowedColumns = [
            'post_id',
            'filename',
            'title',
            'description',
            'type',
            'status',
            'start_date',
            'end_date',
            'duration',
            'genre',
            'trailer',
            'language',
            'country',
            'classification',

            'created_at',


        ];
        $this->table = 'media';
        $this->message = '';
    }




    public function insertMedia($data, $file) {
        try {
            $dir = '../uploads/images/main/' . $data['type'] . '/';
            if (!is_dir($dir)) {
                mkdir($dir, 0777, true);
            }

            $file_name_without_ext = pathinfo($file['name'], PATHINFO_FILENAME);
            
            $new_name = time() . "_" . $file_name_without_ext . ".webp";
            $file_path = rtrim($dir, '/') . '/' . $new_name;

            if (move_uploaded_file($file['tmp_name'], $file_path)) {
                $data['filename'] = $new_name;
                $result = $this->insert($data);
                if ($result) {
                    $this->message = 'Thêm mới thành công';
                    return true;
                }
            }

            $this->message =  'Lỗi khi lưu file';
            return false;
        } catch (Exception $e) {
            $this->message = 'Lỗi: ' . $e->getMessage();
            return false;
        }
    }

    public function deleteMedia($data) {
        try {
            $id = $data['id'];
            if (empty($id)) {
                $this->message = 'ID không hợp lệ';
                return false;
            }
            $media = $this->where(['id' => $id]);
            if ($media) {
                $file_path = '../uploads/images/main/' . $media[0]->type . '/' . $media[0]->filename;
                if (file_exists($file_path)) {
                    unlink($file_path);
                }
                $this->delete($id);
                return true;
            }
            return false;
        } catch (Exception $e) {
            $this->message = 'Lỗi: ' . $e->getMessage();
            return false;
        }
    }

    public function getPath($data) {
        try {
            $id = $data['id'];
            if (empty($id)) {
                $this->message = 'ID không hợp lệ';
                return false;
            }
            $media = $this->where(['id' => $id]);
            if ($media) {
                return '../uploads/images/main/' . $media[0]->type . '/' . $media[0]->filename;
            }
            return false;
        } catch (Exception $e) {
            $this->message = 'Lỗi: ' . $e->getMessage();
            return false;
        }
    }

 
    
}
