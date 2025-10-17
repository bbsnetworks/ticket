<?php
                include("conexion.php");

                if ($conexion->connect_error) {
                    die("Conexión fallida: " . $conexion->connect_error);
                }
                
                $sql = "select * from ticket t inner join users u where u.iduser= t.iduser and month(fecha)=$_POST[mes] and year(fecha)=$_POST[year];";
                //$sql = "select * from users u inner join gastos g where u.iduser = g.iduser;";
                $result = $conexion->query($sql);

                

                
                if ($result->num_rows > 0) {
                    echo "<table id='contratos-table' class='table table-hover table-dark table-striped descripcion-amplia'>";
                    echo "<thead><tr><th>ID</th><th>Titulo</th><th>Total</th><th>Descripción</th><th>Fecha</th><th>Email</th><th>Telefono</th><th>IVA</th><th>Usuario</th><th>Editar</th><th>Eliminar</th><th>Imprimir</th></tr></thead>";
                    echo "<tbody>";
                    while($row = $result->fetch_assoc()) {
                        $partes = explode("\n", $row["descripcion"]);
                        $descripcionConcatenada = implode("<br>", $partes);
                        echo "<tr>";
                        echo "<td>" . $row["id"] . "</td>";
                        echo "<td>" . $row["titulo"] . "</td>";
                        echo "<td>" . $row["total"] . "</td>";
                        echo "<td style='max-width: 300px; word-wrap: break-word;'>" . $descripcionConcatenada . "</td>";
                        echo "<td>" . $row["fecha"] . "</td>";
                        echo "<td>" . $row["email"] . "</td>";
                        echo "<td>" . $row["telefono"] . "</td>";
                        if($row["iva"]==0){
                            echo "<td>No</td>";
                        }else{
                            echo "<td>Si</td>";
                        }
                        echo "<td>" . $row["nombre"] . "</td>";
                        echo "<td><button class='btn btn-warning' data-bs-toggle='modal' data-bs-target='#modalEditar' onclick=\"editGI(" . $row["id"] . ")\"><img src='../img/editar.png' height='20px'/> </button></td>";
                        echo "<td><button class='btn btn-danger' onclick=\"deleteGI(" . $row["id"] . ")\"><img src='../img/eliminar.png' height='20px'/></button></td>";
                        echo "<td><button class='btn btn-info' onclick=\"imprimir(" . $row["id"] . ")\"><img src='../img/crear.png' height='20px'/></button></td>";
                        echo "</tr>";
                    }
                    
                    echo "</tbody>";
                    echo "</table>";
                } else {
                    echo "0 resultados";
                }
                
                $conexion->close();

                echo("<script>$('#contratos-table').DataTable({responsive: true});</script>");
                
            ?>