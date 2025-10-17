<?php
include("conexion.php");

$offset = intval($_POST['offset'] ?? 0);
$limit = intval($_POST['limit'] ?? 30);
$busqueda = trim($_POST['busqueda'] ?? '');

$where = "WHERE u.iduser = t.iduser";
if ($busqueda !== '') {
    $busqueda = $conexion->real_escape_string($busqueda);
    $where .= " AND (t.titulo LIKE '%$busqueda%' OR t.email LIKE '%$busqueda%' OR t.telefono LIKE '%$busqueda%')";
}

$sql = "SELECT * FROM ticket t INNER JOIN users u ON u.iduser = t.iduser $where ORDER BY t.fecha DESC LIMIT $offset, $limit";
$result = $conexion->query($sql);

if ($result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        $descripcionConcatenada = nl2br(htmlspecialchars($row["descripcion"]));
        echo "<tr>";
        echo "<td>" . $row["id"] . "</td>";
        echo "<td>" . htmlspecialchars($row["titulo"]) . "</td>";
        echo "<td>" . $row["total"] . "</td>";
        echo "<td style='max-width: 300px; word-wrap: break-word;'>" . $descripcionConcatenada . "</td>";
        echo "<td>" . $row["fecha"] . "</td>";
        echo "<td>" . $row["email"] . "</td>";
        echo "<td>" . $row["telefono"] . "</td>";
        echo "<td>" . ($row["iva"] ? "Sí" : "No") . "</td>";
        echo "<td>" . $row["nombre"] . "</td>";
        echo "<td><button class='btn btn-warning' data-bs-toggle='modal' data-bs-target='#modalEditar' onclick=\"editGI(" . $row["id"] . ")\"><img src='../img/editar.png' height='20px'/> </button></td>";
        echo "<td><button class='btn btn-danger' onclick=\"deleteGI(" . $row["id"] . ")\"><img src='../img/eliminar.png' height='20px'/></button></td>";
        echo "<td><button class='btn btn-info' onclick=\"imprimir(" . $row["id"] . ")\"><img src='../img/crear.png' height='20px'/></button></td>";
        echo "</tr>";
    }
} else {
    // No imprimir nada para evitar repetir la tabla.
}
$conexion->close();
?>
