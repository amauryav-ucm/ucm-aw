function create(concesionario, connection, cb) {
    const sql = `INSERT INTO concesionarios (nombre, ciudad, direccion, telefono_contacto) 
    VALUES (?, ?, ?, ?)`;
    const params = [concesionario.nombre, concesionario.ciudad, concesionario.direccion, concesionario.telefono_contacto];
    connection.query(sql, params, (err, result) => cb(err, result));
}

function read(concesionario, connection, cb) {
    const filtros = Object.keys(concesionario);
    const where = filtros.length > 0 ? "WHERE " + filtros.map((k) => `${k} = ?`).join(" AND ") : "";
    const sql = `SELECT * FROM concesionarios ${where}`;
    const params = filtros.map((k) => concesionario[k]);
    connection.query(sql, params, (err, rows, fields) => {
        return cb(err, rows, fields);
    });
}

function update(concesionario, connection, cb) {
    const changes = Object.keys(concesionario).filter((k) => k !== "id_concesionario");
    if (changes.length <= 0) return;
    const sql = "UPDATE concesionarios SET " + changes.map((k) => `${k} = ?`).join(", ") + ` WHERE id_concesionario = ${concesionario.id_concesionario}`;
    const params = changes.map((k) => concesionario[k]);
    connection.query(sql, params, (err, result) => cb(err, result));
}

function remove(concesionario, connection, cb) {
    const filtros = Object.keys(concesionario);
    if (filtros.length === 0) {
        return cb(new Error("Se requiere al menos un filtro"));
    }
    const where = "WHERE " + filtros.map((k) => `${k} = ?`).join(" AND ");
    const sql = `DELETE FROM concesionarios ${where}`;
    const params = filtros.map((k) => concesionario[k]);
    connection.query(sql, params, (err, result) => cb(err, result));
}

module.exports = {
    create: create,
    read: read,
    update: update,
    remove: remove,
};
