const http = require('http');
const routes = require('./routes');

const server = http.createServer(routes.handleRequest);

server.listen(3000, function (err) {
    if (err) console.log('Error al iniciar el servidor');
    else console.log('Servidor escuchando en el puerto 3000');
});
