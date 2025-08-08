// Configuración de la ruleta
const premios = [
  { texto: "QR", color: "#00e676", peso: 2 },
  { texto: "Combo", color: "#2979ff", peso: 2 },
  { texto: "Nada", color: "#ff1744", peso: 1 },
  { texto: "Nada", color: "#ff1744", peso: 1 },
  { texto: "Nada", color: "#ff1744", peso: 1 },
  { texto: "QR", color: "#00e676", peso: 2 },
  { texto: "Combo", color: "#2979ff", peso: 2 },
];
// Para que QR y Combo ocupen más espacio, se repiten y tienen más peso visual

const TOTAL_TIRADAS = 10;
let tiradasRestantes = [TOTAL_TIRADAS, TOTAL_TIRADAS];

// Dibuja la ruleta
function dibujarRuleta(canvas, premios) {
  const ctx = canvas.getContext('2d');
  const totalPeso = premios.reduce((a, b) => a + b.peso, 0);
  let anguloInicio = 0;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  premios.forEach(premio => {
    const angulo = (premio.peso / totalPeso) * 2 * Math.PI;
    ctx.beginPath();
    ctx.moveTo(150, 150);
    ctx.arc(150, 150, 140, anguloInicio, anguloInicio + angulo);
    ctx.fillStyle = premio.color;
    ctx.fill();
    ctx.save();
    ctx.translate(150, 150);
    ctx.rotate(anguloInicio + angulo / 2);
    ctx.textAlign = "right";
    ctx.font = "bold 18px Arial";
    ctx.fillStyle = "#222";
    ctx.fillText(premio.texto, 120, 10);
    ctx.restore();
    anguloInicio += angulo;
  });
  // Flecha
  ctx.beginPath();
  ctx.moveTo(150, 10);
  ctx.lineTo(140, 30);
  ctx.lineTo(160, 30);
  ctx.closePath();
  ctx.fillStyle = "#fff";
  ctx.fill();
}

// Siempre devuelve el índice de un "Nada"
function obtenerNadaIndex() {
  // Busca los índices de los "Nada"
  const nadaIndices = premios
    .map((p, i) => p.texto === "Nada" ? i : -1)
    .filter(i => i !== -1);
  // Elige uno al azar
  return nadaIndices[Math.floor(Math.random() * nadaIndices.length)];
}

// Maneja el giro de la ruleta
function girarRuleta(idx) {
  if (tiradasRestantes[idx] <= 0) {
    document.getElementById(`resultado${idx+1}`).textContent = "¡No quedan tiradas!";
    return;
  }
  tiradasRestantes[idx]--;
  document.getElementById(`tiradas${idx+1}`).textContent = `Tiradas restantes: ${tiradasRestantes[idx]}`;
  // Siempre sale "Nada"
  const nadaIndex = obtenerNadaIndex();
  animarRuleta(document.getElementById(`ruleta${idx+1}`), nadaIndex, () => {
    document.getElementById(`resultado${idx+1}`).textContent = "Nada... ¡Troll!";
  });
}

// Animación simple de la ruleta
function animarRuleta(canvas, premioIndex, callback) {
  let vueltas = 20 + Math.floor(Math.random() * 5);
  let anguloActual = 0;
  const totalPeso = premios.reduce((a, b) => a + b.peso, 0);
  // Calcula el ángulo final para que caiga en el premioIndex
  let anguloPremio = 0;
  for (let i = 0; i <= premioIndex; i++) {
    anguloPremio += (premios[i].peso / totalPeso) * 2 * Math.PI;
  }
  anguloPremio -= ((premios[premioIndex].peso / totalPeso) * Math.PI);

  function animar() {
    if (vueltas > 0) {
      anguloActual += 0.3 + vueltas * 0.01;
      vueltas--;
      canvas.style.transform = `rotate(${anguloActual}rad)`;
      requestAnimationFrame(animar);
    } else {
      canvas.style.transform = `rotate(${anguloPremio}rad)`;
      callback();
    }
  }
  animar();
}

// Contador regresivo
function iniciarContador(id, fechaObjetivo) {
  function actualizar() {
    const ahora = new Date();
    const diff = fechaObjetivo - ahora;
    if (diff <= 0) {
      document.getElementById(id).textContent = "¡Ya empezó!";
      return;
    }
    const horas = Math.floor(diff / (1000 * 60 * 60));
    const minutos = Math.floor((diff / (1000 * 60)) % 60);
    const segundos = Math.floor((diff / 1000) % 60);
    document.getElementById(id).textContent =
      `Faltan ${horas}h ${minutos}m ${segundos}s`;
    setTimeout(actualizar, 1000);
  }
  actualizar();
}

// Inicialización
window.onload = function() {
  dibujarRuleta(document.getElementById('ruleta1'), premios);
  dibujarRuleta(document.getElementById('ruleta2'), premios);
  document.getElementById('tiradas1').textContent = `Tiradas restantes: ${TOTAL_TIRADAS}`;
  document.getElementById('tiradas2').textContent = `Tiradas restantes: ${TOTAL_TIRADAS}`;
  document.getElementById('girar1').onclick = () => girarRuleta(0);
  document.getElementById('girar2').onclick = () => girarRuleta(1);

  // Cambia la fecha objetivo a la de tu evento
  const fechaEvento = new Date();
  fechaEvento.setHours(fechaEvento.getHours() + 5); // Por ejemplo, faltan 5 horas
  iniciarContador('contador1', fechaEvento);
  iniciarContador('contador2', fechaEvento);
};