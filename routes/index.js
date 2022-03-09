var express = require('express')
var router = express.Router()

const category_controller = require('../controllers/categoryController')
const item_controller = require('../controllers/itemController')

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', {})
})

/* Categories */

// GET category list
router.get('/categories', category_controller.category_list_get)

//GET category detail
router.get('/categories/:id', category_controller.category_detail_get)

/* ITEMS */

// GET items
router.get('/items', item_controller.item_list_get)

// GET item detail
router.get('/items/:id', item_controller.item_detail_get)

// GET item creation page
router.get('/create/item', item_controller.item_create_get)

// POST item creation page
router.post('/create/item', item_controller.item_create_post)

module.exports = router
