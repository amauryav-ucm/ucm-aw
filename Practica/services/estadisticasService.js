const dbPool = require("../db/dbPool");
const model = require("../models/estadisticasModel");



module.exports = {
  getAll: function(callback) {
    dbPool.getConnection(function(err, conn) {
      if (err) return callback(err);
      const stats = {};

      model.totalReservas(conn, function(err, total) {
        if (err) { conn.release(); return callback(err); }
        stats.total_reservas = total;

        model.reservasPorEstado(conn, function(err, porEstado) {
          if (err) { conn.release(); return callback(err); }
          stats.reservas_por_estado = porEstado;

          model.reservasPorConcesionario(conn, function(err, porConc) {
            if (err) { conn.release(); return callback(err); }
            stats.reservas_por_concesionario = porConc;

            model.vehiculosMasUsados(conn, function(err, vehMas) {
              if (err) { conn.release(); return callback(err); }
              stats.vehiculos_mas_usados = vehMas;

              model.vehiculosPorConcesionario(conn, function(err, vehPorConc) {
                if (err) { conn.release(); return callback(err); }
                stats.vehiculos_por_concesionario = vehPorConc;

                model.kmsPorVehiculo(conn, function(err, kmsTop) {
                  if (err) { conn.release(); return callback(err); }
                  stats.kms_por_vehiculo = kmsTop;

                  model.kmsTotales(conn, function(err, kmsTot) {
                    if (err) { conn.release(); return callback(err); }
                    stats.kms_totales = kmsTot;

                    model.incidenciasPorVehiculo(conn, function(err, incVeh) {
                      if (err) { conn.release(); return callback(err); }
                      stats.incidencias_por_vehiculo = incVeh;

                      model.incidenciasPorConcesionario(conn, function(err, incConc) {
                        if (err) { conn.release(); return callback(err); }
                        stats.incidencias_por_concesionario = incConc;

                        model.reservasPorFranja(conn, function(err, franjas) {
                          conn.release();
                          if (err) return callback(err);
                          stats.reservas_por_franja = franjas;
                          return callback(null, stats);
                        });
                      });
                    });
                  });
                });
              });
            });
          });
        });
      });
    });
  }
};