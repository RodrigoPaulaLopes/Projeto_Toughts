const express = require('express')
const router = express.Router()
const ToughtsController = require('../controllers/ToughtsController')

const checkAuth = require('../helpers/auth').checkAuth

router.get('/dashboard', checkAuth, ToughtsController.dashboard)
router.get('/buscarPensamento/:id', checkAuth, ToughtsController.buscarPensamento)
router.post('/remover', checkAuth, ToughtsController.removerPensamentos)
router.get('/registrarPensamentos', checkAuth, ToughtsController.registrarPensamentos)
router.post('/registrarEditarPensamentosPost', checkAuth, ToughtsController.registrarEditarPensamentosPost)
router.get('/', ToughtsController.showToughts)
module.exports = router