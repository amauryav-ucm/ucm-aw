const fs = require('fs');
const { resolve } = require('path');
const url = require('url');

function handleRequest(request, response) {
    const method = request.method;
    const parsedUrl = url.parse(request.url, true);
    const pathname = parsedUrl.pathname;
    const query = parsedUrl.query;
    if (method === 'GET' && pathname === '/') {
        response.statusCode = 200;
        devolverInicio(response);
    } else if (method === 'GET' && pathname === '/vehiculos') {
        response.statusCode = 200;
        devolverVehiculos(query, response);
    } else if (method === 'GET' && pathname === '/imagen') {
        fs.readFile('./public/ev1.jpg', (err, data) => {
            response.statusCode = 200;
            response.setHeader('ContentType', 'image/jpg');
            response.end(data);
        });
    } else if (method === 'GET' && pathname === '/reserva') {
        response.statusCode = 200;
        devolverReserva(response);
    } else if (method === 'GET' && pathname === '/listareservas') {
        response.statusCode = 200;
        devolverListaReservas(response);
    } else if (method === 'POST') {
        let body = '';

        // Collect data chunks
        request.on('data', (chunk) => {
            body += chunk.toString();
        });

        // Once all data is received
        request.on('end', () => {
            try {
                const data = JSON.parse(body); // parse JSON
                reservas.push(data);

                response.writeHead(200, { 'Content-Type': 'application/json' });
                response.end(
                    JSON.stringify({ message: 'Datos:', received: data })
                );
            } catch (err) {
                console.log(err);
                response.writeHead(400, { 'Content-Type': 'text/plain' });
                response.end('Invalid JSON');
            }
        });
    } else {
        response.statusCode = 404;
    }
}

let reservas = [];

const vehiculos = [
    { marca: 'Tesla', modelo: 'Model 3', anyo: 2023 },
    { marca: 'Tesla', modelo: 'Model Y', anyo: 2024 },
    { marca: 'Tesla', modelo: 'Model S', anyo: 2022 },
    { marca: 'Tesla', modelo: 'Model X', anyo: 2023 },
    { marca: 'Nissan', modelo: 'Leaf', anyo: 2022 },
    { marca: 'Nissan', modelo: 'Ariya', anyo: 2023 },
    { marca: 'Nissan', modelo: 'e-NV200', anyo: 2024 },
    { marca: 'Nissan', modelo: 'Note e-Power', anyo: 2022 },
    { marca: 'BMW', modelo: 'i3', anyo: 2023 },
    { marca: 'BMW', modelo: 'i4', anyo: 2024 },
    { marca: 'BMW', modelo: 'iX', anyo: 2022 },
    { marca: 'BMW', modelo: 'iX3', anyo: 2023 },
    { marca: 'Hyundai', modelo: 'Kona Electric', anyo: 2022 },
    { marca: 'Hyundai', modelo: 'Ioniq 5', anyo: 2023 },
    { marca: 'Hyundai', modelo: 'Ioniq 6', anyo: 2024 },
    { marca: 'Hyundai', modelo: 'Bayon EV', anyo: 2022 },
];

function writeHTML(response, writeBody) {
    response.write(`<!DOCTYPE html>
        <html lang="es" data-bs-theme="dark">
            <head>
                <meta charset="UTF-8" />
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1.0"
                />
                <title>Gestión de Flota de Vehículos Eléctricos</title>
                <link
                    href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css"
                    rel="stylesheet"
                    integrity="sha384-sRIl4kxILFvY47J16cr9ZwB07vP4J8+LH7qKQnuqkuIAvNWLzeN8tE5YBujZqJLB"
                    crossorigin="anonymous"
                />
            </head>

            <body>`);
    writeBody(response);
    response.write(`</body>
        </html>`);
    response.end();
}

function devolverInicio(response) {
    response.setHeader('ContentType', 'text/html');
    writeHTML(response, (response) => {
        response.write(
            ` <main>
            <div class="container text-center mt-5">
                <h1>Bienvenido al sistema de gestión de reservas</h1>
            </div>
        </main>`
        );
    });
}

