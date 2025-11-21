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

function getPreferencias(user_id, connection, cb) {
    const sql = "SELECT preferencias_accesibilidad FROM usuarios WHERE id_usuario = ?";
    const params = [user_id];

    connection.query(sql, params, (error, results) => {
        if (error) return cb(error);
        if (results.length === 0) return cb(null, null);
        let result_preferencias;
        try {
            result_preferencias = JSON.parse(results[0].preferencias_accesibilidad);
        } catch (e) {
            result_preferencias = null;
        }
        return cb(null, result_preferencias);
    });
}

function setPreferencias(user_id, preferencias, connection, cb){
    const sql = `UPDATE usuarios SET preferencias_accesibilidad = ? WHERE id_usuario = ?`;
    const params = [preferencias, user_id];

    connection.query(sql, params, (err, result) => {
        if (err)
            return cb(err);
        return cb(null,result)
    })
}

module.exports = {
    read: read,
    create: create,
    getPreferencias: getPreferencias,
    setPreferencias: setPreferencias,
};
