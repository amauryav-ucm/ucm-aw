const express = require("express");
const router = express.Router();
const services = {};
services["usuarios"] = require("../services/usuariosService");
services["reservas"] = require("../services/reservasService");
services["vehiculos"] = require("../services/vehiculosService");
services["concesionarios"] = require("../services/concesionariosService");

router.use("/*", (req, res, next) => {
    if (!req.session.id_usuario) return res.redirect("/login");
    if (res.locals.user.rol === "empleado") {
        let err = new Error("Solo los administradores pueden acceder a este sitio");
        err.status = 403;
        return next(err);
    }
    next();
});

router.use((req, res, next) => {
    res.locals.myUtils = req.app.locals.myUtils;
    next();
});

router.get("/", (req, res) => {
    res.render("administracion");
});

router.use("/vehiculos/create", (req, res, next) => {
    services["concesionarios"].read({}, (err, rows) => {
        if (err) return next(err);
        res.locals.method = "create";
        res.locals.concesionarios = rows;
        return next();
    });
});

router.get("/vehiculos/create", (req, res) => {
    res.render("admin-vehiculos-form");
});

router.post("/vehiculos/create", (req, res) => {
    vehiculo = req.body;
    services["vehiculos"].create(vehiculo, (err, id) => {
        if (err) return res.render("admin-vehiculos-form", { err: err });
        return res.render("admin-vehiculos-form", { success: true });
    });
});

router.use("/vehiculos/update/:id", (req, res, next) => {
    services["concesionarios"].read({}, (err, rows) => {
        if (err) return next(err);
        res.locals.method = "update";
        res.locals.concesionarios = rows;
        return next();
    });
});

router.get("/vehiculos/update/:id", (req, res, next) => {
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

router.post("/vehiculos/update/:id", (req, res, next) => {
    services["vehiculos"].update(req.body, (err, result) => {
        if (err) return res.render("admin-vehiculos-form", { vehiculo: req.body, err: err });
        return res.render("admin-vehiculos-form", { vehiculo: req.body, success: true });
    });
});

router.post("/vehiculos/remove/:id", (req, res, next) => {
    services["vehiculos"].remove({ id_vehiculo: req.params.id }, (err, result) => {
        if (err) return next(err);
        res.redirect("/administracion/vehiculos?success=1");
    });
});

router.get("/:table", (req, res, next) => {
    const table = req.params.table;
    if (req.query.success) res.locals.success = true;
    if (!services[table]) return next();
    services[table].read({}, (err, rows, fields) => {
        if (err) return next(err);
        return res.render("admin-table", { base: `/administracion/${table}/`, table: table, fields: fields, rows: rows });
    });
});

module.exports = router;
