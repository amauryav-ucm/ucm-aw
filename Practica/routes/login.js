const express = require("express");
const router = express.Router();
const usuariosService = require("../services/usuariosService");

const bcrypt = require("bcrypt");

router.get("/", (req, res) => {
    res.render("login");
});

router.post("/", (req, res) => {
    const credentials = req.body;
    usuariosService.buscarUsuario({ correo: credentials.correo }, (err, rows) => {
        if (rows.length === 0) {
            console.log("Cuenta no encontrada");
            return res.render("login", { err: "El correo electrónico o constraseña son incorrectos" });
        }
        user = rows[0];
        bcrypt.compare(credentials.contrasena, user.contrasena, (err, result) => {
            if (err) {
                console.error(err);
                return res.render("login", { err: "Ha ocurrido un error, intentalo de nuevo más tarde" });
            }

            if (!result) {
                console.log("Contrasena incorrecta");
                return res.render("login", { err: "El correo electrónico o constraseña son incorrectos" });
            } else {
                req.session.id_usuario = user.id_usuario;
                return res.redirect("/");
            }
        });
    });
});

module.exports = router;
