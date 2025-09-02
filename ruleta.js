document.addEventListener('DOMContentLoaded', () => {
    // --- Elementos del DOM ---
    const modal = document.getElementById('roulette-modal');
    const openBtn = document.getElementById('open-roulette-btn');
    const closeBtn = document.querySelector('.close-btn');
    const spinBtn = document.getElementById('girar');
    const canvas = document.getElementById('ruleta');
    const resultadoDiv = document.getElementById('resultado');
    const ctx = canvas.getContext('2d');

    // --- Configuración de la Ruleta ---
    const options = ["Combos", "NADA", "QRs", "NADA", "Combos", "NADA"];
    const colors = ["#FF5733", "#E4C304", "#3357FF", "#E4C304", "#9B59B6", "#E4C304"];
    const arc = 2 * Math.PI / options.length;
    let isSpinning = false;

    // --- Funciones ---
    function drawRoulette() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.strokeStyle = "black";
        ctx.lineWidth = 2;
        ctx.font = 'bold 20px Helvetica, Arial';

        for (let i = 0; i < options.length; i++) {
            const angle = i * arc;
            ctx.fillStyle = colors[i];

            ctx.beginPath();
            ctx.arc(175, 175, 175, angle, angle + arc, false);
            ctx.arc(175, 175, 0, angle + arc, angle, true);
            ctx.stroke();
            ctx.fill();

            ctx.save();
            ctx.fillStyle = "black";
            ctx.translate(175 + Math.cos(angle + arc / 2) * 120, 175 + Math.sin(angle + arc / 2) * 120);
            ctx.rotate(angle + arc / 2 + Math.PI / 2);
            const text = options[i];
            ctx.fillText(text, -ctx.measureText(text).width / 2, 0);
            ctx.restore();
        }
    }
    
    function spin() {
        if (isSpinning) return;
        isSpinning = true;
        resultadoDiv.innerHTML = "Girando...";

        // 1. Encontrar los índices de todas las opciones "NADA"
        const nadaIndices = options.map((opt, i) => opt === "NADA" ? i : -1).filter(i => i !== -1);
        
        // 2. Elegir al azar una de las porciones de "NADA" como objetivo
        const targetIndex = nadaIndices[Math.floor(Math.random() * nadaIndices.length)];

        // 3. Calcular el ángulo exacto para detenerse en el medio de esa porción
        const arcDegrees = 360 / options.length;
        const targetAngle = (targetIndex * arcDegrees) + (arcDegrees / 2);
        
        // 4. Añadir varias vueltas completas (5-8) para el efecto de giro
        const randomRotations = Math.floor(Math.random() * 4) + 5;
        const totalRotation = (randomRotations * 360) - targetAngle;

        // 5. Aplicar la rotación con CSS
        canvas.style.transform = `rotate(${totalRotation}deg)`;
        
        // 6. Esperar a que la animación CSS termine para mostrar el resultado
        setTimeout(() => {
            resultadoDiv.innerHTML = `¡Trolleado! Salió: <span style="font-weight:bold; color:${colors[targetIndex]};">NADA</span>`;
            isSpinning = false;
        }, 5000); // IMPORTANTE: Este tiempo debe coincidir con la duración de la transición en CSS
    }

    // --- Event Listeners del Modal ---
    openBtn.onclick = function() {
        modal.style.display = "flex";
    }
    closeBtn.onclick = function() {
        modal.style.display = "none";
    }
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }
    spinBtn.addEventListener('click', spin);
    
    // Dibuja la ruleta al cargar la página
    drawRoulette();
});