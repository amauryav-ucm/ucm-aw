const filtroAutonomia = document.getElementById('filtroAutonomia');
const filtroAutonomiaValor = document.getElementById('filtroAutonomiaValor');
const filtroVehiculosColorAll = document.getElementById(
    'filtroVehiculosColor-all'
);
const filtroVehiculosColorOptions = document.querySelectorAll(
    '.filtroVehiculosColor-option'
);
const filtroVehiculosNumeroPlazasAll = document.getElementById(
    'filtroVehiculosNumeroPlazas-all'
);
const filtroVehiculosNumeroPlazasOptions = document.querySelectorAll(
    '.filtroVehiculosNumeroPlazas-option'
);
const filtroVehiculosReset = document.getElementById('filtroVehiculosReset');

// Set initial value
filtroAutonomiaValor.textContent = filtroAutonomia.value;

filtroAutonomia.addEventListener('input', function () {
    filtroAutonomiaValor.textContent = this.value;
});

filtroVehiculosColorAll.addEventListener('change', (e) => {
    if (e.target.checked) {
        filtroVehiculosColorOptions.forEach((cb) => {
            cb.checked = false;
        });
    }
});

filtroVehiculosColorOptions.forEach((cb) => {
    cb.addEventListener('change', (e) => {
        if (e.target.checked) filtroVehiculosColorAll.checked = false;
    });
});

filtroVehiculosNumeroPlazasAll.addEventListener('change', (e) => {
    if (e.target.checked)
        filtroVehiculosNumeroPlazasOptions.forEach((cb) => {
            cb.checked = false;
        });
});

filtroVehiculosNumeroPlazasOptions.forEach((cb) => {
    cb.addEventListener('change', (e) => {
        if (e.target.checked) filtroVehiculosNumeroPlazasAll.checked = false;
    });
});

filtroVehiculosReset.addEventListener('click', (e) => {
    e.preventDefault();
    filtroVehiculosColorOptions.forEach((cb) => {
        cb.checked = false;
    });
    filtroVehiculosColorAll.checked = true;
    filtroVehiculosNumeroPlazasOptions.forEach((cb) => {
        cb.checked = false;
    });
    filtroVehiculosNumeroPlazasAll.checked = true;
    filtroAutonomiaValor.textContent = filtroAutonomia.value = 0;
});
