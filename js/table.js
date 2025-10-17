// date = moment().format("YYYY-MM");
// date = date.toString();
// document.getElementById("fecha").value = date;
// mes = moment().format("MM");
// mes = mes.toString();
// year = moment().format("YYYY");
// year = year.toString();
// $("#fecha").on("change", function () {
//   // Obtener el valor del input
//   var valorFecha = $("#fecha").val();
  

//   // Separar el valor en año y mes
//   var yearFecha = valorFecha.split("-")[0]; // Obtener el año
//   var mesFecha = valorFecha.split("-")[1]; // Obtener el mes

//   cargarTabla(mesFecha,yearFecha);

// });
// function cargarTabla(mes,year) {
//   console.log(mes);
//   console.log(year);
//   var formData = new FormData();
//   formData.append("mes", mes);
//   formData.append("year", year);
//     $.ajax({
//         url: '../php/cargarTabla.php',
//         data: formData,
//         processData: false,
//         contentType: false,
//         type: 'POST',
//         success: function(response) {
//             $('#tabla').html(response);
//         },
//         error: function(jqXHR, textStatus, errorThrown) {
//             $('#tabla').html('Error al cargar la tabla: ' + textStatus);
//         }
//     });
// }

//cargarTabla(mes,year);

function editGI(id){
    $.ajax({
        url: "../php/editarGI.php", // Archivo PHP que manejará la solicitud
        type: "POST",
        data: {
            id:id
        },
        success: function (response) {
            //console.log(response);
            $('#modal2').html(response);
        },
        error: function (jqXHR, textStatus, errorThrown) {
          $("#resultado").html("Error al editar el registro: " + textStatus);
        },
      });
}

function deleteGI(id){
    Swal.fire({
        title: "Estas seguro de eliminar el registro?",
        showDenyButton: true,
        confirmButtonText: "Si",
      }).then((result) => {
        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) {
          //Swal.fire("Registro Eliminado!", "", "success");
          var formData = new FormData();
          formData.append('id',id)
          $.ajax('../php/deleteGI.php',
            {
              method: 'POST',
              data: formData,
              processData: false,
              contentType: false,
              success: function(data){
                
                var jsonResponse = JSON.parse(data);
        
                if (jsonResponse.status === "success") {
                  var valorFecha = $("#fecha").val();
              
              var yearFecha = valorFecha.split("-")[0]; // Obtener el año
              var mesFecha = valorFecha.split("-")[1]; // Obtener el mes
                    // La consulta fue exitosa
                    Swal.fire('Éxito', jsonResponse.message, 'success');
                    cargarTabla(mesFecha,yearFecha);
                } else {
                    // Hubo un error en la consulta
                    Swal.fire('Error', jsonResponse.message, 'error');
                }
          
                
          
              },
              error: function(data){
                console.log(data);
                Swal.fire({
                          title: "No se pudo generar eliminar el registro",
                          icon: "error",
                          confirmButtonColor: "#3085d6",
                          confirmButtonText: "OK",
                          width: "35rem"
                      });
              }
            });
        } else if (result.isDenied) {
          //Swal.fire("No se elimino el registro", "", "info");
        }
      });
}  
//agregar y eliminar producto

// Función para agregar un nuevo campo
function agregarCompra() {
  const compraContainer = document.getElementById('compraContainer');
  const nuevaCompra = document.createElement('div');
  nuevaCompra.classList.add('compra-item', 'row');

  nuevaCompra.innerHTML = `
    <div class="compra-item row">
        <div class="col-12 col-lg-5 centrar input-p">
             <input class="form-control col-6" type="text" name="producto[]" placeholder="Producto" required>
        </div>
        <div class="col-12 col-lg-5 centrar input-p">
            <input class="form-control col-6" type="number" name="precio[]" placeholder="Precio" required step="0.01"
                onchange="calcularTotal()">
            </div>
        <div class="col-12 col-lg-1 centrar trash">
            <button type="button" class="btn btn-danger"
            onclick="eliminarCompra(this)"><i class="bi bi-trash-fill"></i></button>
        </div>
    </div>
    `;

  compraContainer.appendChild(nuevaCompra);
  calcularTotal();
}

// Función para eliminar un campo
function eliminarCompra(boton) {
  const compraItem = boton.closest('.compra-item');
  const compraContainer = document.getElementById('compraContainer');

  if (compraContainer.childElementCount > 1) {
      compraContainer.removeChild(compraItem);
  } else {
      alert('Debe haber al menos un campo de producto y precio.');
  }
  calcularTotal();
}

