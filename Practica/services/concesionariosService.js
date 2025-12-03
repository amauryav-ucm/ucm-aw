const dbPool = require("../db/dbPool");
const concesionariosModel = require("../models/concesionariosModel");

function crearManejadorError(connection, cb) {
    return (err) => {
        console.log(err);
        connection.rollback(() => connection.release());
        cb(new Error("Ha ocurrido un error, intentalo de nuevo más tarde"));
    };
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

function obtenerUbicacionConcesionarios(callback) {
  concesionariosModel.obtenerCoordenadasConcesionarios(pool, function (err, dealers) {
    if (err) {
      console.error('Error al obtener las coordenadas del usuario:', err);
      return callback(err);
    }
    callback(null, dealers);
  });
}


module.exports = {
    read: read,
    obtenerUbicacionConcesionarios: obtenerUbicacionConcesionarios
};
