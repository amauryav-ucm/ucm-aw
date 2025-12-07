# Aplicación de Gestión de Concesionarios de Vehículos Eléctricos - PureVolt

Esta aplicación permite gestionar concesionarios de vehículos eléctricos, sus usuarios, reservas y los vehiculos electricos de cada concesionario.

------------------------------------------------------------------

## 1. Características principales de la web

### Página de inicio

* **Texto de beneficios** sobre el uso de vehículos eléctricos
* **Carrusel de opiniones** de clientes sobre reservas que han realizado
* **Mapa interactivo** que muestra las ubicaciones de los concesionarios y si se obtiene el permiso tambien muestra la ubicación del usuario. También, se calcular la ruta y la distancia desde la ubicación del usuario hasta el conecsionario seleccionado

### Navegación (antes de iniciar sesión)

* **Inicio**
* **Accesibilidad** (cambio de tema, tamaño de letra y daltonismo).
* **Icono de perfil**:
  * Se abre un vista lateral donde el usuario puede **iniciar sesión** introduciendo correo y contraseña
  * También, permite **registrarse** si el usuario no tiene cuenta creada

------------------------------------------------------------------

## 2. Roles de usuario

### Empleado

* Puede **ver vehículos** disponibles de su concesionario
* Puede **realizar reservas** de algun coche eléctrico
* Puede **consultar sus reservas** del concesionario asignado

### Administrador

Incluye todas las funciones del empleado, y además:

* Acceso al **panel de administración**
* Secciones de para:
  * **Usuarios** (se lista los usuarios de la BBDD y permite cargar nuevos usuarios)
  * **Vehículos** (se listan los vehiculos de la BBDD, se permite editar, dar de baja o añadir vehiculos de forma manual)
  * **Concesionarios** (se listan los concesionarios de la BBDD, se permite editar, dar de baja o añadir concesionarios de forma manual)
  * **Reservas** (se listan los reservas de la BBDD, se permite editar, dar de baja o añadir reservas de forma manual)
  * **Estadísticas** (se muestra una vista con muchas estadisticas de interes para el administrador)
* En las secciones de usuarios, vehículos y concesionarios se puede **subir un archivo JSON** para insertar o modificar elementos de cada tabla.

---------------------------------------------------------------------

## 3. Funcionalidades principales del sistema

### Autenticación

* Registro con datos básicos
* Login mediante correo y contraseña
* Las preferencias de accesibilidad se guardan en BBDD y permanecen durate la sesión

### Gestión de vehículos eléctricos

* Listado general para usuarios
* Listado filtrado por concesionario para empleados
* Estados del vehículo: disponible, reservado, mantenimiento

### Gestión de reservas

* Crear, consultar y finalizar reservas.
* Visualizar reservas propias (empleado) o todas (admin).
* Registro de kilometraje, incidencias y valoración.

### Panel de administración

Incluye módulos de administración con CRUD extendido mediante carga de JSON:

* **Usuarios**
* **Vehículos**
* **Concesionarios**
* **Reservas**

------------------------------------------------------------------

## 4. Base de datos

Tablas:

* `usuarios`
* `vehiculos`
* `reservas`
* `concesionarios`

------------------------------------------------------------------

## 5. Flujo de uso

1. El usuario accede a la página de inicio
2. Puede consultar beneficios, opiniones y concesionarios
3. Accede al menú de perfil y se registra o inicia sesión
4. Según su rol:
   * **Empleado:** consulta vehículos de su concesionario, crea reservas y revisa sus propias reservas
   * **Administrador:** accede al panel completo, gestiona toda la información acerca de las tablas de la BBDD y consulta estadísticas
5. El administrador puede subir JSONs para actualizar datos




