const dbPool = require("../db/dbPool");
const usuariosModel = require("../models/usuariosModel");

function crearManejadorError(connection, cb) {
    return (err) => {
        console.log(err);
        connection.rollback(() => connection.release());
        cb(new Error("Ha ocurrido un error, intentalo de nuevo más tarde"));
    };
}

function create(usuario, cb) {
    dbPool.getConnection((err, connection) => {
        if (err) {
            console.log(err);
            return cb(new Error("Ha ocurrido un error, intentalo de nuevo más tarde"));
        }
        const manejarError = crearManejadorError(connection, cb);
        connection.beginTransaction((err) => {
            if (err) return manejarError(err);

            usuariosModel.read({ correo: usuario.correo }, connection, (err, rows) => {
                if (err) return manejarError(err);
                if (rows.length > 0 && parseInt(rows[0].activo) === 0) {
                    return connection.rollback(() => {
                        connection.release();
                        cb(new Error("Ya existe una cuenta con el correo electrónico introducido"));
                    });
                }
                usuariosModel.remove({ id_usuario: rows.length > 0 ? rows[0].id_usuario : -1, activo: false }, connection, (err, result) => {
                    if (err) return manejarError(err);
                    usuariosModel.create(usuario, connection, (err, id) => {
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
    });
}

function read(usuario, cb) {
    dbPool.getConnection((err, connection) => {
        if (err) {
            console.log(err);
            return cb(new Error("Ha ocurrido un error, intentalo de nuevo más tarde"));
        }
        const manejarError = crearManejadorError(connection, cb);
        connection.beginTransaction((err) => {
            if (err) return manejarError(err);

            usuariosModel.read(usuario, connection, (err, rows, fields) => {
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

function setPreferencias(id_usuario, preferencias, cb) {
    const preferenciasJSON = JSON.stringify(preferencias);

    dbPool.getConnection((error, connection) => {
        if (error) return cb(error);
        usuariosModel.setPreferencias(id_usuario, preferenciasJSON, connection, (error, result) => {
            connection.release();
            return cb(error, result);
        });
    });
}

function getPreferencias(id_usuario, cb) {
    dbPool.getConnection((error, connection) => {
        if (error) return cb(error);
        usuariosModel.getPreferencias(id_usuario, connection, (error, preferencias) => {
            connection.release();
            return cb(error, preferencias);
        });
    });
}

function upsertMany(lista, cb) {
    dbPool.getConnection((err, connection) => {
        if (err) return cb(err);

        const manejarError = crearManejadorError(connection, cb);
        const resultados = []; // acumulamos aqui info

        connection.beginTransaction((err) => {
            if (err) return manejarError(err);

            let i = 0;

            function procesar() {
                if (i >= lista.length) {
                    return connection.commit((err) => {
                        if (err) return manejarError(err);
                        connection.release();
                        cb(null, resultados);
                    });
                }

                const e = lista[i];
                usuariosModel.read({ correo: e.correo, rol: "empleado" }, connection, (err, rows) => {
                    if (err) return manejarError(err);

                    if (rows.length > 0) {
                        // UPDATE
                        e.id_usuario = rows[0].id_usuario;
                        usuariosModel.update(e, connection, (err, updateInfo) => {
                            if (err) return manejarError(err);
                            resultados.push({
                                correo: e.correo,
                                accion: updateInfo.changedRows > 0 ? "actualizado" : "sin_cambios",
                            });

                            i++;
                            procesar();
                        });
                    } else {
                        // INSERT
                        usuariosModel.create(e, connection, (err, insertId) => {
                            if (err) return manejarError(err);

                            resultados.push({
                                correo: e.correo,
                                accion: "insertado",
                                id: insertId,
                            });

                            i++;
                            procesar();
                        });
                    }
                });
            }

            procesar();
        });
    });
}

module.exports = {
    create: create,
    read: read,
    setPreferencias: setPreferencias,
    getPreferencias,
    getPreferencias,
    upsertMany: upsertMany,
};
