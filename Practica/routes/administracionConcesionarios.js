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

const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post("/upload-json", upload.single("file"), (req, res) => {
    if (!req.file) {
        req.session.logs = { err: "No se subió el archivo" };
        return res.redirect("/administracion/concesionarios");
    }

    let a;
    try {
        a = JSON.parse(req.file.buffer.toString("utf8"));
        if (!Array.isArray(a)) throw new Error();
    } catch (e) {
        req.session.logs = { err: "JSON inválido" };
        return res.redirect("/administracion/concesionarios");
    }

    services.concesionarios.upsertMany(a, (error, resultados) => {
        if (error) {
            req.session.logs = { err: "JSON inválido" };
            return res.redirect("/administracion/concesionarios");
        }
        req.session.logs = {
            insertado: resultados.filter((r) => r.accion === "insertado").length,
            actualizado: resultados.filter((r) => r.accion === "actualizado").length,
            sin_cambios: resultados.filter((r) => r.accion === "sin_cambios").length,
        };

        res.redirect("/administracion/concesionarios");
    });
});

module.exports = router;
