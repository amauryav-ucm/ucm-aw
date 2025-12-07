const iconoPorDefecto = L.icon({
  iconUrl: '/icons/marker-icon.png',
  iconRetinaUrl: '/icons/marker-icon-2x.png',
  shadowUrl: '/icons/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Definimos el mapa con una ubicación pro defecto
const map = L.map('map').setView([40.4, -3.7], 6);

const noExisteConcesionarios = false;

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 18,
  attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

// Obtenemos los datos de los concesionarios
let concesionarios = [];

// Por defecto definimos una ubicación random
const ubicacionPorDefecto = [40, -3.5];
let ubicacionUsuario = null;

// Obtenemos la localización del usuario cuando interacciona con el mapa
function obtenerUbicacionUsuario(callback) {
  if (ubicacionUsuario !== null) {
    callback(ubicacionUsuario);
    return;
  }

  if (navigator.geolocation) {
    if (confirm("¿Deseas compartir tu ubicación para poder calcular la distancia desde tu posición al concesionario ?")) {
      navigator.geolocation.getCurrentPosition(
        pos => {
          ubicacionUsuario = [pos.coords.latitude, pos.coords.longitude];
          callback(ubicacionUsuario);
        },
        () => {
          alert("No se ha podido obtener tu ubicación, se usará una ubicación por defecto.");
          ubicacionUsuario = ubicacionPorDefecto;
          callback(ubicacionUsuario);
        }
      );
    } else {
      ubicacionUsuario = ubicacionPorDefecto;
      callback(ubicacionUsuario);
    }
  } else {
    alert("Tu navegador web no permite obtener tu localización, se usará la ubicación por defecto.");
    ubicacionUsuario = ubicacionPorDefecto;
    callback(ubicacionUsuario);
  }
}

// Obtenemos las coordenadas de los concesionarios desde el backend
function obtenerConcesionarios(callback) {
  fetch('/concesionarios/coordenadas')
    .then(function (res) {
      if (!res.ok) throw new Error('Ha habido una error de conexión');
      return res.json();
    })
    .then(function (payload) {
      if (!payload || payload.ok !== true) throw new Error('Error al obtener datos de la API');
      debugger;
      if(payload.data.length === 0)
        noExisteConcesionarios = true
      else
        noExisteConcesionarios = false
      const datos = (payload.data || []).map(function (d) {
        const nombre = d.nombre || '';
        const latitud = (d.latitud !== undefined && d.latitud !== null) ? parseFloat(d.latitud) : null;
        const longitud = (d.longitud !== undefined && d.longitud !== null) ? parseFloat(d.longitud) : null;
        return {
          nombre: nombre,
          coords: (isNaN(latitud) || isNaN(longitud)) ? null : [latitud, longitud]
        };
      }).filter(function (x) { return x.coords !== null; });

      // Guardamos en variable global para reutilizar sin volver a pedir al servidor
      concesionarios = datos.slice();

      callback(null, concesionarios);
    })
    .catch(function (err) {
      console.error('Error obteniendo concesionarios:', err);
      callback(err);
    });
}


// Marcadores y Rutas
let marcadoresConcesionarios = [];
let controladorRutas = null;

// Limpiamos el mapa antes de añadir los marcadores y las rutas
function limpiarMapa() {
  marcadoresConcesionarios.forEach(m => map.removeLayer(m));
  marcadoresConcesionarios = [];
  if (controladorRutas) {
    controladorRutas.remove();
    controladorRutas = null;
  }
}

// Limpiamos el mapa y añadimos los marcadores de los concesionarios al mapa
function mostrarTodos() {
  limpiarMapa();

    if (!concesionarios || concesionarios.length === 0 || concesionarios.data.length === 0) {
      obtenerConcesionarios(function (err, datos) {
        if (err) {
          alert('No se han podido cargar los concesionarios.');
          return; 
        }
        // ahora que tenemos datos, llamamos recursivamente para mostrarlos
        mostrarTodos();
      });
    return;
  }

  concesionarios.forEach(c => {
    const marcador = L.marker(c.coords, { icon: iconoPorDefecto })
                    .addTo(map)
                    .bindPopup(c.nombre);

    marcadoresConcesionarios.push(marcador);

    // Mostrar popup con botón "Calcular Distancia"
    marcador.on('click', () => mostrarPopupBotonCalcularDistancia(c));
  });

  // Ocultar div de distancia
  const calcularDistanciaDiv = document.getElementById('calcular-distancia');
  if(calcularDistanciaDiv){
    calcularDistanciaDiv.style.display = 'none';
  }
}

// Mostrar popup con botón "Calcular Distancia"
function mostrarPopupBotonCalcularDistancia(c) {
  limpiarMapa();

  obtenerUbicacionUsuario(ubicUsuario => {

    const marcador1 = L.marker(c.coords, { icon: iconoPorDefecto }).addTo(map);
    const marcador2 = L.marker(ubicUsuario, { icon: iconoPorDefecto }).addTo(map);

    marcadoresConcesionarios.push(marcador1, marcador2);

    // Calculamos la distancia desde la ubicacion del usuario hasta la ubicacion del concesionario
    const distancia = L.latLng(ubicUsuario).distanceTo(L.latLng(c.coords));
    const distanciaKm = (distancia / 1000).toFixed(2);

    // Creamos un popun con un boton "Calcular Distancia"
    const popupDiv = document.createElement('div');
    popupDiv.innerHTML = `<strong>${c.nombre}</strong><br>Distancia desde tu ubicación: ${distanciaKm} km<br>`;

    const botonCalcularDistancia = document.createElement('button');
    botonCalcularDistancia.className = 'btn btn-sm btn-primary mt-2';
    botonCalcularDistancia.textContent = 'Calcular Distancia';
    botonCalcularDistancia.addEventListener('click', () => {
      // Mostrar la distancia del usuario al concesionario en el div
      const distanciaDiv = document.getElementById('calcular-distancia');
      if(distanciaDiv){
        distanciaDiv.textContent = `Distancia hasta el concesionario: ${distanciaKm} km`;
        distanciaDiv.style.display = 'block';
      }

      // Eliminamos cualquier ruta en el mapa previamente creada
      if (controladorRutas) {
        controladorRutas.remove();
        controladorRutas = null;
      }

      // Dibujamos la nueva ruta en el mapa
      controladorRutas = L.Routing.control({
        waypoints: [L.latLng(ubicUsuario), L.latLng(c.coords)],
        routeWhileDragging: false,
        addWaypoints: false,
        showAlternatives: false,
        collapsible: true,
        lineOptions: { styles: [{color: '#007bff', weight: 5}] },
        createMarker: function(i, wp, nWps) {
          return L.marker(wp.latLng, { icon: iconoPorDefecto });
        }
      }).addTo(map);

      controladorRutas.getContainer().style.display = 'none'; // ocultamos el panel de informacion de direcciones en la ruta

      map.fitBounds(L.latLngBounds([ubicUsuario, c.coords]), { padding: [50, 50] });
    });

    popupDiv.appendChild(botonCalcularDistancia);
    marcador1.bindPopup(popupDiv).openPopup();
  });
}

// Al clickar al boton, reiniciamos las posicion de todos los concesionarios
document.getElementById('botonReiniciarMapa').addEventListener('click', () => {
  mostrarTodos();
});

// Motramos los concesionarios 
//mostrarTodos();

obtenerConcesionarios(function (err) {
  if (err) {
    console.error('Error cargando concesionarios al inicio:', err);
    
    return;
  }
  mostrarTodos();
});