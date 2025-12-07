function create(concesionario, connection, cb) {
    const sql = `INSERT INTO concesionarios (nombre, ciudad, direccion, telefono_contacto, latitud, longitud) 
    VALUES (?, ?, ?, ?)`;
    const params = [
        concesionario.nombre,
        concesionario.ciudad,
        concesionario.direccion,
        concesionario.telefono_contacto,
        concesionario.latitud,
        concesionario.longitud,
    ];
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

function obtenerCoordenadasConcesionarios(connection, cb) {
    const sql = `
    SELECT id_concesionario, bombre, ciudad, direccion, telefono_contacto, latitud, longitud
    FROM concesionarios
    WHERE latitud IS NOT NULL AND longitude IS NOT NULL
    ORDER BY name
  `;
    pool.query(sql, [], function (err, result) {
        if (err) return callback(err);
        const rows = result.rows || [];
        const concesionarios = rows.map(function (r) {
            return {
                nombre: r.nombre,
                latitud: r.latitud === null ? null : Number(r.latitud),
                longitud: r.longitud === null ? null : Number(r.longitud),
            };
        });
        console.log("concesionarios en el model:", concesionarios);
        callback(null, concesionarios);
    });
}

function upsertConcesionarios(conn, arr, cb) {
    if (!Array.isArray(arr) || arr.length === 0) return cb(null, { inserted: 0, updated: 0 });
    let inserted = 0,
        updated = 0,
        processed = 0,
        errState = false;
    arr.forEach((c) => {
        const id = c.id_concesionario;
        if (!id) {
            processed++;
            if (processed === arr.length) cb(null, { inserted, updated });
            return;
        }
        conn.query("SELECT 1 FROM concesionarios WHERE id_concesionario=?", [id], (err, rows) => {
            if (err && !errState) {
                errState = true;
                return cb(err);
            }
            if (rows && rows.length) {
                conn.query(
                    "UPDATE concesionarios SET nombre=?, ciudad=?, direccion=?, telefono_contacto=? WHERE id_concesionario=?",
                    [c.nombre, c.ciudad, c.direccion, c.telefono_contacto, id],
                    (err2) => {
                        if (err2 && !errState) {
                            errState = true;
                            return cb(err2);
                        }
                        updated++;
                        processed++;
                        if (processed === arr.length) cb(null, { inserted, updated });
                    },
                );
            } else {
                conn.query(
                    "INSERT INTO concesionarios (id_concesionario,nombre,ciudad,direccion,telefono_contacto) VALUES (?,?,?,?,?)",
                    [id, c.nombre, c.ciudad, c.direccion, c.telefono_contacto],
                    (err2) => {
                        if (err2 && !errState) {
                            errState = true;
                            return cb(err2);
                        }
                        inserted++;
                        processed++;
                        if (processed === arr.length) cb(null, { inserted, updated });
                    },
                );
            }
        });
    });
}

module.exports = {
    create: create,
    read: read,
    update: update,
    remove: remove,
    obtenerCoordenadasConcesionarios: obtenerCoordenadasConcesionarios,
    upsertConcesionarios: upsertConcesionarios,
};
