const express = require("express");
const path = require("path");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const expressLayouts = require("express-ejs-layouts");
const db = require("./db/dbPool.js");

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

// Simulated database (in-memory)
const usuarios = [
    {
        id_usuario: 1,
        correo: "admin@purevolt.es",
        nombre: "Steve Curros",
        password: "$2b$10$8ApUW/TFMo.b6a/VCf5k7eEF1HiIHIT6g52hTuC2Ey/r9ekxWhh2O",
        profilePicture: "steveCurros.png",
        rol: "admin",
    },
];
app.locals.usuarios = usuarios;

const vehiculos = require("./data/vehiculos.json");
app.locals.vehiculos = vehiculos;
const concesionarios = require("./data/concesionarios.json");
app.locals.concesionarios = concesionarios;

const myUtils = require("./utils/utils");
app.locals.myUtils = myUtils;

// Routes
app.use((req, res, next) => {
    if (!res.locals.active) res.locals.active = {};
    next();
});

app.use((req, res, next) => {
    if (req.session.id_usuario) {
        console.log(`Usuario con sesion iniciada en la session: ${req.session.id_usuario}`);
        const user = usuarios.find((u) => u.id_usuario === req.session.id_usuario);
        if (user) res.locals.user = { correo: user.correo, nombre: user.nombre, profilePicture: user.profilePicture, rol: user.rol };
    }
    next();
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

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).render("500");
});

app.use((req, res) => {
    res.status(404).render("404");
});

// Server
app.listen(PORT, () => {
    console.log(`EcoMarket EXAM app running at http://localhost:${PORT}`);
});
