function create(vehiculo, connection, cb) {
    const sql = `INSERT INTO vehiculos (matricula, marca, modelo, anyo_matriculacion, numero_plazas, autonomia_km, color, imagen, estado, id_concesionario) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    const params = [
        vehiculo.matricula,
        vehiculo.marca,
        vehiculo.modelo,
        vehiculo.anyo_matriculacion,
        vehiculo.numero_plazas,
        vehiculo.autonomia_km,
        vehiculo.color,
        vehiculo.imagen,
        vehiculo.estado,
        vehiculo.id_concesionario,
    ];
    connection.query(sql, params, (err, result) => cb(err, result));
}

function read(vehiculo, connection, cb) {
    const filtros = Object.keys(vehiculo);
    const where = filtros.length > 0 ? "WHERE " + filtros.map((k) => `${k} = ?`).join(" AND ") : "";
    const sql = `SELECT * FROM vehiculos ${where}`;
    const params = filtros.map((k) => vehiculo[k]);
    connection.query(sql, params, (err, rows, fields) => cb(err, rows, fields));
}

function update(vehiculo, connection, cb) {
    const changes = Object.keys(vehiculo).filter((k) => k !== "id_vehiculo");
    if (changes.length <= 0) return;
    const sql = "UPDATE vehiculos SET " + changes.map((k) => `${k} = ?`).join(", ") + ` WHERE id_vehiculo = ${vehiculo.id_vehiculo}`;
    const params = changes.map((k) => vehiculo[k]);
    connection.query(sql, params, (err, result) => cb(err, result));
}

function remove(vehiculo, connection, cb) {
    const filtros = Object.keys(vehiculo);
    if (filtros.length === 0) {
        return cb(new Error("Se requiere al menos un filtro"));
    }
    const where = "WHERE " + filtros.map((k) => `${k} = ?`).join(" AND ");
    const sql = `DELETE FROM vehiculos ${where}`;
    const params = filtros.map((k) => vehiculo[k]);
    connection.query(sql, params, (err, result) => cb(err, result));
}

module.exports = {
    read: read,
    create: create,
    update: update,
    remove: remove,
};
