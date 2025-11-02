// Inicializa checkboxes y opciones seleccionadas dinamicamente para evitar problemas con Prettier y EJS
document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".js-checked").forEach((el) => {
        el.checked = true;
        el.classList.remove("js-checked");
    });
    document.querySelectorAll(".js-selected").forEach((el) => {
        el.selected = true;
        el.classList.remove("js-selected");
    });
});
