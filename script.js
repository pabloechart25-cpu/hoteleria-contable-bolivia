const habitaciones = [];
const reservas = [];

// Agregar habitación
document.getElementById("habitacionForm").addEventListener("submit", function(e){
  e.preventDefault();

  const num = document.getElementById("numHabitacion").value.trim();
  const tipo = document.getElementById("tipoHabitacion").value;
  const precio = parseFloat(document.getElementById("precioHabitacion").value);

  if(!num || isNaN(precio)){
    alert("Llena todos los campos correctamente.");
    return;
  }

  const habitacion = { num, tipo, precio };
  habitaciones.push(habitacion);

  // Actualizar select de reservas
  actualizarSelectHabitaciones();

  this.reset();
});

// Actualizar select de habitaciones
function actualizarSelectHabitaciones(){
  const select = document.getElementById("habitacionSelect");
  select.innerHTML = "";
  habitaciones.forEach((h, i) => {
    select.innerHTML += `<option value="${i}">#${h.num} - ${h.tipo}</option>`;
  });
}

// Agregar reserva
document.getElementById("reservaForm").addEventListener("submit", function(e){
  e.preventDefault();

  const cliente = document.getElementById("cliente").value.trim();
  const habitacionIndex = parseInt(document.getElementById("habitacionSelect").value);
  const fechaEntrada = document.getElementById("fechaEntrada").value;
  const fechaSalida = document.getElementById("fechaSalida").value;
  const metodo = document.getElementById("metodoPago").value;

  if(!cliente || isNaN(habitacionIndex) || !fechaEntrada || !fechaSalida){
    alert("Llena todos los campos correctamente.");
    return;
  }

  const habitacion = habitaciones[habitacionIndex];

  const reserva = {
    cliente,
    habitacionNum: habitacion.num,
    tipo: habitacion.tipo,
    precio: habitacion.precio,
    fechaEntrada,
    fechaSalida,
    metodo,
    fechaRegistro: new Date()
  };

  reservas.push(reserva);
  actualizarTablaReservas();
  this.reset();
});

// Actualizar tabla reservas
function actualizarTablaReservas(){
  const tbody = document.querySelector("#reservasTable tbody");
  tbody.innerHTML = "";

  reservas.forEach((r, index)=>{
    const fila = document.createElement("tr");
    fila.innerHTML = `
      <td>${r.cliente}</td>
      <td>${r.habitacionNum}</td>
      <td>${r.tipo}</td>
      <td>${r.precio}</td>
      <td>${r.fechaEntrada}</td>
      <td>${r.fechaSalida}</td>
      <td>${r.metodo}</td>
      <td><button onclick="eliminarReserva(${index})">❌</button></td>
    `;
    tbody.appendChild(fila);
  });
}

function eliminarReserva(index){
  reservas.splice(index,1);
  actualizarTablaReservas();
}

// Exportar PDF
document.getElementById("descargarPDF").addEventListener("click", () => {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  const periodo = document.getElementById("periodo").value;
  let titulo = "";

  if(periodo === "dia") titulo = "Reporte Diario de Reservas";
  if(periodo === "mes") titulo = "Reporte Mensual de Reservas";
  if(periodo === "trimestre") titulo = "Reporte Trimestral de Reservas";

  doc.text("🏨 Hotel Control", 14, 15);
  doc.text(titulo, 14, 25);

  const data = reservas.map(r => [
    r.cliente, r.habitacionNum, r.tipo, r.precio, r.fechaEntrada, r.fechaSalida, r.metodo
  ]);

  doc.autoTable({
    head:[["Cliente","Habitación","Tipo","Precio/Noche","Entrada","Salida","Método"]],
    body: data,
    startY: 35
  });

  doc.save(`${titulo.replace(/ /g,"_")}.pdf`);
});
