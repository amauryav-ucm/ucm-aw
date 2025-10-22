const coches = [
    { matricula: '1234 ABC', marca: 'Tesla', autonomia: '500 km' },
    { matricula: '5678 DEF', marca: 'Nissan', autonomia: '400 km' },
    { matricula: '9101 GHI', marca: 'Chevrolet', autonomia: '380 km' },
    { matricula: '1121 JKL', marca: 'BMW', autonomia: '420 km' },
    { matricula: '3141 MNO', marca: 'Hyundai', autonomia: '450 km' },
    { matricula: '5161 PQR', marca: 'Kia', autonomia: '430 km' },
    { matricula: '7181 STU', marca: 'Audi', autonomia: '470 km' },
    { matricula: '9202 VWX', marca: 'Mercedes', autonomia: '460 km' },
    { matricula: '1222 YZA', marca: 'Porsche', autonomia: '480 km' },
    { matricula: '3242 BCD', marca: 'Volkswagen', autonomia: '400 km' },
];

const tbody = document.getElementById('tabla-coches-body');
const formSelect = document.getElementById('campo-vehiculo');

coches.forEach((coche) => {
    const tr = document.createElement('tr');
    const option = document.createElement('option');

    tr.innerHTML = `
    <td>${coche.matricula}</td>
    <td>${coche.marca}</td>
    <td>${coche.autonomia}</td>
  `;

    option.setAttribute('value', coche.matricula);
    option.innerHTML = `${coche.matricula} - ${coche.marca}`;

    tbody.appendChild(tr);
    formSelect.appendChild(option);
});

document.addEventListener('keydown', (e) => {
    if (e.altKey)
        switch (e.key.toLowerCase()) {
            case 'r':
                document.location.href = '#reservas';
                break;
            case 'v':
                document.location.href = '#vehiculos';
            default:
                break;
        }
});
