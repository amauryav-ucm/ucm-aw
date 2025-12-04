const express = require("express");
const router = express.Router();
const services = {};
services["usuarios"] = require("../services/usuariosService");
services["reservas"] = require("../services/reservasService");
services["vehiculos"] = require("../services/vehiculosService");
services["concesionarios"] = require("../services/concesionariosService");

router.use("/create", (req, res, next) => {
    services["concesionarios"].read({}, (err, rows) => {
        if (err) return next(err);
        res.locals.method = "create";
        res.locals.concesionarios = rows;
        return next();
    });
});

router.get("/create", (req, res) => {
    res.render("admin-vehiculos-form");
});

router.post("/create", (req, res) => {
    vehiculo = req.body;
    services["vehiculos"].create(vehiculo, (err, id) => {
        if (err) return res.render("admin-vehiculos-form", { err: err });
        return res.render("admin-vehiculos-form", { success: true });
    });
});

router.use("/update/:id", (req, res, next) => {
    services["concesionarios"].read({}, (err, rows) => {
        if (err) return next(err);
        res.locals.method = "update";
        res.locals.concesionarios = rows;
        return next();
    });
});

router.get("/update/:id", (req, res, next) => {
    services["vehiculos"].read({ id_vehiculo: req.params.id }, (err, rows) => {
        if (err) return next(err);
        if (!rows || rows.length < 1) {
            const err = new Error("No se ha encontrado el vehículo");
            err.status = 404;
            return next(err);
        }
        return res.render("admin-vehiculos-form", { vehiculo: rows[0] });
    });
});

router.post("/update/:id", (req, res, next) => {
    services["vehiculos"].update(req.body, (err, result) => {
        if (err) return res.render("admin-vehiculos-form", { vehiculo: req.body, err: err });
        return res.render("admin-vehiculos-form", { vehiculo: req.body, success: true });
    });
});

router.post("/remove/:id", (req, res, next) => {
    services["vehiculos"].remove({ id_vehiculo: req.params.id }, (err, result) => {
        if (err) return next(err);
        res.redirect("/administracion/vehiculos?success=1");
    });
});

module.exports = router;
