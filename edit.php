<?php
require 'koneksi.php';
$input = file_get_contents('php://input');
$data = json_decode($input, true);
$id = trim($data['id']);
$nama_makanan = trim($data['nama_makanan']);
$langkah = trim($data['langkah']);
http_response_code(201);
if ($nama_makanan != '' and $langkah != '') {
    $query = mysqli_query($con, "update makanan set nama_makanan='$nama_makanan',langkah='$langkah' where
id='$id'");
    $pesan = true;
} else {
    $pesan = false;
}
echo json_encode($pesan);
echo mysqli_error($con);