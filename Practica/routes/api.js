const express = require("express");
const router = express.Router();
const services = {};
services["usuarios"] = require("../services/usuariosService");
services["reservas"] = require("../services/reservasService");
services["vehiculos"] = require("../services/vehiculosService");
services["concesionarios"] = require("../services/concesionariosService");

router.get("/valoracion/top/:n", (req, res) => {
    services.reservas.read({ estado: "finalizada", activo: true }, (err, rows) => {
        rows = rows.filter((r) => r.valoracion).map((r) => JSON.parse(r.valoracion));
        rows.sort((b, a) => parseInt(a.estrellas) - parseInt(b.estrellas));
        rows = rows.slice(0, req.params.n);
        console.log(rows);
        res.send(rows);
    });
});

module.exports = router;
