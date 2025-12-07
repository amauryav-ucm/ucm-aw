const express = require("express");
const router = express.Router();
const services = {};
services["usuarios"] = require("../services/usuariosService");
services["reservas"] = require("../services/reservasService");
services["vehiculos"] = require("../services/vehiculosService");
services["concesionarios"] = require("../services/concesionariosService");

const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post("/upload-json", upload.single("file"), (req, res) => {
    if (!req.file) {
        req.session.logs = { err: "No se subió el archivo" };
        return res.redirect("/administracion/usuarios");
    }

    let a;
    try {
        a = JSON.parse(req.file.buffer.toString("utf8"));
        if (!Array.isArray(a)) throw new Error();
    } catch (e) {
        req.session.logs = { err: "JSON inválido" };
        return res.redirect("/administracion/usuarios");
    }

    services.usuarios.upsertMany(a, (error, resultados) => {
        if (error) {
            req.session.logs = { err: "JSON inválido" };
            return res.redirect("/administracion/usuarios");
        }
        req.session.logs = {
            insertado: resultados.filter((r) => r.accion === "insertado").length,
            actualizado: resultados.filter((r) => r.accion === "actualizado").length,
            sin_cambios: resultados.filter((r) => r.accion === "sin_cambios").length,
        };

        res.redirect("/administracion/usuarios");
    });
});

module.exports = router;
