const video = document.getElementById('video-background');
const unmuteBtn = document.getElementById('unmute-btn');
const userAgent = navigator.userAgent;

if (/iPhone|iPad|iPod/i.test(userAgent)) {
    video.style.objectFit = "cover";
    document.body.classList.add('ios');
} else if (/Android/i.test(userAgent)) {
    video.style.objectFit = "cover";
    document.body.classList.add('android');
} else {
    video.style.objectFit = "fill";
}

unmuteBtn.addEventListener('click', () => {
    video.muted = false;
    video.play();
    unmuteBtn.style.display = 'none';
});

function getNextSaturdayMidnight() {
    const now = new Date();
    const target = new Date(now);
    let currentDay = now.getDay(); // Domingo = 0, Sábado = 6
    
    // Calcula los días que faltan para el próximo sábado
    let daysToAdd = (6 - currentDay + 7) % 7;
    if (daysToAdd === 0) { // Si hoy es sábado, apunta al siguiente
        daysToAdd = 7;
    }
    
    target.setDate(now.getDate() + daysToAdd);
    target.setHours(0, 0, 0, 0);
    return target;
}

const countdownDisplay = document.getElementById('countdown');

function updateCountdown() {
    const now = new Date();
    const targetDate = getNextSaturdayMidnight();
    const timeRemaining = targetDate.getTime() - now.getTime();

    if (timeRemaining <= 0) {
        countdownDisplay.textContent = "Hora de hacer lo de nosotro";
        clearInterval(countdownInterval);
        return;
    }

    const totalSeconds = Math.floor(timeRemaining / 1000);
    
    // --- CAMBIO PRINCIPAL AQUÍ ---
    // Calculamos el total de horas directamente, sin mostrar días.
    const totalHours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    const formatTime = (num) => String(num).padStart(2, '0');
    
    // Mostramos siempre el formato: HH:MM:SS
    countdownDisplay.textContent = `${formatTime(totalHours)}:${formatTime(minutes)}:${formatTime(seconds)}`;
}

updateCountdown();
const countdownInterval = setInterval(updateCountdown, 1000);