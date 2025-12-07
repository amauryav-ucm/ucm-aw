function create(user, connection, cb) {
    const sql = `
        INSERT INTO usuarios
          (nombre, correo, contrasena, rol, telefono, id_concesionario, preferencias_accesibilidad)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    const params = [
        user.nombre,
        user.correo,
        user.contrasena,
        user.rol,
        user.telefono,
        user.id_concesionario,
        JSON.stringify(user.preferencias_accesibilidad || null),
    ];

    connection.query(sql, params, (err, result) => {
        if (err) return cb(err); // <--- evita crash si falla la query
        cb(null, result.insertId); // <--- seguro
    });
}

function read(user, connection, cb) {
    const filtros = Object.keys(user);
    const where = filtros.length > 0 ? "WHERE " + filtros.map((k) => `${k} = ?`).join(" AND ") : "";
    const sql = `SELECT * FROM usuarios ${where}`;
    const params = filtros.map((k) => user[k]);

    connection.query(sql, params, (err, rows, fields) => {
        return cb(err, rows, fields);
    });
}

function update(user, connection, cb) {
    const changes = Object.keys(user).filter((k) => k !== "id_usuario");
    if (changes.length <= 0) return cb(null, { affectedRows: 0 });

    const sql = "UPDATE usuarios SET " + changes.map((k) => `${k} = ?`).join(", ") + " WHERE id_usuario = ?";
    const params = changes.map((k) => {
        const val = user[k];
        // si es objeto o array, convertir a JSON
        return typeof val === "object" && val !== null ? JSON.stringify(val) : val;
    });
    params.push(user.id_usuario);

    connection.query(sql, params, (err, result) => cb(err, result));
}

function remove(usuario, connection, cb) {
    const filtros = Object.keys(usuario);
    if (filtros.length === 0) {
        return cb(new Error("Se requiere al menos un filtro"));
    }
    const where = "WHERE " + filtros.map((k) => `${k} = ?`).join(" AND ");
    const sql = `DELETE FROM usuarios ${where}`;
    const params = filtros.map((k) => usuario[k]);
    connection.query(sql, params, (err, result) => cb(err, result));
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

function setPreferencias(user_id, preferencias, connection, cb) {
    const sql = `UPDATE usuarios SET preferencias_accesibilidad = ? WHERE id_usuario = ?`;
    const params = [preferencias, user_id];

    connection.query(sql, params, (err, result) => {
        if (err) return cb(err);
        return cb(null, result);
    });
}

module.exports = {
    read: read,
    create: create,
    getPreferencias: getPreferencias,
    setPreferencias: setPreferencias,
    update: update,
    remove: remove,
};
