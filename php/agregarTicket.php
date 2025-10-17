<?php
header('Content-Type: application/json');
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

ob_start(); // Inicia un buffer de salida para capturar errores y advertencias

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $titulo = $_POST['titulo'];
    $fecha = $_POST['fecha'];
    $total = $_POST['total'];
    $iva = $_POST['iva'];
    $descripcion = $_POST['descripcion'];
    $iduser = $_POST['user'];
    $telefono = $_POST['telefono'];
    $email = $_POST['email'];



    //echo json_encode(['message' => "Titulo: ".$titulo."Fecha: ".$fecha."Total: ".$total."iva: ".$iva."Descripcion: ".$descripcion."ID: ".$id]);
    include "../php/conexion.php";

    if (!$conexion) {
        echo json_encode(['success' => false, 'message' => 'Error de conexión: ' . mysqli_connect_error()]);
        exit;
    }

    // Inserta los datos en la tabla 'ticket'
    $query = "INSERT INTO ticket (titulo, total, descripcion, fecha, iduser,email,telefono,iva) VALUES ('$titulo', '$total', '$descripcion', '$fecha', '$iduser','$email','$telefono','$iva')";

    if (mysqli_query($conexion, $query)) {
        //echo json_encode(['success' => true, 'message' => 'ok','datos' => "Titulo: ".$titulo."Fecha: ".$fecha."Total: ".$total."iva: ".$iva."Descripcion: ".$descripcion."ID: ".$iduser]);
        echo json_encode(['success' => true, 'message' => 'ok']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Error al guardar: ' . mysqli_error($conexion)]);
    }

    mysqli_close($conexion);
} else {
    echo json_encode(['success' => false, 'message' => 'Método de solicitud no permitido.']);
}

// Captura cualquier error no esperado
//  $output = ob_get_clean();
//  if (!empty($output)) {
//      echo json_encode(['success' => false, 'message' => 'Error inesperado: ' . $output]);
//  }
?>

