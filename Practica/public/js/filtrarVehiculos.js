const filtroAutonomia = document.getElementById('filtroAutonomia');
const filtroAutonomiaValor = document.getElementById('filtroAutonomiaValor');

// Set initial value
filtroAutonomiaValor.textContent = filtroAutonomia.value;

filtroAutonomia.addEventListener('input', function () {
    filtroAutonomiaValor.textContent = this.value;
});

const filtroVehiculosColorAll = document.getElementById(
    'filtroVehiculosColor-all'
);
const filtroVehiculosColorOptions = document.querySelectorAll(
    '.filtroVehiculosColor-option'
);

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

const filtroVehiculosNumeroPlazasAll = document.getElementById(
    'filtroVehiculosNumeroPlazas-all'
);
const filtroVehiculosNumeroPlazasOptions = document.querySelectorAll(
    '.filtroVehiculosNumeroPlazas-option'
);

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
