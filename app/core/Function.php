<?php
function insertEmpty(array &$data): void {
    $emptyRow = [];
    foreach (array_keys((array)$data[0]) as $key) {
        $emptyRow[$key] = '';
    }
    array_unshift($data, $emptyRow);
}
