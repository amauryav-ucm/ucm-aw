const express = require("express");
const router = express.Router();
const usuariosService = require("../services/usuariosService");
const concesionariosService = require("../services/concesionariosService");

const bcrypt = require("bcrypt");
const saltRounds = 10;

router.use((req, res, next) => {
    concesionariosService.buscarConcesionarios({}, (err, rows) => {
        if (err) return next(err);
        res.locals.concesionarios = rows;
        return next();
    });
});

router.get("/", (req, res) => {
    res.render("registrarse", {});
});

router.post("/", (req, res) => {
    const body = req.body;
    const user = {
        nombre: body.nombre + " " + body.apellidos,
        correo: body.correo,
        rol: "empleado",
        telefono: body.telefono,
        id_concesionario: body.id_concesionario,
    };
    bcrypt.hash(body.contrasena, saltRounds, (err, hash) => {
        if (err) console.log(err);
        else {
            user.contrasena = hash;
            console.log(user);
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
