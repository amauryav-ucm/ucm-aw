function read(concesionario, connection, cb) {
    const filtros = Object.keys(concesionario);
    const where = filtros.length > 0 ? "WHERE " + filtros.map((k) => `${k} = ?`).join("AND") : "";
    const sql = `SELECT * FROM concesionarios ${where}`;
    const params = filtros.map((k) => concesionario[k]);
    connection.query(sql, params, (err, rows, fields) => {
        return cb(err, rows, fields);
    });
}

module.exports = {
    read: read,
};
