const checkboxesPrioridad = document.querySelectorAll('.chk-prioridad');
  checkboxesPrioridad.forEach(chk => {
    chk.addEventListener('change', function () {
      if (this.checked) {
        checkboxesPrioridad.forEach(otro => {
          if (otro !== this) otro.checked = false;
        });
      }
    });
});

document.getElementById('formRegistro').addEventListener('submit', async function (e) {
  e.preventDefault();

  const nombre = document.getElementById('nombre').value.trim();
  const materia = document.getElementById('materia').value.trim();
  const estado = document.getElementById('estado').value;
  const prioridadSeleccionada = document.querySelector('.chk-prioridad:checked');
  const mensaje = document.getElementById('mensajeRegistro');

  if (!prioridadSeleccionada) {
    mensaje.textContent = 'Por favor, selecciona un nivel de prioridad.';
    mensaje.className = 'mensaje error';
    return;
    }

  try {
    const respuesta = await fetch('/actividad', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nombre,
        materia,
        estado,
        prioridad: prioridadSeleccionada.value
        })
      });

  const data = await respuesta.json();

  if (!respuesta.ok || !data.ok) {
    mensaje.textContent = data.mensaje || 'Error al registrar la actividad.';
    mensaje.className = 'mensaje error';
    return;
    }

    this.reset();
    mensaje.textContent = `${data.mensaje} (ID: ${data.id})`;
    mensaje.className = 'mensaje exito';
    } catch (error) {
      mensaje.textContent = 'No se pudo conectar con el servidor.';
      mensaje.className = 'mensaje error';
    }
  });