<!Doctype html>
<html lang="en">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Ticket BBS</title>
    <link rel="stylesheet" href="css/bootstrap.min.css">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css">
    <link rel="stylesheet" href="css/generales.css">
    <link rel="stylesheet" href="css/index.css">
    <link rel="stylesheet" href="css/navbar.css">
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free/css/all.min.css" rel="stylesheet" />


</head>
<?php
session_start();

if (!isset($_SESSION['username'])) {
    header("Location: ../menu/login/index.php");
    exit();
  }

//echo "Bienvenido, " . $_SESSION['username'];
?>

<body class="">
    <?php include_once ("includes/sidebar.php"); ?>
    <div class="container-fluid main">
    <!-- <nav class="navbar navbar-expand-lg">
    <div class="container-fluid">
      <a class="navbar-brand" href="">
        <img src="./img/logo-blanco-mo.png" alt="">
      </a>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
      <i class="bi bi-list"></i>
    </button>
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="nav justify-content-end navbar-nav">
          <li class="nav-item centrar">
            <a class="nav-link crear" href="./index.php">Generar Ticket</a>
          </li>
          <li class="nav-item centrar">
            <a class="nav-link lista" href="./lista/index.php">Ver Lista de Tickets</a>
          </li>
          <li class="nav-item centrar">
            <a class="nav-link crear" href="./php/destruir_sesion.php">Salir</a>
          </li>
        </ul>
      </div>
    </div>
  </nav> -->
        <div class="row centrar">
            <div class="formulario row">
                <div class="col-12 centrar txt-ticket">
                    <span>Formulario de Ticket</span>
                </div>
                <div class="col-12">
                    <form id="compraForm">
                        <div class="row">
                            <div class="col-12 col-lg-6 titulo">
                                <label class="form-label" for="titulo">Título / Títular / Cotización :</label>
                                <input class="form-control" type="text" id="titulo" name="titulo" required>
                            </div>
                            <div class="col-12 col-lg-6 fecha">
                                <label class="form-label" for="fecha">Fecha:</label>
                                <input class="form-control" type="date" id="fecha" name="fecha" required>
                            </div>
                            <div class="col-12 col-lg-6 email">
                                <label class="form-label" for="titulo">Email:</label>
                                <input class="form-control" type="mail" id="email" name="email" required>
                            </div>
                            <div class="col-12 col-lg-6 telefono">
                                <label class="form-label" for="telefono">teléfono:</label>
                                <input class="form-control" type="text" id="telefono" name="telefono" required>
                            </div>
                            <div class="col-12 col-lg-6 user d-none">
                                <label class="form-label" for="titulo">usuario:</label>
                                <input class="form-control" type="text" id="user" name="user" value="<?php echo $_SESSION['iduser'] ?>">
                            </div>
                            <div class="col-12">
                            <div class="form-check">
                            <input class="form-check-input" type="checkbox" name="iva" id="flexCheckDefault">
                            <label class="form-check-label" for="flexCheckDefault">
                                <span>Agregar IVA</span><i class="bi bi-coin"></i>
                            </label>
                            </div>
                            </div>
                            <div class="col-12 dinamicos">
                                <div id="compraContainer" class="compraContainer">
                                    <!-- Campo inicial de compra por defecto -->
                                    <div class="compra-item row">
                                        <div class="col-12 col-lg-5 centrar input-p">
                                            <input class="form-control col-6" type="text" name="producto[]" placeholder="Producto" required>
                                        </div>
                                        <div class="col-12 col-lg-5 centrar input-p">
                                        <input class="form-control col-6" type="number" name="precio[]" placeholder="Precio" required step="0.01"
                                        onchange="calcularTotal()">
                                        </div>
                                        <div class="col-12 col-lg-1 centrar input-p">
                                        <button type="button" class="btn btn-danger"
                                        onclick="eliminarCompra(this)"><i class="bi bi-trash-fill"></i></button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="col-12 col-lg-6 centrar agregar">
                                <button type="button" class="btn" onclick="agregarCompra()"><i class="bi bi-plus-circle-fill"></i> <span>Agregar Compra</span></button>
                            </div>
                            <div class="col-12 col-lg-6 centrar">
                                <h3>Total: $<span id="total">0.00</span></h3>
                            </div>
                            <div class="col-12 centrar enviar">
                            <button type="button" class="btn" onclick="enviarFormulario()"><i class="bi bi-arrow-right-circle-fill"></i><span>Enviar</span></button>
                            <!--<button type="button" class="btn" onclick="prueba()">Prueba</button> -->
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
    <script src="js/bootstrap.bundle.min.js"
        integrity="sha384-kenU1KFdBIe4zVF0s0G1M5b4hcpxyD9F7jL+jjXkk+Q2h455rYXK/7HAuoJl+0I4"
        crossorigin="anonymous"></script>
    <script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>
    <script src="https://momentjs.com/downloads/moment.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
    <script src="js/bootstrapval.js"></script>
    <script src="js/booststraptoogletips.js"></script>
    <script src="js/index.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.5.23/jspdf.plugin.autotable.min.js"></script>
    <script src="js/sidebar.js"></script>


</body>

</html>