// Opcional: Función para calcular el total
function calcularTotal() {
  const precios = document.querySelectorAll('input[name="precio[]"]');
  let total = 0;

  precios.forEach(precio => {
      const value = parseFloat(precio.value) || 0;
      total += value;
  });

  document.getElementById('total').value = total.toFixed(2); // Si tienes un campo total en el formulario
}
function enviarFormulario() {
  const datosFormulario = $('#editForm').serialize(); // Serializa todos los campos del formulario
  console.log(datosFormulario);
  $.ajax({
      url: '../php/updateGI.php', // Archivo PHP para manejar la actualización
      type: 'POST',
      data: datosFormulario, // Datos serializados
      success: function (respuesta) {
          // Procesar la respuesta del servidor
          const resultado = JSON.parse(respuesta); // Asegúrate de devolver JSON desde PHP
          console.log(resultado.query);
          if (resultado.success) {
              Swal.fire({
                  icon: 'success',
                  title: '¡Actualizado!',
                  text: 'El ticket se actualizó correctamente.',
              }).then(() => {
                var valorFecha = $("#fecha").val();
              
                var yearFecha = valorFecha.split("-")[0]; // Obtener el año
                var mesFecha = valorFecha.split("-")[1]; // Obtener el mes
                $('#modalEditar').modal('hide');
                cargarTabla(mesFecha,yearFecha);
              });
          } else {
              Swal.fire({
                  icon: 'error',
                  title: 'Error',
                  text: resultado.message + resultado.datos || 'Ocurrió un error al actualizar.',
              });
          }
      },
      error: function () {
          Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'No se pudo conectar con el servidor.',
          });
      }
  });
}
function imprimir(id){

    /* Read more about isConfirmed, isDenied below */
      //Swal.fire("Registro Eliminado!", "", "success");
      var formData = new FormData();
      formData.append('id',id)
      $.ajax('../php/imprimir.php',
        {
          method: 'POST',
          data: formData,
          processData: false,
          contentType: false,
          success: function(data){
            
            var jsonResponse = JSON.parse(data);
    
            if (jsonResponse.success) {
                // La consulta fue exitosa
                //Swal.fire('Éxito', jsonResponse.message, 'success');
                console.log(jsonResponse.iva);
                if(jsonResponse.iva==0){
                  generarPDF(jsonResponse.titulo,jsonResponse.fecha,jsonResponse.total,jsonResponse.descripcion,jsonResponse.email,jsonResponse.telefono);
                }else if(jsonResponse.iva==1){
                   generarPDFIVA(jsonResponse.titulo,jsonResponse.fecha,jsonResponse.total,jsonResponse.descripcion,jsonResponse.email,jsonResponse.telefono);
                }
               
            } else {
                // Hubo un error en la consulta
                Swal.fire('Error', jsonResponse.message, 'error');
            }
      
          },
          error: function(data){
            console.log(data);
            Swal.fire({
                      title: "No se pudo imprimir el comprobante",
                      icon: "error",
                      confirmButtonColor: "#3085d6",
                      confirmButtonText: "OK",
                      width: "35rem"
                  });
          }
        });
}
function generarPDF(titulo, fecha, total, comprasTexto,email,telefono) {
  const { jsPDF } = window.jspdf; // Asegúrate de que el script jsPDF esté cargado correctamente
  const doc = new jsPDF();

  // Carga la imagen de fondo
  const img = new Image();
  img.src = "../img/comprobante.jpg"; // Coloca aquí la ruta de tu imagen
  img.onload = () => {
    doc.addImage(img, "JPEG", 0, 0, 210, 297); // Tamaño A4

    // Agrega el título, fecha y total
    doc.setFontSize(14);
    doc.setFont(undefined, "bold");
    doc.setTextColor(0, 161, 228);
    doc.text(titulo, 18, 90);
    doc.text("Fecha: " + fecha, 148, 90);
    doc.text("Correo: " + email, 18, 100);
    doc.text("Telefóno: " + telefono, 18, 110);
    doc.text("Total: $" + total, 193, 255, { align: "right" });
    

    

    // Limpieza del texto y conversión a un array de objetos con validación
    const comprasArray = comprasTexto
      .split("\n")
      .map(linea => linea.trim()) // Elimina espacios antes y después de cada línea
      .filter(linea => linea !== "") // Elimina líneas vacías
      .map(linea => {
        const match = linea.match(/^Producto: (.+), Precio: \$(\d+(\.\d{1,2})?)$/);
        if (match) {
          const [, producto, precio] = match; // Extrae las partes usando desestructuración
          return [producto.trim(), "$"+precio.trim()];
        }
        return null; // Ignora líneas que no cumplen el formato
      })
      .filter(row => row !== null); // Elimina las filas no válidas

    // Configura la tabla con texto centrado
    doc.autoTable({
      startY: 120, // Posición inicial de la tabla
      head: [["Producto", "Precio"]], // Cabeceras de la tabla
      body: comprasArray, // Datos de la tabla
      styles: {
        font: "helvetica", // Fuente general
        fontSize: 12,
        textColor: [0, 0, 0],
        valign: "middle", // Centra verticalmente el texto en las celdas
      },
      headStyles: {
        fillColor: [0, 161, 228], // Color de fondo de las cabeceras
        textColor: [255, 255, 255], // Color del texto de las cabeceras
        halign: "center", // Centra horizontalmente el texto de las cabeceras
      },
      columnStyles: {
        0: { halign: "left" }, // Primera columna alineada a la izquierda
        1: { halign: "right" }, // Segunda columna alineada a la derecha
      },
    });

    // Abre el PDF en una nueva pestaña
    const pdfBlobUrl = doc.output("bloburl");
    window.open(pdfBlobUrl, "_blank");
  };
}
function generarPDFIVA(titulo, fecha, total, comprasTexto,email,telefono) {
  const { jsPDF } = window.jspdf; // Asegúrate de que el script jsPDF esté cargado correctamente
  const doc = new jsPDF();

  // Carga la imagen de fondo
  const img = new Image();
  img.src = "../img/comprobante.jpg"; // Coloca aquí la ruta de tu imagen
  img.onload = () => {
    doc.addImage(img, "JPEG", 0, 0, 210, 297); // Tamaño A4

    // Agrega el título, fecha y total
    doc.setFontSize(14);
    doc.setFont(undefined, "bold");
    doc.setTextColor(0, 0, 0);
    doc.text(titulo, 18, 90);
    doc.text("Fecha: " + fecha, 148, 90);
    doc.text("Correo: " + email, 18, 100);
    doc.text("Telefóno: " + telefono, 18, 110);
    doc.text("Subtotal: $" + (total*0.84), 193, 235, { align: "right" });
    doc.text("IVA 16%: $" + (total*0.16), 193, 245, { align: "right" });
    doc.text("Total: $" + total, 193, 255, { align: "right" });

    
    

    

    // Limpieza del texto y conversión a un array de objetos con validación
    const comprasArray = comprasTexto
      .split("\n")
      .map(linea => linea.trim()) // Elimina espacios antes y después de cada línea
      .filter(linea => linea !== "") // Elimina líneas vacías
      .map(linea => {
        const match = linea.match(/^Producto: (.+), Precio: \$(\d+(\.\d{1,2})?)$/);
        if (match) {
          const [, producto, precio] = match; // Extrae las partes usando desestructuración
          var precioR = parseFloat(precio.trim())*0.84;
          return [producto.trim(), "$"+precioR.toFixed(2)];
        }
        return null; // Ignora líneas que no cumplen el formato
      })
      .filter(row => row !== null); // Elimina las filas no válidas

    // Configura la tabla con texto centrado
    doc.autoTable({
      startY: 120, // Posición inicial de la tabla
      head: [["Producto", "Precio"]], // Cabeceras de la tabla
      body: comprasArray, // Datos de la tabla
      styles: {
        font: "helvetica", // Fuente general
        fontSize: 12,
        textColor: [0, 0, 0],
        valign: "middle", // Centra verticalmente el texto en las celdas
        fillColor: null,
      },
      headStyles: {
        fillColor: [0, 161, 228], // Color de fondo de las cabeceras
        textColor: [255, 255, 255], // Color del texto de las cabeceras
        halign: "center", // Centra horizontalmente el texto de las cabeceras
      },
      columnStyles: {
        0: { halign: "left" }, // Primera columna alineada a la izquierda
        1: { halign: "right" }, // Segunda columna alineada a la derecha
      },
    });

    // Abre el PDF en una nueva pestaña
    const pdfBlobUrl = doc.output("bloburl");
    window.open(pdfBlobUrl, "_blank");
  };
}
let offset = 0;
const limit = 30;
let terminoBusqueda = "";

