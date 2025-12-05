const modalConfirmacion = document.getElementById("modalConfirmacion");
const modalConfirmacionObject = new bootstrap.Modal(modalConfirmacion);

function showCancelModal(id) {
    formDeleteConfirm = document.getElementById("formDeleteConfirm");
    formDeleteConfirm.action = `/reservas/cancelar/${id}`;

    document.getElementById("modalConfirmacionBody").innerHTML = `
    Estás seguro que deseas cancelar la reserva con ID ${id}?`;
    modalConfirmacionObject.show();
}

function showReturnModal(id, autonomia_inicial) {
    formDeleteConfirm = document.getElementById("formDeleteConfirm");
    formDeleteConfirm.action = `/reservas/finalizar`;
    document.getElementById("modalConfirmacionBody").innerHTML = `<fieldset>
                        <legend class="fs-5">Finalizar reserva</legend>
                        <input type="hidden" name="id_reserva" value="${id}">
                        <div class="mb-3">
                            <label for="kilometros_recorridos" class="form-label">Kilometros Recorridos</label>
                            <input id="kilometros_recorridos" name="kilometros_recorridos" type="number" class="form-control" min="0"
                                max="<%= v.autonomia_actual %>" required>
                            <span class="invalid-feedback">Introduce un número entre 0 y la autonomía inicial del vehículo (${autonomia_inicial})</span>
                        </div>
                        <div class="mb-3">
                            <label for="incidencias_reportadas" class="form-label">Incidencias</label>
                            <textarea id="incidencias_reportadas" name="incidencias_reportadas" class="form-control" rows="5"></textarea>
                        </div>
                    </fieldset>`;
    modalConfirmacionObject.show();
}
