const dbPool = require("../db/dbPool");
const usuariosModel = require("../models/usuariosModel");

function crearManejadorError(connection, cb) {
    return (err) => {
        console.log(err);
        connection.rollback(() => connection.release());
        cb(new Error("Ha ocurrido un error, intentalo de nuevo más tarde"));
    };
}

function nuevoUsuario(user, cb) {
    dbPool.getConnection((err, connection) => {
        if (err) {
            console.log(err);
            return cb(new Error("Ha ocurrido un error, intentalo de nuevo más tarde"));
        }
        const manejarError = crearManejadorError(connection, cb);
        connection.beginTransaction((err) => {
            if (err) return manejarError(err);

            usuariosModel.readUsuario({ correo: user.correo }, connection, (err, rows) => {
                if (err) return manejarError(err);
                if (rows.length > 0) {
                    return connection.rollback(() => {
                        connection.release();
                        cb(new Error("Ya existe una cuenta con el correo electrónico introducido"));
                    });
                }
                usuariosModel.createUsuario(user, connection, (err, id) => {
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

function buscarUsuario(user, cb) {
    dbPool.getConnection((err, connection) => {
        if (err) {
            console.log(err);
            return cb(new Error("Ha ocurrido un error, intentalo de nuevo más tarde"));
        }
        const manejarError = crearManejadorError(connection, cb);
        connection.beginTransaction((err) => {
            if (err) return manejarError(err);

            usuariosModel.readUsuario(user, connection, (err, rows) => {
                if (err) return manejarError(err);

                connection.commit((err) => {
                    if (err) return manejarError(err);
                    connection.release();
                    return cb(null, rows);
                });
            });
        });
    });
}

module.exports = {
    nuevoUsuario: nuevoUsuario,
    buscarUsuario: buscarUsuario,
};
