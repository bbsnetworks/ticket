function eliminarCompra(button) {
  // Encuentra el contenedor de toda la línea del registro
  const compraItem = button.closest('.compra-item');
  
  if (compraCount > 1) {
    // Elimina la línea completa
    compraItem.remove();
    compraCount--;

    calcularTotal();
  } else {
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "No se pudo eliminar ya que es el último registro",
    });
  }
}
let compraCount = 1;
const maxCompras = 5;

function agregarCompra() {
  if (compraCount >= maxCompras) {
    Swal.fire({
      icon: "error",
      title: "Límite alcanzado",
      text: "Máximo de 5 compras alcanzado",
    });
    return;
  }

  const container = document.getElementById("compraContainer");
  const div = document.createElement("div");
  div.className = "compra-item";
  div.innerHTML = `
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
    `;
  container.appendChild(div);
  compraCount++;
}

function calcularTotal() {
  const precios = document.getElementsByName("precio[]");
  let total = 0;
  for (const precio of precios) {
    total += parseFloat(precio.value) || 0;
  }
  document.getElementById("total").textContent = total.toFixed(2);
}

async function enviarFormulario() {

  if($("#titulo").val().length>0 && $("#email").val().length>0 && $("#telefono").val().length>0){
  const formData = new FormData(document.getElementById("compraForm"));

  // Concatena los datos en una cadena de texto
  const productos = formData.getAll("producto[]");
  const precios = formData.getAll("precio[]");
  let comprasTexto = "";
  let llave = false;
  for (let i = 0; i < productos.length; i++) {
    const productoValido = productos[i] && productos[i].trim().length > 0; // No vacío
      const precioValido = precios[i] && !isNaN(precios[i]) && parseFloat(precios[i]) > 0;
    // Verifica que ambos valores existan
    if (productoValido && precioValido) {
      comprasTexto += `Producto: ${productos[i]}, Precio: $${parseFloat(precios[i]).toFixed(2)}\n`;
      llave = true;
      
    }else{
      Swal.fire({
        icon: "error",
        title: "Faltan Datos por llenar",
        text:"Asegurate de haber llenado todos los campos",
      });
      llave=false;
    }
    console.log(llave);
  }
  if(llave){
  formData.append("descripcion", comprasTexto);

  // Añade título, fecha y total al formData
  formData.append("total", document.getElementById("total").textContent);

  const ivaCheckbox = document.getElementById("flexCheckDefault").checked;
  formData.append("iva", ivaCheckbox ? "1" : "0");

  try {
    const response = await fetch("./php/agregarTicket.php", {
      method: "POST",
      body: formData,
    });
    const data = await response.json();

    if (data.message == "ok") {
      Swal.fire({
        icon: "success",
        title: "Ticket Guardado y Documento Generado",
        text: "El Ticket se ha guardado correctamente y se generará el PDF.",
      });
      $titulo = document.getElementById("titulo").value;
      $email = document.getElementById("email").value;
      $telefono = document.getElementById("telefono").value;
      $fecha = document.getElementById("fecha").value;
      $total = document.getElementById("total").textContent;
      //console.log(data.datos);
      const ivaMarcado = document.getElementById("flexCheckDefault").checked;
      if (ivaMarcado) {
        generarPDFIVA(comprasTexto, $titulo, $email, $telefono, $total);
      } else {
        generarPDF(comprasTexto, $titulo, $email, $telefono, $total);
      }

      document.getElementById("titulo").value = "";
      document.getElementById("email").value = "";
      document.getElementById("telefono").value = "";
      document.getElementById("flexCheckDefault").checked = false;
      resetearCompras();
    } else {
      console.log(data.message); // Muestra el mensaje exacto del servidor
      Swal.fire({
        icon: "error",
        title: "Error al guardar",
        text: data.message || "Ocurrió un error al guardar el ticket",
      });
    }
  } catch (error) {
    const text = await error.message; // Intenta leer el cuerpo de la respuesta de error como texto
    console.log("Detalles del error:", text);
    Swal.fire({
      icon: "error",
      title: "Error de conexión",
      text: "No se pudo conectar con el servidor",
    });
  }
}
}else{
  Swal.fire({
    icon: "error",
    title: "Faltan Datos por llenar",
    text:"Asegurate de haber llenado todos los campos",
  });
}
}
async function prueba() {
  var textoPrueba = `Producto: Producto1, Precio: $100\n \n \n`;
  textoPrueba += `Producto: Producto2, Precio: $500\n \n \n`;
  textoPrueba += `Producto: Producto3, Precio: $1000\n \n \n`;
  const { jsPDF } = window.jspdf; // Asegúrate de que el script jsPDF esté cargado correctamente

  const doc = new jsPDF();

  // Carga la imagen de fondo
  const img = new Image();
  img.src = "./img/comprobante.jpg"; // Coloca aquí la ruta de tu imagen
  img.onload = () => {
    doc.addImage(img, "JPEG", 0, 0, 210, 297); // Tamaño A4

    // Agrega el título, fecha y total
    doc.setFontSize(16);
    doc.setFont(undefined, "bold");
    doc.setTextColor(0, 161, 228);
    doc.text(document.getElementById("titulo").value, 22, 90);
    var fecha1 = document.getElementById("fecha").value;
    fecha1 = moment().format("DD-MM-YYYY");
    doc.text("Fecha: " + fecha1, 142, 90);
    doc.setTextColor(0, 161, 228);
    doc.text(
      "Total: $" + document.getElementById("total").textContent,
      148,
      255
    );
    doc.setFontSize(15);
    // Agrega el texto de las compras
    doc.setTextColor(239, 128, 19);
    doc.text(textoPrueba, 22, 130);

    // Abre el PDF en una nueva pestaña
    const pdfBlobUrl = doc.output("bloburl");
    window.open(pdfBlobUrl, "_blank");
  };
}

