const dbPool = require("../db/dbPool");
const vehiculosModel = require("../models/vehiculosModel");

function crearManejadorError(connection, cb) {
    return (err) => {
        console.log(err);
        connection.rollback(() => connection.release());
        cb(new Error("Ha ocurrido un error, intentalo de nuevo más tarde"));
    };
}

function read(vehiculo, cb) {
    dbPool.getConnection((err, connection) => {
        if (err) {
            console.log(err);
            return cb(new Error("Ha ocurrido un error, intentalo de nuevo más tarde"));
        }
        const manejarError = crearManejadorError(connection, cb);
        connection.beginTransaction((err) => {
            if (err) return manejarError(err);

            vehiculosModel.read(vehiculo, connection, (err, rows, fields) => {
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

function create(vehiculo, cb) {
    dbPool.getConnection((err, connection) => {
        if (err) {
            console.log(err);
            return cb(new Error("Ha ocurrido un error, intentalo de nuevo más tarde"));
        }
        const manejarError = crearManejadorError(connection, cb);
        connection.beginTransaction((err) => {
            if (err) return manejarError(err);

            vehiculosModel.read({ matricula: vehiculo.matricula }, connection, (err, rows) => {
                if (err) return manejarError(err);
                if (rows.length > 0) {
                    return connection.rollback(() => {
                        connection.release();
                        cb(new Error("Ya existe un vehículo con la matrícula introducida"));
                    });
                }
                vehiculosModel.create(vehiculo, connection, (err, id) => {
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

function update(vehiculo, cb) {
    dbPool.getConnection((err, connection) => {
        if (err) {
            console.log(err);
            return cb(new Error("Ha ocurrido un error, intentalo de nuevo más tarde"));
        }
        const manejarError = crearManejadorError(connection, cb);
        connection.beginTransaction((err) => {
            if (err) return manejarError(err);

            vehiculosModel.read({ matricula: vehiculo.matricula }, connection, (err, rows) => {
                if (err) return manejarError(err);
                if (rows.length > 0 && parseInt(rows[0].id_vehiculo) !== parseInt(vehiculo.id_vehiculo)) {
                    return connection.rollback(() => {
                        connection.release();
                        cb(new Error("Ya existe un vehículo con la matrícula introducida"));
                    });
                }
                vehiculosModel.read({ id_vehiculo: vehiculo.id_vehiculo }, connection, (err, rows) => {
                    if (err) return manejarError(err);
                    if (rows.length === 0) {
                        return connection.rollback(() => {
                            connection.release();
                            cb(new Error("No se ha encontrado el vehículo"));
                        });
                    }
                    let oldVehiculo = rows[0];
                    let changes = {};
                    Object.keys(vehiculo).forEach((k) => {
                        if (vehiculo[k] !== oldVehiculo[k]) changes[k] = vehiculo[k];
                    });
                    changes.id_vehiculo = vehiculo.id_vehiculo;
                    vehiculosModel.update(changes, connection, (err, result) => {
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

function remove(vehiculo, cb) {
    dbPool.getConnection((err, connection) => {
        if (err) {
            console.log(err);
            return cb(new Error("Ha ocurrido un error, intentalo de nuevo más tarde"));
        }
        const manejarError = crearManejadorError(connection, cb);
        connection.beginTransaction((err) => {
            if (err) return manejarError(err);

            vehiculosModel.remove(vehiculo, connection, (err, result) => {
                if (err) return manejarError(err);

                connection.commit((err) => {
                    if (err) return manejarError(err);
                    connection.release();
                    return cb(null, result.affectedRows);
                });
            });
        });
    });
}

function upsertMany(lista, cb) {
    dbPool.getConnection((err, connection) => {
        if (err) return cb(err);

        const manejarError = crearManejadorError(connection, cb);
        const resultados = [];  // acumulamos aqui info

        connection.beginTransaction(err => {
            if (err) return manejarError(err);

            let i = 0;

            function procesar() {
                if (i >= lista.length) {
                    return connection.commit(err => {
                        if (err) return manejarError(err);
                        connection.release();
                        cb(null, resultados);
                    });
                }

                const v = lista[i];
                vehiculosModel.read({ matricula: v.matricula }, connection, (err, rows) => {
                    if (err) return manejarError(err);

                    if (rows.length > 0) {
                        // UPDATE
                        v.id_vehiculo = rows[0].id_vehiculo;
                        vehiculosModel.update(v, connection, (err, updateInfo) => {
                            if (err) return manejarError(err);
                            resultados.push({
                                matricula: v.matricula,
                                accion: updateInfo.changedRows > 0 ? "actualizado" : "sin_cambios"
                            });

                            i++;
                            procesar();
                        });
                    } else {
                        // INSERT
                        vehiculosModel.create(v, connection, (err, insertId) => {
                            if (err) return manejarError(err);

                            resultados.push({
                                matricula: v.matricula,
                                accion: "insertado",
                                id: insertId
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
    read: read,
    create: create,
    update: update,
    remove: remove,
    upsertMany: upsertMany
};
