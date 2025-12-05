const dbPool = require("../db/dbPool");
const reservasModel = require("../models/reservasModel");

function crearManejadorError(connection, cb) {
    return (err) => {
        console.log(err);
        connection.rollback(() => connection.release());
        cb(new Error("Ha ocurrido un error, intentalo de nuevo más tarde"));
    };
}

function create(reserva, cb) {
    dbPool.getConnection((err, connection) => {
        if (err) {
            console.log(err);
            return cb(new Error("Ha ocurrido un error, intentalo de nuevo más tarde"));
        }
        const manejarError = crearManejadorError(connection, cb);
        connection.beginTransaction((err) => {
            if (err) return manejarError(err);

            // Hacer logica de negocio

            reservasModel.create(reserva, connection, (err, id) => {
                if (err) return manejarError(err);

                connection.commit((err) => {
                    if (err) return manejarError(err);
                    connection.release();
                    return cb(null, id);
                });
            });
        });
    });
}

function read(reserva, cb) {
    dbPool.getConnection((err, connection) => {
        if (err) {
            console.log(err);
            return cb(new Error("Ha ocurrido un error, intentalo de nuevo más tarde"));
        }
        const manejarError = crearManejadorError(connection, cb);
        connection.beginTransaction((err) => {
            if (err) return manejarError(err);

            reservasModel.read(reserva, connection, (err, rows, fields) => {
                if (err) return manejarError(err);

                connection.commit((err) => {
                    if (err) return manejarError(err);
                    connection.release();
                    return cb(null, rows, fields);
                });
            });
        });
    });
}

function readComentariosYValoraciones(cb) {
    read({}, (err, rows) => { 
        if (err) return cb(err);
        let resultado = [];
        let clientes = new Map();
        rows.forEach(row => {
            const id = row.id_cliente;
            const valoracion = row.valoracion;

            if (id !== null && valoracion !==null && (!clientes.has(id) || clientes.get(id).valoracion < valoracion)) {
                clientes.set(id, {
                    id: id,
                    valoracion: valoracion,
                    comentarios: row.comentarios
                });
            }
        });
        resultado = Object.fromEntries(clientes)
        console.log("RESULTADOOO", resultado)
        return cb(null, resultado);
    });
}

module.exports = {
    read: read,
    create: create,
    readComentariosYValoraciones: readComentariosYValoraciones
};
