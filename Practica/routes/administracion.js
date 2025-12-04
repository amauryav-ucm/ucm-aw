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

const routerAdministracionVehiculos = require("./administracionVehiculos");
router.use("/vehiculos", routerAdministracionVehiculos);

const routerAdministracionConcesionarios = require("./administracionConcesionarios");
router.use("/concesionarios", routerAdministracionConcesionarios);

router.use((req, res, next) => {
    res.locals.myUtils = req.app.locals.myUtils;
    next();
});

router.get("/", (req, res) => {
    res.render("administracion");
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
