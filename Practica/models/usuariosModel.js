const pool = require("../db/dbPool");

function createUsuario(user, connection, cb) {
    const sql = `INSERT INTO usuarios (nombre, correo, contrasena, rol, telefono, id_concesionario, preferencias_accesibilidad) 
                   VALUES (?, ?, ?, ?, ?, ?, ?)`;

    const params = [user.nombre, user.correo, user.contrasena, user.rol, user.telefono, user.id_concesionario, user.preferencias_accesibilidad];

    connection.query(sql, params, (err, result) => {
        return cb(err, result.insertId);
    });
}

// encuentra un usuario o lista de usuarios basado en los atributos que se pasen por el objeto
function readUsuario(user, connection, cb) {
    // Obtenemos los atributos del objeto
    const filtros = Object.keys(user);

    // Creamos la clausula where
    const where = filtros.map((k) => `${k} = ?`).join("AND");

    // Unimos toda la query
    const sql = `SELECT * FROM usuarios WHERE ${where}`;

    // Creamos el array de valores marcadores
    const params = filtros.map((k) => user[k]);

    connection.query(sql, params, (err, rows) => {
        return cb(err, rows);
    });
}

module.exports = {
    readUsuario: readUsuario,
    createUsuario: createUsuario,
};
