function create(user, connection, cb) {
    const sql = `INSERT INTO usuarios (nombre, correo, contrasena, rol, telefono, id_concesionario, preferencias_accesibilidad) 
                   VALUES (?, ?, ?, ?, ?, ?, ?)`;

    const params = [user.nombre, user.correo, user.contrasena, user.rol, user.telefono, user.id_concesionario, user.preferencias_accesibilidad];

    connection.query(sql, params, (err, result) => cb(err, result.insertId));
}

function read(user, connection, cb) {
    const filtros = Object.keys(user);
    const where = filtros.length > 0 ? "WHERE " + filtros.map((k) => `${k} = ?`).join("AND") : "";
    const sql = `SELECT * FROM usuarios ${where}`;
    const params = filtros.map((k) => user[k]);

    connection.query(sql, params, (err, rows, fields) => {
        return cb(err, rows, fields);
    });
}

module.exports = {
    read: read,
    create: create,
};
