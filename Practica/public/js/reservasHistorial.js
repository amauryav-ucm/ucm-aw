const modalConfirmacion = document.getElementById("modalConfirmacion");
const modalConfirmacionObject = new bootstrap.Modal(modalConfirmacion);

function showCancelModal(id) {
    formDeleteConfirm = document.getElementById("formDeleteConfirm");
    formDeleteConfirm.action = `/reservas/cancelar/${id}`;

    document.getElementById("modalConfirmacionBody").innerHTML = `
    Estás seguro que deseas cancelar la reserva con ID ${id}?`;
    modalConfirmacionObject.show();
}

const modalDevolucion = document.getElementById("modalDevolucion");
const modalDevolucionObject = new bootstrap.Modal(modalDevolucion);

function showReturnModal(id, autonomia_inicial) {
    document.getElementById("devolcionIdReserva").value = id;
    document.getElementById("devolucionKmFeedback").innerHTML = `Introduce un número entre 0 y la autonomía inicial (${autonomia_inicial})`;
    document.getElementById("kilometros_recorridos").max = autonomia_inicial;
    modalDevolucionObject.show();
}

document.querySelectorAll(".star-rating:not(.readonly) label").forEach((star) => {
    star.addEventListener("click", function () {
        this.style.transform = "scale(1.2)";
        setTimeout(() => {
            this.style.transform = "scale(1)";
        }, 200);
    });
});
