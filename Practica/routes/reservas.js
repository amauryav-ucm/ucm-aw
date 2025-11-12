const express = require("express");
const router = express.Router();
const vehiculosService = require("../services/vehiculosService");
const usuariosService = require("../services/usuariosService.js");

router.use((req, res, next) => {
    res.locals.active = { reservas: true };
    next();
});

router.use((req, res, next) => {
    if (!req.session.id_usuario) return res.redirect("/login");
    usuariosService.buscarUsuarios({ id_usuario: req.session.id_usuario }, (err, rows) => {
        if (err) return next(err);

        if (!rows || rows.length < 1) {
            req.session.id_usuario = null;
            return res.redirect("/login");
        }
        const id_concesionario = rows[0].id_concesionario;
        vehiculosService.buscarVehiculos({ id_concesionario: id_concesionario }, (err, rows) => {
            if (err) return next(err);
            res.locals.vehiculos = rows;
            return next();
        });
    });
});

router.get("/", (req, res) => {
    res.render("reservas", {
        selected: {},
    });
});

router.post("/", (req, res) => {
    console.log(req.body);
    res.redirect("/reservas/confirmacion");
});

router.get("/confirmacion", (req, res) => {
    res.render("reservas-confirmacion");
});

router.get("/:id", (req, res) => {
    res.render("reservas", {
        selected: { vehiculo: req.params.id },
    });
});

module.exports = router;
