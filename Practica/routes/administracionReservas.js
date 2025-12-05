const express = require("express");
const router = express.Router();
const services = {};
services["usuarios"] = require("../services/usuariosService");
services["reservas"] = require("../services/reservasService");
services["vehiculos"] = require("../services/vehiculosService");
services["concesionarios"] = require("../services/concesionariosService");

router.use("/update", (req, res, next) => {
    res.locals.method = "update";
    next();
});

router.get("/update/:id", (req, res, next) => {
    services["reservas"].read({ id_reserva: req.params.id }, (err, rows) => {
        if (err) return next(err);
        if (!rows || rows.length < 1) {
            const err = new Error("No se ha encontrado la reserva");
            err.status = 404;
            return next(err);
        }
        return res.render("admin-reservas-form", { reserva: rows[0] });
    });
});

router.post("/update/:id", (req, res, next) => {
    services["reservas"].update(req.body, (err, result) => {
        if (err) return res.render("admin-reservas-form", { reserva: req.body, err: err });
        return res.render("admin-reservas-form", { reserva: req.body, success: true });
    });
});

router.post("/remove/:id", (req, res, next) => {
    services["reservas"].remove({ id_reserva: req.params.id }, (err, result) => {
        if (err) return next(err);
        res.redirect("/administracion/reservas?success=1");
    });
});

module.exports = router;
