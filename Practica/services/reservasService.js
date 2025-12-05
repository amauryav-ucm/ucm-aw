const dbPool = require("../db/dbPool");
const reservasModel = require("../models/reservasModel");
const vehiculosModel = require("../models/vehiculosModel");

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

                vehiculosModel.update({ id_vehiculo: reserva.id_vehiculo, estado: "reservado" }, connection, (err, result) => {
                    if (err) return manejarError(err);

                    connection.commit((err) => {
                        if (err) return manejarError(err);
                        connection.release();
                        return cb(null, id);
                    });
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

function finalizarReserva(id_reserva, cb) {
    dbPool.getConnection((err, connection) => {
        if (err) {
            console.log(err);
            return cb(new Error("Ha ocurrido un error, intentalo de nuevo más tarde"));
        }
        const manejarError = crearManejadorError(connection, cb);
        connection.beginTransaction((err) => {
            if (err) return manejarError(err);

            reservasModel.read({ id_reserva: id_reserva }, connection, (err, rows, fields) => {
                if (err) return manejarError(err);

                const id_vehiculo = rows[0].id_vehiculo;
                reservasModel.update({ id_reserva: id_reserva, estado: "finalizada" }, connection, (err, result) => {
                    if (err) return manejarError(err);

                    vehiculosModel.update({ id_vehiculo: id_vehiculo, estado: "disponible" }, connection, (err, result) => {
                        if (err) return manejarError(err);

                        connection.commit((err) => {
                            if (err) return manejarError(err);
                            connection.release();
                            return cb(null, result);
                        });
                    });
                });
            });
        });
    });
}

module.exports = {
    read: read,
    create: create,
    finalizarReserva: finalizarReserva,
};
