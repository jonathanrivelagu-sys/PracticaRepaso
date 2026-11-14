const express = require('express');
const path = require('path');
require('dotenv').config();

const actividadRoutes = require('./routes/actividadRoutes');

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend')));

app.use(actividadRoutes);

app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en: http://localhost:${PORT}`);
});