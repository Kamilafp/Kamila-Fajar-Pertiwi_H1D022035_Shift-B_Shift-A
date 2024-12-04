<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
require 'koneksi.php';
$data = [];
$query = mysqli_query($con, "select * from makanan");
while ($row = mysqli_fetch_object($query)) {
    $data[] = $row;
}
echo json_encode($data);
echo mysqli_error($con);