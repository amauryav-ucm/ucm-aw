const dbPool = require("../db/dbPool");
const concesionariosModel = require("../models/concesionariosModel");

function crearManejadorError(connection, cb) {
    return (err) => {
        console.log(err);
        connection.rollback(() => connection.release());
        cb(new Error("Ha ocurrido un error, intentalo de nuevo más tarde"));
    };
}

function create(concesionario, cb) {
    dbPool.getConnection((err, connection) => {
        if (err) {
            console.log(err);
            return cb(new Error("Ha ocurrido un error, intentalo de nuevo más tarde"));
        }
        const manejarError = crearManejadorError(connection, cb);
        connection.beginTransaction((err) => {
            if (err) return manejarError(err);
            concesionariosModel.create(concesionario, connection, (err, id) => {
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

function read(concesionario, cb) {
    dbPool.getConnection((err, connection) => {
        if (err) {
            console.log(err);
            return cb(new Error("Ha ocurrido un error, intentalo de nuevo más tarde"));
        }
        const manejarError = crearManejadorError(connection, cb);
        connection.beginTransaction((err) => {
            if (err) return manejarError(err);

            concesionariosModel.read(concesionario, connection, (err, rows, fields) => {
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

function update(concesionario, cb) {
    dbPool.getConnection((err, connection) => {
        if (err) {
            console.log(err);
            return cb(new Error("Ha ocurrido un error, intentalo de nuevo más tarde"));
        }
        const manejarError = crearManejadorError(connection, cb);
        connection.beginTransaction((err) => {
            if (err) return manejarError(err);
            concesionariosModel.read({ id_concesionario: concesionario.id_concesionario }, connection, (err, rows) => {
                if (err) return manejarError(err);
                if (rows.length === 0) {
                    return connection.rollback(() => {
                        connection.release();
                        cb(new Error("No se ha encontrado el concesionario"));
                    });
                }
                let oldConcesionario = rows[0];
                let changes = {};
                Object.keys(concesionario).forEach((k) => {
                    if (concesionario[k] !== oldConcesionario[k]) changes[k] = concesionario[k];
                });
                changes.id_concesionario = concesionario.id_concesionario;
                concesionariosModel.update(changes, connection, (err, result) => {
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

            concesionariosModel.remove(vehiculo, connection, (err, result) => {
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

module.exports = {
    create: create,
    read: read,
    update: update,
    remove: remove,
};
