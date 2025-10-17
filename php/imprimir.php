<?php
require 'conexion.php'; // Tu archivo de conexión a la base de datos

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    // Obtener y validar los datos
    $id = $_POST['id']; // ID del ticket
    $titulo = "";
    $total=0;
    $descripcion="";
    $fecha="";

    // Construir la descripción y calcular el total

    // Validar que todos los campos obligatorios están completos
    

    // Actualizar la base de datos
    $query = "select * from ticket WHERE id = $id";
    $resultado = mysqli_query($conexion, $query);

    while($row = $resultado->fetch_assoc()) {
        $titulo = $row['titulo'];
        $total = $row['total'];
        $descripcion = $row['descripcion'];
        $fecha = $row['fecha'];
        $email = $row['email'];
        $telefono = $row['telefono'];
        $iva = $row['iva'];
        }
    if ($resultado) {
        echo json_encode(['success' => true,'message' => 'Documento Generado.','titulo'=>$titulo,'total'=>$total,'descripcion'=>$descripcion,'fecha'=>$fecha,'email'=>$email,'telefono'=>$telefono,'iva'=>$iva]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Error al obtener los datos.']);
    }
    
}
?>