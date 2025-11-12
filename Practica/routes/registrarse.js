const express = require("express");
const router = express.Router();
const usuariosService = require("../services/usuariosService");

const bcrypt = require("bcrypt");
const saltRounds = 10;

router.use((req, res, next) => {
    res.locals.concesionarios = req.app.locals.concesionarios;
    next();
});

router.get("/", (req, res) => {
    res.render("registrarse", {});
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
            user.contrasena = hash;
            console.log(user);
            req.app.locals.usuarios.push(user);
            // Hacer registro en la base de datos
            usuariosService.nuevoUsuario(user, (err, id) => {
                if (err) {
                    console.log(err.message);
                    res.render("registrarse", {
                        err: err.message,
                    });
                } else {
                    console.log(`Registrado un nuevo usuario con id ${id}`);
                    res.render("registrarse", {
                        success: true,
                    });
                }
            });
        }
    });
});

module.exports = router;
