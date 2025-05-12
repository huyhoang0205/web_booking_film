<?php
trait CSV {
    // Hàm xuất CSV
    public function exportCSV($data, $filename) {
        header('Content-Type: text/csv; charset=UTF-8');
        header('Content-Disposition: attachment; filename="'.$filename.'.csv"');
        header('Pragma: no-cache');
        header('Expires: 0');
    
        $output = fopen('php://output', 'w');
        fputs($output, "\xEF\xBB\xBF"); // BOM UTF-8
    
        if (!empty($data)) {
            $headers = array_keys((array)$data[0]);
            fputcsv($output, $headers);
            foreach ($data as $row) {
                $rowArray = (array)$row;
                
                $rowValues = array_map(function($value) {
                    if (is_array($value) || is_object($value)) {
                        return json_encode($value);  // Hoặc bạn có thể xử lý theo cách khác
                    }
                    return $value;
                }, $rowArray);
    
                fputcsv($output, $rowValues);
            }
        }
    
        fclose($output);
        exit;
    }

    public function importCSV($file) {
        $data = [];
        
        // Mở file
        if (($handle = fopen($file, 'r')) !== FALSE) {
            
            // Đọc BOM nếu có và loại bỏ nó
            $bom = fread($handle, 3); // Đọc 3 ký tự đầu tiên để kiểm tra BOM
            if ($bom === "\xEF\xBB\xBF") {
                // BOM UTF-8, bỏ qua
                $header = fgetcsv($handle, 1000, ',');
            } else {
                // Không có BOM, quay lại file và đọc header
                rewind($handle);
                $header = fgetcsv($handle, 1000, ',');
            }
            fgetcsv($handle, 1000, ',');
            
            // Đọc tiếp dữ liệu CSV
            while (($row = fgetcsv($handle, 1000, ',')) !== FALSE) {
                $data[] = (object)array_combine($header, $row);
            }
            fclose($handle);
        }
    
        return $data;
    }
    


}

?>
