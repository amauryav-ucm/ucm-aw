const express = require("express");
const path = require("path");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const expressLayouts = require("express-ejs-layouts");
const db = require("./db/dbPool.js");
const usuariosService = require("./services/usuariosService");
const concesionariosService = require("./services/concesionariosService");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
    session({
        secret: "purevolt",
        resave: false,
        saveUninitialized: false,
    }),
);
app.use(expressLayouts);

// Static files
app.use(express.static(path.join(__dirname, "public")));

// View engine
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

const myUtils = require("./utils/utils");
app.locals.myUtils = myUtils;

// Routes
app.use((req, res, next) => {
    if (!res.locals.active) res.locals.active = {};
    next();
});

app.use((req, res, next) => {
    if (!req.session.id_usuario) return next();

    console.log(`Usuario con sesion iniciada en la session: ${req.session.id_usuario}`);
    usuariosService.buscarUsuarios({ id_usuario: req.session.id_usuario }, (err, rows) => {
        if (err) return next(err);

        if (!rows || rows.length < 1) {
            req.session.id_usuario = null;
            return next();
        }

        const user = rows[0];
        concesionariosService.buscarConcesionarios({ id_concesionario: user.id_concesionario }, (err, rows) => {
            if (err || !rows || rows.length < 1) return next(err);
            res.locals.user = { correo: user.correo, nombre: user.nombre, foto_perfil: user.foto_perfil, rol: user.rol, concesionario: rows[0] };
            return next();
        });
    });
});

app.use((req, res, next) => {
    const acc = req.session.accessibility || {};
    res.locals.accessibility = { theme: acc.theme || "dark", fontSize: acc.fontSize || "md" };
    next();
});

const mainRoutes = require("./routes/index");
app.use("/", mainRoutes);

const routesVehiculos = require("./routes/vehiculos");
app.use("/vehiculos", routesVehiculos);

const routesReservas = require("./routes/reservas");
app.use("/reservas", routesReservas);

const routesLogin = require("./routes/login");
app.use("/login", routesLogin);

const routesRegistrarse = require("./routes/registrarse");
app.use("/registrarse", routesRegistrarse);

const routesAccesibilidad = require("./routes/accesibilidad");
app.use("/accesibilidad", routesAccesibilidad);

app.use((req, res) => {
    res.status(404).render("404");
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).render("500");
});

// Server
app.listen(PORT, () => {
    console.log(`EcoMarket EXAM app running at http://localhost:${PORT}`);
});
