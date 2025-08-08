const premios = [
  { texto: "QR", color: "#00e676", peso: 2 },
  { texto: "Nada", color: "#ff1744", peso: 1 },
  { texto: "Combo", color: "#2979ff", peso: 2 },
  { texto: "Nada", color: "#ff1744", peso: 1 },
  { texto: "QR", color: "#00e676", peso: 2 },
  { texto: "Nada", color: "#ff1744", peso: 1 },
  { texto: "Combo", color: "#2979ff", peso: 2 },
];

const TOTAL_TIRADAS = 10;
let tiradasRestantes = TOTAL_TIRADAS;

function dibujarRuleta(canvas, premios, angulo = 0) {
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.save();
  ctx.translate(150, 150);
  ctx.rotate(angulo);

  const totalPeso = premios.reduce((a, b) => a + b.peso, 0);
  let anguloInicio = 0;
  premios.forEach(premio => {
    const anguloPremio = (premio.peso / totalPeso) * 2 * Math.PI;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.arc(0, 0, 140, anguloInicio, anguloInicio + anguloPremio);
    ctx.fillStyle = premio.color;
    ctx.fill();
    // Texto
    ctx.save();
    ctx.rotate(anguloInicio + anguloPremio / 2);
    ctx.textAlign = "right";
    ctx.font = "bold 18px Arial";
    ctx.fillStyle = "#222";
    ctx.fillText(premio.texto, 120, 10);
    ctx.restore();
    anguloInicio += anguloPremio;
  });
  ctx.restore();

  // Triángulo arriba (puntero)
  ctx.beginPath();
  ctx.moveTo(150, 10); // punta arriba
  ctx.lineTo(140, 35);
  ctx.lineTo(160, 35);
  ctx.closePath();
  ctx.fillStyle = "#fff";
  ctx.strokeStyle = "#222";
  ctx.lineWidth = 2;
  ctx.fill();
  ctx.stroke();
}

function obtenerNadaIndex() {
  const nadaIndices = premios
    .map((p, i) => p.texto === "Nada" ? i : -1)
    .filter(i => i !== -1);
  return nadaIndices[Math.floor(Math.random() * nadaIndices.length)];
}

function girarRuleta() {
  if (tiradasRestantes <= 0) {
    document.getElementById(`resultado`).textContent = "¡No quedan tiradas!";
    return;
  }
  tiradasRestantes--;
  document.getElementById(`tiradas`).textContent = `Tiradas restantes: ${tiradasRestantes}`;
  const nadaIndex = obtenerNadaIndex();
  animarRuleta(document.getElementById(`ruleta`), nadaIndex, () => {
    document.getElementById(`resultado`).textContent = "Nada... ¡Troll!";
  });
}

function animarRuleta(canvas, premioIndex, callback) {
  const totalPeso = premios.reduce((a, b) => a + b.peso, 0);

  // Ángulo final para que caiga en el premioIndex (puntero arriba)
  let anguloPremio = 0;
  for (let i = 0; i < premioIndex; i++) {
    anguloPremio += (premios[i].peso / totalPeso) * 2 * Math.PI;
  }
  anguloPremio += ((premios[premioIndex].peso / totalPeso) * Math.PI);

  // Gira muchas vueltas (ej: 8 a 12 vueltas)
  const vueltas = 8 + Math.floor(Math.random() * 5);
  const anguloFinal = vueltas * 2 * Math.PI + (2 * Math.PI - anguloPremio);

  let start = null;
  const duracion = 3000; // 3 segundos

  function animateRuleta(timestamp) {
    if (!start) start = timestamp;
    const elapsed = timestamp - start;
    // Ease out
    const t = Math.min(elapsed / duracion, 1);
    const ease = 1 - Math.pow(1 - t, 3);
    const anguloActual = ease * anguloFinal;
    dibujarRuleta(canvas, premios, anguloActual);
    if (t < 1) {
      requestAnimationFrame(animateRuleta);
    } else {
      dibujarRuleta(canvas, premios, anguloFinal);
      callback();
    }
  }
  requestAnimationFrame(animateRuleta);
}

// Contador regresivo hasta el jueves para viernes a las 00:00
function getProximoViernes() {
  const ahora = new Date();
  let dia = ahora.getDay();
  let diasParaViernes = (5 - dia + 7) % 7;
  if (diasParaViernes === 0 && ahora.getHours() >= 0) diasParaViernes = 7;
  const proximoViernes = new Date(ahora);
  proximoViernes.setDate(ahora.getDate() + diasParaViernes);
  proximoViernes.setHours(0, 0, 0, 0);
  return proximoViernes;
}

function iniciarContador(id, fechaObjetivo) {
  function actualizar() {
    const ahora = new Date();
    let diff = fechaObjetivo - ahora;
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
  dibujarRuleta(document.getElementById('ruleta'), premios);
  document.getElementById('tiradas').textContent = `Tiradas restantes: ${TOTAL_TIRADAS}`;
  document.getElementById('girar').onclick = () => girarRuleta();

  // Contador hasta el jueves para viernes a las 00:00
  const fechaEvento = getProximoViernes();
  iniciarContador('contador', fechaEvento);
};