const express = require("express");
const router = express.Router();

const bcrypt = require("bcrypt");

router.get("/", (req, res) => {
    res.render("login");
});

router.post("/", (req, res) => {
    const usuarios = req.app.locals.usuarios;
    const credentials = req.body;
    const user = usuarios.find((u) => u.correo === credentials.correo.toLowerCase());
    let ok = false;
    if (!user) {
        res.render("login", {
            wrongCredentials: true,
        });
    }
    bcrypt.compare(credentials.password, user.password, (err, result) => {
        if (err) {
            console.error(err);
            return res.render("login", { wrongCredentials: true });
        }

        if (result) {
            req.session.id_usuario = user.id_usuario;
            return res.redirect("/");
        } else {
            return res.render("login", { wrongCredentials: true });
        }
    });
});

module.exports = router;
