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
    } else {
        response.statusCode = 404;
    }
}

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
    console.log(query);
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

module.exports = { handleRequest: handleRequest };