function devolverVehiculos(query, response) {
    let result = vehiculos;
    if (query.marca) {
        result = result.filter(
            (v) => v.marca.toLowerCase() === query.marca.toLowerCase()
        );
    }
    if (query.modelo) {
        result = result.filter(
            (v) => v.modelo.toLowerCase() === query.modelo.toLowerCase()
        );
    }
    if (query.anyo) {
        result = result.filter((v) => v.anyo === parseInt(query.anyo));
    }
    response.setHeader('ContentType', 'text/html');
    writeHTML(response, (response) => {
        response.write('<main><div class="container mt-5">');
        if (result.length !== 0) {
            response.write('<ul>');
            result.forEach((v) => {
                response.write(`<li>${v.marca} ${v.modelo} ${v.anyo}</li>`);
            });
            response.write('</ul>');
        } else response.write('<p>No se han encontrado vehiculos</p>');
        response.write('</div></main>');
    });
}

function devolverReserva(response) {
    response.setHeader('ContentType', 'text/html');
    writeHTML(response, (response) => {
        response.write(`<main class="container mt-5">
            <form
                id="formulario-reserva"
                aria-label="Formulario de reserva de vehículos"
            >
                    <div class="mb-3">
                        <label for="campo-nombre" class="form-label"
                            >Nombre</label
                        >
                        <input
                            type="text"
                            id="campo-nombre"
                            class="form-control"
                            required
                        />
                        <span class="invalid-feedback"
                            >El nombre debe tener como mínimo 3 caracteres
                        </span>
                    </div>
                    <div class="mb-3">
                        <label for="campo-vehiculo" class="form-label"
                            >Vehículo</label
                        >
                        <select
                            id="campo-vehiculo"
                            required
                            class="form-select"
                        >
                            <option value="0" selected>
                                Selecciona un vehículo
                            </option>`);
        for (let i = 0; i < vehiculos.length; i++) {
            response.write(
                `<option value="${i + 1}">${vehiculos[i].marca} ${
                    vehiculos[i].modelo
                } ${vehiculos[i].anyo}</option>`
            );
        }
        response.write(`</select
                        ><span class="invalid-feedback"
                            >Debe seleccionar un vehículo</span
                        >
                    </div>
                    <div class="mb-3">
                        <label for="campo-fecha-inicio" class="form-label"
                            >Fecha</label
                        >
                        <input
                            type="date"
                            id="campo-fecha-inicio"
                            required
                            class="form-control"
                        /><span class="invalid-feedback"
                            >La fecha de inicio no puede ser anterior a la fecha
                            actual</span
                        >
                    </div>
                    

               
                    <div class="mb-3">
                       
                        <div>
                            <button
                                id="submit-button"
                                class="btn btn-primary"
                                type="submit"
                                aria-label="Botón para enviar datos del formulario"
                            >
                                Enviar
                            </button>
                            <button
                                class="btn btn-secondary"
                                type="reset"
                                aria-label="Botón para limpiar datos del formulario"
                            >
                                Limpiar Fromulario
                            </button>
                        </div>
                    </div>
            </form>
        </main>
       <script>
            document
                .getElementById('submit-button')
                .addEventListener('click', (e) => {
                    console.log('hola')
                    let vehiculo = document.getElementById('campo-vehiculo').value
                    if(vehiculo === '0'){
                    e.preventDefault();
                    }
                    else{
                    let datos = {
                        nombre: document.getElementById('campo-nombre').value,                       
                        vehiculo: vehiculo,
                        fechaInicio: document.getElementById('campo-fecha-inicio').value,
                    };
                    console.log(datos)
                    fetch('/reserva', {
  method: 'POST',
  body: JSON.stringify(datos)
});}
                });
        </script>
    </body>`);
    });
}

function devolverListaReservas(response) {
    response.setHeader('ContentType', 'text/html');
    writeHTML(response, (response) => {
        response.write('<main><div class="container mt-5">');
        if (reservas.length !== 0) {
            response.write('<ul>');
            reservas.forEach((r) => {
                i = r.vehiculo - 1;
                response.write(
                    `<li>${r.nombre} ${vehiculos[i].marca} ${vehiculos[i].modelo} ${vehiculos[i]} ${r.fechaInicio}</li>`
                );
            });
            response.write('</ul>');
        } else response.write('<p>No se han encontrado reservas</p>');
        response.write('</div></main>');
    });
}

module.exports = { handleRequest: handleRequest };
