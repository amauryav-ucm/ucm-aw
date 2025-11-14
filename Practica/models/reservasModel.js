function create(reserva, connection, cb) {
    const sql = `INSERT INTO reservas (id_usuario, id_vehiculo, fecha_inicio, fecha_fin, estado, kilometros_recorridos, incidencias_reportadas)
                VALUES (?, ?, ?, ?, ?, ?, ?)`;
    const params = [
        reserva.id_usuario,
        reserva.id_vehiculo,
        reserva.fecha_inicio,
        reserva.fecha_fin,
        reserva.estado,
        reserva.kilometros_recorridos,
        reserva.incidentes_reportados,
    ];
    connection.query(sql, params, (err, result) => cb(err, result));
}

function read(user, connection, cb) {
    const filtros = Object.keys(user);
    const where = filtros.length > 0 ? "WHERE " + filtros.map((k) => `${k} = ?`).join("AND") : "";
    const sql = `SELECT * FROM reservas ${where}`;
    const params = filtros.map((k) => user[k]);

    connection.query(sql, params, (err, rows, fields) => {
        return cb(err, rows, fields);
    });
}

module.exports = { create: create, read: read };
