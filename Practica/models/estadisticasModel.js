module.exports = {
  totalReservas(conn, cb) {
    conn.query("SELECT COUNT(*) AS total_reservas FROM reservas", function(err, rows) {
      if (err) return cb(err);
      cb(null, (rows[0] && rows[0].total_reservas) || 0);
    });
  },

  reservasPorEstado(conn, cb) {
    conn.query("SELECT estado, COUNT(*) AS total FROM reservas GROUP BY estado", function(err, rows) {
      if (err) return cb(err);
      // devolver como objeto {activa: X, finalizada: Y, cancelada: Z}
      const out = { activa:0, finalizada:0, cancelada:0 };
      rows.forEach(r => { out[r.estado] = r.total; });
      cb(null, out);
    });
  },

  reservasPorConcesionario(conn, cb) {
    const sql = `
      SELECT c.id_concesionario, c.nombre, COUNT(r.id_reserva) AS total
      FROM concesionarios c
      LEFT JOIN vehiculos v ON v.id_concesionario = c.id_concesionario
      LEFT JOIN reservas r ON r.id_vehiculo = v.id_vehiculo
      GROUP BY c.id_concesionario, c.nombre
      ORDER BY total DESC
    `;
    conn.query(sql, function(err, rows) { if (err) return cb(err); cb(null, rows); });
  },

  vehiculosMasUsados(conn, cb) {
    const sql = `
      SELECT v.id_vehiculo, v.matricula, v.modelo, COUNT(r.id_reserva) AS veces_reservado
      FROM vehiculos v
      LEFT JOIN reservas r ON r.id_vehiculo = v.id_vehiculo
      GROUP BY v.id_vehiculo
      ORDER BY veces_reservado DESC
      LIMIT 10
    `;
    conn.query(sql, function(err, rows) { if (err) return cb(err); cb(null, rows); });
  },

  vehiculosPorConcesionario(conn, cb) {
    const sql = `
      SELECT c.id_concesionario, c.nombre AS concesionario, v.id_vehiculo, v.matricula, v.modelo,
             COUNT(r.id_reserva) AS veces_reservado
      FROM concesionarios c
      JOIN vehiculos v ON v.id_concesionario = c.id_concesionario
      LEFT JOIN reservas r ON r.id_vehiculo = v.id_vehiculo
      GROUP BY v.id_vehiculo
      ORDER BY c.id_concesionario, veces_reservado DESC
      LIMIT 100
    `;
    conn.query(sql, function(err, rows) { if (err) return cb(err); cb(null, rows); });
  },

  kmsPorVehiculo(conn, cb) {
    const sql = `
      SELECT v.id_vehiculo, v.matricula, v.modelo, IFNULL(SUM(r.kilometros_recorridos),0) AS kms
      FROM vehiculos v
      LEFT JOIN reservas r ON r.id_vehiculo = v.id_vehiculo
      GROUP BY v.id_vehiculo
      ORDER BY kms DESC
      LIMIT 10
    `;
    conn.query(sql, function(err, rows) { if (err) return cb(err); cb(null, rows); });
  },

  kmsTotales(conn, cb) {
    conn.query("SELECT IFNULL(SUM(kilometros_recorridos),0) AS kms_totales FROM reservas", function(err, rows) {
      if (err) return cb(err);
      cb(null, (rows[0] && rows[0].kms_totales) || 0);
    });
  },

  incidenciasPorVehiculo(conn, cb) {
    const sql = `
      SELECT v.id_vehiculo, v.matricula, v.modelo, v.marca,
             IFNULL(SUM(r.incidencias_reportadas),0) AS total_incidencias
      FROM vehiculos v
      LEFT JOIN reservas r ON r.id_vehiculo = v.id_vehiculo
      GROUP BY v.id_vehiculo
      ORDER BY total_incidencias DESC
      LIMIT 10
    `;
    conn.query(sql, function(err, rows) { if (err) return cb(err); cb(null, rows); });
  },

  incidenciasPorConcesionario(conn, cb) {
    const sql = `
      SELECT c.id_concesionario, c.nombre, IFNULL(SUM(r.incidencias_reportadas),0) AS total_incidencias
      FROM concesionarios c
      LEFT JOIN vehiculos v ON v.id_concesionario = c.id_concesionario
      LEFT JOIN reservas r ON r.id_vehiculo = v.id_vehiculo
      GROUP BY c.id_concesionario, c.nombre
      ORDER BY total_incidencias DESC
      LIMIT 10
    `;
    conn.query(sql, function(err, rows) { if (err) return cb(err); cb(null, rows); });
  },

  reservasPorFranja(conn, cb) {
    const sql = `
      SELECT 
        CASE
          WHEN TIME(fecha_inicio) >= '08:00:00' AND TIME(fecha_inicio) < '10:00:00' THEN '08:00 - 10:00'
          WHEN TIME(fecha_inicio) >= '10:00:00' AND TIME(fecha_inicio) < '12:00:00' THEN '10:00 - 12:00'
          WHEN TIME(fecha_inicio) >= '12:00:00' AND TIME(fecha_inicio) < '14:00:00' THEN '12:00 - 14:00'
          WHEN TIME(fecha_inicio) >= '14:00:00' AND TIME(fecha_inicio) < '16:00:00' THEN '14:00 - 16:00'
          WHEN TIME(fecha_inicio) >= '16:00:00' AND TIME(fecha_inicio) < '18:00:00' THEN '16:00 - 18:00'
          WHEN TIME(fecha_inicio) >= '18:00:00' AND TIME(fecha_inicio) < '20:00:00' THEN '18:00 - 20:00'
          ELSE 'Fuera de horario'
        END AS franja,
        COUNT(*) AS total_reservas
      FROM reservas
      GROUP BY franja
      ORDER BY total_reservas DESC
    `;
    conn.query(sql, function(err, rows) { if (err) return cb(err); cb(null, rows); });
  }
};