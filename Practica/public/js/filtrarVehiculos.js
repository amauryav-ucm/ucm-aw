const filtroAutonomia = document.getElementById('filtroAutonomia');
const filtroAutonomiaValor = document.getElementById('filtroAutonomiaValor');

// Set initial value
filtroAutonomiaValor.textContent = filtroAutonomia.value;

filtroAutonomia.addEventListener('input', function () {
    filtroAutonomiaValor.textContent = this.value;
});
