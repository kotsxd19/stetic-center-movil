const logoImg = document.getElementById('logoImg');
const logoText = document.getElementById('logoText');

logoImg.onload = function () {
    logoImg.style.display = 'block';
    logoText.style.display = 'none';
};

logoImg.onerror = function () {
    logoImg.style.display = 'none';
    logoText.style.display = 'block';
};

logoImg.src = 'public/img/logo.png';

const progress = document.getElementById('progress');

let loadProgress = 0;
const loadInterval = setInterval(() => {
    loadProgress += Math.random() * 30;

    if (loadProgress >= 100) {
        loadProgress = 100;
        progress.textContent = '¡Listo!';

        setTimeout(() => {
            window.location.href = 'bienvenida.html';
        }, 500);

        clearInterval(loadInterval);
    } else {
        progress.textContent = `Cargando... ${Math.floor(loadProgress)}%`;
    }
}, 200);

setTimeout(() => {
    progress.textContent = '¡Listo!';
    setTimeout(() => {
        window.location.href = 'bienvenida.html';
    }, 500);
    clearInterval(loadInterval);
}, 3000);