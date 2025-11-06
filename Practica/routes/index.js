const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
    res.render("index", { active: { inicio: true } });
});

router.get("/registrarse", (req, res) => {
    res.render("registrarse", {
        concesionarios: req.app.locals.concesionarios,
    });
});

router.post("/registrarse", (req, res) => {
    const body = req.body;
    const user = {
        id_usuario: 2,
        nombre: body.nombre + " " + body.apellidos,
        correo: body.email,
        password: body.password,
        rol: "empleado",
        telefono: body.telefono,
        id_concesionario: body.concesionario,
        profilePicture: "noUser.png",
    };
    console.log(user);
    req.app.locals.usuarios.push(user);
    // Hacer registro en la base de datos

    res.redirect("/login");
});

router.post("/logout", (req, res) => {
    req.session.id_usuario = null;
    req.app.locals.user = null;
    res.redirect("/");
});

module.exports = router;
