const express = require("express");
const router = express.Router();
const usuariosService = require("../services/usuariosService");

const bcrypt = require("bcrypt");

const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.get("/", (req, res) => {
    res.render("login");
});

router.post("/", (req, res, next) => {
    req.body.correo = req.body.correo;
    next();
});

router.post("/upload-json", upload.single("file"), (req, res) => {
    if (!req.file) {
        return res.render("administracion/usuarios", {
            logs: [{ mensaje: "No se subió archivo", tipo: "error" }],
        });
    }

    let a;
    try {
        a = JSON.parse(req.file.buffer.toString("utf8"));
        if (!Array.isArray(a)) throw new Error();
    } catch (e) {
        return res.render("administracion/usuarios", {
            logs: [{ mensaje: "JSON inválido", tipo: "error" }],
        });
    }

    usuariosService.upsertMany(a, (error, resultados) => {
        if (error) {
            console.log(error);
            return res.render("administracion/usuarios", {
                logs: [{ mensaje: error.message, tipo: "error" }],
            });
        }

        const logs = resultados.map((r) => ({
            mensaje: `Empleado con correo: ${r.correo} ${r.accion}`,
            tipo: r.accion === "insertado" || r.accion === "actualizado" ? "success" : "info",
        }));

        //res.render("administracion/usuarios", { logs });
        res.redirect("/administracion/usuarios");
    });
});

router.post("/", (req, res) => {
    const credentials = req.body;
    usuariosService.read({ correo: credentials.correo, activo: true }, (err, rows) => {
        if (rows.length === 0) {
            console.log(`DEBUG Cuenta no encontrada: ${credentials.correo}`);
            return res.render("login", { err: "El correo electrónico o constraseña son incorrectos" });
        }
        user = rows[0];
        bcrypt.compare(credentials.contrasena, user.contrasena, (err, result) => {
            if (err) {
                console.error(err);
                return res.render("login", { err: "Ha ocurrido un error, intentalo de nuevo más tarde" });
            }

            if (!result) {
                console.log(`DEBUG Contrasena incorrecta para: ${credentials.correo}`);
                return res.render("login", { err: "El correo electrónico o constraseña son incorrectos" });
            } else {
                req.session.id_usuario = user.id_usuario;
                usuariosService.getPreferencias(req.session.id_usuario, (err, preferencias) => {
                    if (err) {
                        console.error("Error al cargar preferencias:", err);
                        req.session.accessibility = { theme: "dark", fontSize: "md" };
                    } else {
                        req.session.accessibility = preferencias || { theme: "dark", fontSize: "md" };
                    }
                    return res.redirect("/");
                });
            }
        });
    });
});

module.exports = router;
