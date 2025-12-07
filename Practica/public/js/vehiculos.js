function cargarVehiculos() {
    $.ajax({
        url: "/api/vehiculos" + window.location.search,
        method: "GET",
        dataType: "json",
        success: function (data) {
            renderVehiculos(data);
        },
        error: function () {
            console.error("Error loading vehicles.");
        },
    });
}

function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function renderVehiculos(vehiculos) {
    var html = "";

    if (vehiculos.length === 0) {
        html = `
    <div class="col-12">
        <h5>No se han encontrado vehículos</h5>
    </div>
    `;
    }

    vehiculos.forEach((v) => {
        let badgeClass = "";
        if (v.estado === "disponible") badgeClass = "text-bg-success";
        else if (v.estado === "reservado") badgeClass = "text-bg-danger";
        else badgeClass = "text-bg-warning";
        html += `
            <div class="col">
        <div class="card shadow card-hover h-100 rounded-3 border-3">
            <div class="ratio ratio-16x9">
                <img src="img/vehiculos/${v.imagen}" class="card-img-top bg-light w-100 h-100 object-fit-contain" alt="${v.marca} ${v.modelo}">
            </div>

            <div class="p-3 border-bottom border-3">

                <h5 class="card-title d-flex justify-content-between align-items-center mb-0">
                    <span>${v.marca} ${v.modelo}</span>
                    <span class="badge ${badgeClass}">${capitalize(v.estado)}</span>
                </h5>
            </div>

            <div class="card-body d-flex flex-column pt-3">

                <div class="card-text flex-grow-1">
                    <ul class="list-unstyled">
                        <li class="mb-1">
                            <strong>Matrícula:</strong> ${v.matricula}
                        </li>
                        <li class="mb-1">
                            <strong>Año:</strong> ${v.anyo_matriculacion}
                        </li>
                        <li class="mb-1">
                            <strong>Plazas:</strong> ${v.numero_plazas}
                        </li>
                        <li class="mb-1">
                            <strong>Autonomía:</strong> ${v.autonomia_km} km
                        </li>
                        <li class="mb-1">
                            <strong>Color:</strong> ${capitalize(v.color)}
                        </li>
                    </ul>
                </div>
            </div>

            <div class="card-footer text-center pb-3 border-top border-3">
                <a href="/reservas/${v.id_vehiculo}"
                    class="btn w-100 btn-primary">
                    Reservar
                </a>
            </div>
        </div>
    </div>
        `;
    });

    $("#listaVehiculos").html(html);
}

$(function () {
    cargarVehiculos();
    setInterval(cargarVehiculos, 5000);
});
