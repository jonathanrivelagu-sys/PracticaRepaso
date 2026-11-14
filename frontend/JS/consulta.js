    const resCheckboxes = document.querySelectorAll('.res-chk-prioridad');
    const mensaje = document.getElementById('mensajeConsulta');
    const contenedorCoincidencias = document.getElementById('contenedorCoincidencias');
    const selectCoincidencias = document.getElementById('selectCoincidencias');
    let resultadosActuales = [];

    resCheckboxes.forEach(chk => {
      chk.addEventListener('change', function () {
        if (this.checked) {
          resCheckboxes.forEach(otro => {
            if (otro !== this) otro.checked = false;
          });
        }
      });
    });

    function mostrarMensaje(texto, tipo) {
      mensaje.textContent = texto;
      mensaje.className = `mensaje ${tipo}`;
    }

    function limpiarCampos() {
      document.getElementById('actividadId').value = '';
      document.getElementById('resNombre').value = '';
      document.getElementById('resMateria').value = '';
      document.getElementById('resEstado').value = '';
      resCheckboxes.forEach(chk => chk.checked = false);
    }

    function cargarActividadEnCampos(actividad) {
      document.getElementById('actividadId').value = actividad.id;
      document.getElementById('resNombre').value = actividad.nombre;
      document.getElementById('resMateria').value = actividad.materia;
      document.getElementById('resEstado').value = actividad.estado;
      resCheckboxes.forEach(chk => {
        chk.checked = (chk.value.toLowerCase() === actividad.prioridad.toLowerCase());
      });
    }

    // Consultar en MySQL mediante GET /actividades
    document.getElementById('btnBuscar').addEventListener('click', async function () {
      const termino = document.getElementById('inputBusqueda').value.trim();
      const filtrosMarcados = Array.from(document.querySelectorAll('input[name="filtro"]:checked')).map(f => f.value);

      mensaje.className = 'mensaje';

      if (filtrosMarcados.length === 0) {
        mostrarMensaje('Selecciona al menos un filtro lateral para buscar.', 'error');
        return;
      }

      try {
        const params = new URLSearchParams({
          termino,
          filtros: filtrosMarcados.join(',')
        });

        const respuesta = await fetch(`/actividades?${params.toString()}`);
        const data = await respuesta.json();

        if (!respuesta.ok || !data.ok) {
          mostrarMensaje(data.mensaje || 'Error al realizar la consulta.', 'error');
          return;
        }

        resultadosActuales = data.actividades;

        if (resultadosActuales.length === 0) {
          limpiarCampos();
          contenedorCoincidencias.style.display = 'none';
          mostrarMensaje('No se encontraron actividades con esos criterios.', 'error');
          return;
        }

        cargarActividadEnCampos(resultadosActuales[0]);

        if (resultadosActuales.length > 1) {
          selectCoincidencias.innerHTML = '';
          resultadosActuales.forEach((act, index) => {
            const option = document.createElement('option');
            option.value = index;
            option.textContent = `[#${act.id}] ${act.nombre} - ${act.materia} (${act.estado} | ${act.prioridad})`;
            selectCoincidencias.appendChild(option);
          });
          contenedorCoincidencias.style.display = 'block';
        } else {
          contenedorCoincidencias.style.display = 'none';
        }

        mostrarMensaje(`Se encontraron ${resultadosActuales.length} coincidencia(s).`, 'exito');
      } catch (error) {
        mostrarMensaje('No se pudo conectar con el servidor.', 'error');
      }
    });

    selectCoincidencias.addEventListener('change', function () {
      const indice = parseInt(this.value, 10);
      if (!isNaN(indice) && resultadosActuales[indice]) {
        cargarActividadEnCampos(resultadosActuales[indice]);
      }
    });

    // Modificar en MySQL mediante PUT /actividad/:id
    document.getElementById('btnModificar').addEventListener('click', async function () {
      const id = Number(document.getElementById('actividadId').value);
      if (!id) {
        mostrarMensaje('Primero consulta una actividad para poder modificarla.', 'error');
        return;
      }

      const nombre = document.getElementById('resNombre').value.trim();
      const materia = document.getElementById('resMateria').value.trim();
      const estado = document.getElementById('resEstado').value;
      const prioridadChk = document.querySelector('.res-chk-prioridad:checked');

      if (!nombre || !materia || !estado || !prioridadChk) {
        mostrarMensaje('Todos los campos deben estar completos para modificar.', 'error');
        return;
      }

      try {
        const respuesta = await fetch(`/actividad/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            nombre,
            materia,
            estado,
            prioridad: prioridadChk.value
          })
        });

        const data = await respuesta.json();

        if (!respuesta.ok || !data.ok) {
          mostrarMensaje(data.mensaje || 'Error al modificar la actividad.', 'error');
          return;
        }

        mostrarMensaje(data.mensaje, 'exito');
      } catch (error) {
        mostrarMensaje('No se pudo conectar con el servidor.', 'error');
      }
    });

    // Eliminar en MySQL mediante DELETE /actividad/:id
    document.getElementById('btnEliminar').addEventListener('click', async function () {
      const id = Number(document.getElementById('actividadId').value);
      if (!id) {
        mostrarMensaje('Primero consulta una actividad para poder eliminarla.', 'error');
        return;
      }

      try {
        const respuesta = await fetch(`/actividad/${id}`, {
          method: 'DELETE'
        });

        const data = await respuesta.json();

        if (!respuesta.ok || !data.ok) {
          mostrarMensaje(data.mensaje || 'Error al eliminar la actividad.', 'error');
          return;
        }

        limpiarCampos();
        contenedorCoincidencias.style.display = 'none';
        mostrarMensaje(data.mensaje, 'exito');
      } catch (error) {
        mostrarMensaje('No se pudo conectar con el servidor.', 'error');
      }
    });