date = moment().format("YYYY-MM-DD");
date = date.toString();
document.getElementById("fecha").value = date;

document.querySelector("#fecha").innerHTML = moment().format("DD/MM/yyyy");

function generarPDF(comprasTexto,titulo,email,telefono,total) {
  const { jsPDF } = window.jspdf; // Asegúrate de que el script jsPDF esté cargado correctamente
  const doc = new jsPDF();

  // Carga la imagen de fondo
  const img = new Image();
  img.src = "../ticket/img/comprobante.jpg"; // Coloca aquí la ruta de tu imagen
  img.onload = () => {
    doc.addImage(img, "JPEG", 0, 0, 210, 297); // Tamaño A4
    doc.setTextColor(0, 161, 228);
    doc.setFontSize(14);
    doc.setFont(undefined, "bold");
    doc.text("Fecha: " + date, 148, 90);
    doc.text("Correo: " + email, 18, 100);
    doc.text("Telefóno: " + telefono, 18, 110);
    // Agrega el título, fecha y total
    doc.text(titulo, 18, 90);
    
    doc.text("Total: $" + total, 193, 255, { align: "right" });
    //console.log(comprasTexto);
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
function generarPDFIVA(comprasTexto, titulo, email, telefono, total) {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  const img = new Image();
  img.src = "../ticket/img/comprobante.jpg"; // ajusta si tu ruta es otra
  img.onload = () => {
    doc.addImage(img, "JPEG", 0, 0, 210, 297);

    // Encabezado
    doc.setTextColor(0, 161, 228);
    doc.setFontSize(14);
    doc.setFont(undefined, "bold");
    doc.text("Fecha: " + date, 148, 90);
    doc.text("Correo: " + email, 18, 100);
    doc.text("Telefóno: " + telefono, 18, 110);
    doc.text(titulo, 18, 90);

    // Montos (mismo criterio que ya usas en table.js)
    const totalNum = parseFloat(total) || 0;
    const subtotal = (totalNum * 0.84);
    const iva = (totalNum * 0.16);

    doc.setTextColor(0, 0, 0);
    doc.text("Subtotal: $" + subtotal.toFixed(2), 193, 235, { align: "right" });
    doc.text("IVA 16%: $" + iva.toFixed(2),       193, 245, { align: "right" });
    doc.text("Total: $" + totalNum.toFixed(2),    193, 255, { align: "right" });

    // Tabla de conceptos (mostrando precio ya como 84%)
    const comprasArray = comprasTexto
      .split("\n")
      .map(l => l.trim())
      .filter(l => l !== "")
      .map(l => {
        const m = l.match(/^Producto: (.+), Precio: \$(\d+(\.\d{1,2})?)$/);
        if (m) {
          const [, producto, precio] = m;
          const precioNeto = parseFloat(precio) * 0.84;
          return [producto.trim(), "$" + precioNeto.toFixed(2)];
        }
        return null;
      })
      .filter(Boolean);

    doc.autoTable({
      startY: 120,
      head: [["Producto", "Precio"]],
      body: comprasArray,
      styles: { font: "helvetica", fontSize: 12, textColor: [0,0,0], valign: "middle" },
      headStyles: { fillColor: [0,161,228], textColor: [255,255,255], halign: "center" },
      columnStyles: { 0: { halign: "left" }, 1: { halign: "right" } },
    });

    const pdfBlobUrl = doc.output("bloburl");
    window.open(pdfBlobUrl, "_blank");
  };
}

function resetearCompras() {
  const container = document.getElementById("compraContainer");
  container.innerHTML = `
    <div class="compra-item row">
      <div class="col-12 col-lg-5 centrar input-p">
        <input class="form-control col-6" type="text" name="producto[]" placeholder="Producto" required>
      </div>
      <div class="col-12 col-lg-5 centrar input-p">
        <input class="form-control col-6" type="number" name="precio[]" placeholder="Precio" required step="0.01"
          onchange="calcularTotal()">
      </div>
      <div class="col-12 col-lg-1 centrar input-p">
        <button type="button" class="btn btn-danger" onclick="eliminarCompra(this)">
          <i class="bi bi-trash-fill"></i>
        </button>
      </div>
    </div>
  `;

  // Reiniciar la variable de conteo de compras
  compraCount = 1;

  // Reiniciar el total
  document.getElementById("total").textContent = "0.00";
}