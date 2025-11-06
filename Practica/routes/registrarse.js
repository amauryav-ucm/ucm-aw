const express = require("express");
const router = express.Router();

const bcrypt = require("bcrypt");
const saltRounds = 10;

router.get("/", (req, res) => {
    res.render("registrarse", {
        concesionarios: req.app.locals.concesionarios,
    });
});

router.post("/", (req, res) => {
    const body = req.body;
    const user = {
        id_usuario: 2,
        nombre: body.nombre + " " + body.apellidos,
        correo: body.email,
        rol: "empleado",
        telefono: body.telefono,
        id_concesionario: body.concesionario,
        profilePicture: "noUser.png",
    };
    bcrypt.hash(body.password, saltRounds, (err, hash) => {
        if (err) console.log(err);
        else {
            user.password = hash;
            console.log(user);
            req.app.locals.usuarios.push(user);
            // Hacer registro en la base de datos

            res.redirect("/login");
        }
    });
});

module.exports = router;
