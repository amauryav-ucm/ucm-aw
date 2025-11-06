const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
    res.render("login");
});

router.post("/", (req, res) => {
    const usuarios = req.app.locals.usuarios;
    const credentials = req.body;
    const user = usuarios.find((u) => u.correo === credentials.correo.toLowerCase() && u.password === credentials.password);
    if (user) {
        req.session.id_usuario = user.id_usuario;
        console.log(`El usuario con id: ${user.id_usuario} ha iniciado sesión correctamente`);
        res.redirect("/");
    } else {
        res.render("login", {
            wrongCredentials: true,
        });
    }
});

module.exports = router;
