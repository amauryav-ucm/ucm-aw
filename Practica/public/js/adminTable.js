const modalConfirmacion = document.getElementById("modalConfirmacion");
const modalConfirmacionObject = new bootstrap.Modal(modalConfirmacion);

function showDeleteModal(id) {
    console.log("Trying to delete ", id);

    formDeleteConfirm = document.getElementById("formDeleteConfirm");
    formDeleteConfirm.action = `./remove/${id}`;

    document.getElementById("modalConfirmacionBody").innerHTML = `
    Estás seguro que deseas borrar el elemento con id ${id}?`;
    modalConfirmacionObject.show();
}
