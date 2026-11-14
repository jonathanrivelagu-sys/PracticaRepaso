const actividadModel = require('../models/actividadModel');

const ESTADOS_VALIDOS = ['Completo', 'Incompleto', 'Pendiente'];
const PRIORIDADES_VALIDAS = ['Alta', 'Media', 'Baja'];

async function registrarActividad(req, res) {
  try {
    const { nombre, materia, estado, prioridad } = req.body;

    const nom = nombre ? nombre.trim() : '';
    const mat = materia ? materia.trim() : '';
    const est = estado ? estado.trim() : '';
    const prio = prioridad ? prioridad.trim() : '';

    if (
      !nom ||
      !mat ||
      !ESTADOS_VALIDOS.includes(est) ||
      !PRIORIDADES_VALIDAS.includes(prio)
    ) {
      return res.status(400).json({
        ok: false,
        mensaje: 'Todos los campos son obligatorios y deben tener valores válidos.'
      });
    }

    const id = await actividadModel.registrarActividad(nom, mat, est, prio);

    return res.status(201).json({
      ok: true,
      id,
      mensaje: 'Actividad registrada correctamente en la base de datos.'
    });
  } catch (error) {
    console.error('Error al registrar la actividad:', error);
    return res.status(500).json({
      ok: false,
      mensaje: 'Error 500: Ocurrió un fallo en el servidor al registrar la actividad.'
    });
  }
}

async function consultarActividades(req, res) {
  try {
    const termino = req.query.termino ? req.query.termino.trim() : '';
    const filtrosRaw = req.query.filtros ? req.query.filtros.split(',') : [];

    if (filtrosRaw.length === 0) {
      return res.status(400).json({
        ok: false,
        mensaje: 'Selecciona al menos un filtro lateral para buscar.'
      });
    }

    const actividades = await actividadModel.consultarActividades(termino, filtrosRaw);

    return res.status(200).json({
      ok: true,
      actividades
    });
  } catch (error) {
    console.error('Error al consultar actividades:', error);
    return res.status(500).json({
      ok: false,
      mensaje: 'Error 500: Ocurrió un fallo en el servidor al consultar.'
    });
  }
}

async function modificarActividad(req, res) {
  try {
    const id = Number(req.params.id);
    const { nombre, materia, estado, prioridad } = req.body;

    const nom = nombre ? nombre.trim() : '';
    const mat = materia ? materia.trim() : '';
    const est = estado ? estado.trim() : '';
    const prio = prioridad ? prioridad.trim() : '';

    if (
      !Number.isInteger(id) || id <= 0 ||
      !nom ||
      !mat ||
      !ESTADOS_VALIDOS.includes(est) ||
      !PRIORIDADES_VALIDAS.includes(prio)
    ) {
      return res.status(400).json({
        ok: false,
        mensaje: 'Datos inválidos o incompletos para modificar la actividad.'
      });
    }

    const filasAfectadas = await actividadModel.modificarActividad(id, nom, mat, est, prio);

    if (filasAfectadas === 0) {
      return res.status(404).json({
        ok: false,
        mensaje: 'No se encontró la actividad especificada.'
      });
    }

    return res.status(200).json({
      ok: true,
      mensaje: 'Actividad modificada con éxito.'
    });
  } catch (error) {
    console.error('Error al modificar la actividad:', error);
    return res.status(500).json({
      ok: false,
      mensaje: 'Error 500: Ocurrió un fallo en el servidor al modificar.'
    });
  }
}

async function eliminarActividad(req, res) {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({
        ok: false,
        mensaje: 'ID de actividad inválido.'
      });
    }

    const filasAfectadas = await actividadModel.eliminarActividad(id);

    if (filasAfectadas === 0) {
      return res.status(404).json({
        ok: false,
        mensaje: 'La actividad ya no existe en la base de datos.'
      });
    }

    return res.status(200).json({
      ok: true,
      mensaje: 'Actividad eliminada correctamente.'
    });
  } catch (error) {
    console.error('Error al eliminar la actividad:', error);
    return res.status(500).json({
      ok: false,
      mensaje: 'Error 500: Ocurrió un fallo en el servidor al eliminar.'
    });
  }
}

module.exports = {
  registrarActividad,
  consultarActividades,
  modificarActividad,
  eliminarActividad
};