document.addEventListener("keydown", function (e) {
    if (e.ctrlKey && e.altKey) {
        if (e.key.toLowerCase() === "r") {
            e.preventDefault();
            window.location.href = "/reservas";
        }
        if (e.key.toLowerCase() === "i") {
            e.preventDefault();
            window.location.href = "/";
        }
        if (e.key.toLowerCase() === "v") {
            e.preventDefault();
            window.location.href = "/vehiculos";
        }
        if (e.key.toLowerCase() === "h") {
            e.preventDefault();
            window.location.href = "/reservas/historial";
        }
    }
});
