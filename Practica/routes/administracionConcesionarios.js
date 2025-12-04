const express = require("express");
const router = express.Router();
const services = {};
services["usuarios"] = require("../services/usuariosService");
services["reservas"] = require("../services/reservasService");
services["vehiculos"] = require("../services/vehiculosService");
services["concesionarios"] = require("../services/concesionariosService");

router.use("/create", (req, res, next) => {
    res.locals.method = "create";
    next();
});

router.use("/update", (req, res, next) => {
    res.locals.method = "update";
    next();
});

router.get("/create", (req, res) => {
    res.render("admin-concesionarios-form");
});

router.post("/create", (req, res) => {
    vehiculo = req.body;
    services["concesionarios"].create(vehiculo, (err, id) => {
        if (err) return res.render("admin-concesionarios-form", { err: err });
        return res.render("admin-concesionarios-form", { success: true });
    });
});

router.get("/update/:id", (req, res, next) => {
    services["concesionarios"].read({ id_concesionario: req.params.id }, (err, rows) => {
        if (err) return next(err);
        if (!rows || rows.length < 1) {
            const err = new Error("No se ha encontrado el concesionario");
            err.status = 404;
            return next(err);
        }
        return res.render("admin-concesionarios-form", { concesionario: rows[0] });
    });
});

router.post("/update/:id", (req, res, next) => {
    services["concesionarios"].update(req.body, (err, result) => {
        if (err) return res.render("admin-concesionarios-form", { concesionario: req.body, err: err });
        return res.render("admin-concesionarios-form", { concesionario: req.body, success: true });
    });
});

router.post("/remove/:id", (req, res, next) => {
    services["concesionarios"].remove({ id_concesionario: req.params.id }, (err, result) => {
        if (err) return next(err);
        res.redirect("/administracion/concesionarios?success=1");
    });
});

module.exports = router;
