const express = require("express");
const router = express.Router();
const concesionariosService = require("../services/concesionariosService");

router.get("/coordenadas", function (req, res) {
    /*   concesionariosService.obtenerUbicacionConcesionarios(function (err, concesionarios) {
        console.log("he llegado a concesionarios de routes", concesionarios);

    if (err) {
      return res.status(500).json({ ok: false, error: 'Error al hacer fetch de las coordenadas de los concesionarios' });
    }
    res.json({ ok: true, data: concesionarios });
  }); */
    concesionariosService.read({ activo: true }, (err, concesionarios) => {
        if (err) {
            return res.status(500).json({ ok: false, error: "Error al hacer fetch de las coordenadas de los concesionarios" });
        }
        res.json({ ok: true, data: concesionarios.filter((c) => c.longitud && c.latitud) });
    });
});

module.exports = router;
