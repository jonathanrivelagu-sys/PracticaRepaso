const express = require('express');
const router = express.Router();
const actividadesController = require('../controllers/actividadesController');

router.get('/', (req, res) => res.redirect('/registro.html'));
router.post('/actividad', actividadesController.registrarActividad);
router.get('/actividades', actividadesController.consultarActividades);
router.put('/actividad/:id', actividadesController.modificarActividad);
router.delete('/actividad/:id', actividadesController.eliminarActividad);

module.exports = router;