const express = require("express");
const path = require("path");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const expressLayouts = require("express-ejs-layouts");

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
    { username: "admin", password: "admin", profilePicture: "steveCurros.png", role: "admin" },
    { username: "ivan", password: "ivan", profilePicture: "ivan.jpg", role: "employee" },
];
app.locals.usuarios = usuarios;

const vehiculos = require("./data/vehiculos.json");
app.locals.vehiculos = vehiculos;

const myUtils = require("./utils/utils");
app.locals.myUtils = myUtils;

// Routes
app.use((req, res, next) => {
    res.locals.active = {};
    if (req.session.username) {
        const user = usuarios.find((u) => u.username.toLowerCase() === req.session.username.toLowerCase());
        if (user) res.locals.user = { username: user.username, profilePicture: user.profilePicture, role: user.role };
    }
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
