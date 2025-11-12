function readVehiculos(vehiculo, connection, cb) {
    const filtros = Object.keys(vehiculo);
    const where = filtros.length > 0 ? "WHERE " + filtros.map((k) => `${k} = ?`).join("AND") : "";
    const sql = `SELECT * FROM vehiculos ${where}`;
    const params = filtros.map((k) => vehiculo[k]);
    connection.query(sql, params, (err, rows) => {
        return cb(err, rows);
    });
}

module.exports = {
    readVehiculos: readVehiculos,
};
