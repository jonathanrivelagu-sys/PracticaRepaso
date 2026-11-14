const db = require('../config/database');

async function registrarActividad(nombre, materia, estado, prioridad) {
  const sql = `
    INSERT INTO actividades (nombre, materia, estado, prioridad)
    VALUES (?, ?, ?, ?)
  `;

  const [resultado] = await db.execute(sql, [
    nombre,
    materia,
    estado,
    prioridad
  ]);

  return resultado.insertId;
}

async function consultarActividades(termino, filtros) {
  const columnasPermitidas = ['nombre', 'materia', 'estado', 'prioridad'];
  const columnasValidas = filtros.filter(col => columnasPermitidas.includes(col));

  if (!termino) {
    const [filas] = await db.execute('SELECT * FROM actividades ORDER BY id DESC');
    return filas;
  }

  const condiciones = columnasValidas.map(col => `${col} LIKE ?`).join(' OR ');
  const parametros = columnasValidas.map(() => `%${termino}%`);

  const sql = `SELECT * FROM actividades WHERE ${condiciones} ORDER BY id DESC`;
  const [filas] = await db.execute(sql, parametros);

  return filas;
}

async function modificarActividad(id, nombre, materia, estado, prioridad) {
  const sql = `
    UPDATE actividades
    SET nombre = ?, materia = ?, estado = ?, prioridad = ?
    WHERE id = ?
  `;

  const [resultado] = await db.execute(sql, [
    nombre,
    materia,
    estado,
    prioridad,
    id
  ]);

  return resultado.affectedRows;
}

async function eliminarActividad(id) {
  const sql = 'DELETE FROM actividades WHERE id = ?';
  const [resultado] = await db.execute(sql, [id]);

  return resultado.affectedRows;
}

module.exports = {
  registrarActividad,
  consultarActividades,
  modificarActividad,
  eliminarActividad
};