function cargarLazy(append = false) {
  const formData = new FormData();
  formData.append("offset", offset);
  formData.append("limit", limit);
  formData.append("busqueda", terminoBusqueda);

  $.ajax({
    url: '../php/lazyTabla.php',
    data: formData,
    method: 'POST',
    contentType: false,
    processData: false,
    success: function (response) {
      if (append) {
        $('#tabla table tbody').append(response);
      } else {
        $('#tabla').html(`
          <table class='table table-hover table-dark table-striped descripcion-amplia'>
            <thead>
              <tr><th>ID</th><th>Titulo</th><th>Total</th><th>Descripción</th><th>Fecha</th><th>Email</th><th>Teléfono</th><th>IVA</th><th>Usuario</th><th>Editar</th><th>Eliminar</th><th>Imprimir</th></tr>
            </thead>
            <tbody>${response}</tbody>
          </table>`);
      }

      offset += limit;
    },
    error: function () {
      Swal.fire("Error", "No se pudo cargar la tabla", "error");
    }
  });
}

// Cargar inicial
cargarLazy();

// Botón ver más
$("#verMas").on("click", function () {
  cargarLazy(true);
});

// Búsqueda
$("#busqueda").on("input", function () {
  terminoBusqueda = $(this).val().trim();
  offset = 0;
  cargarLazy(false);
});




