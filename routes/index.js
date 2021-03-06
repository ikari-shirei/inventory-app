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

// GET category creation page
router.get('/create/category', category_controller.category_create_get)

// GET category delete page
router.get('/categories/:id/delete', category_controller.category_delete_get)

// GET category delete page
router.get('/categories/:id/update', category_controller.category_update_get)

/* ITEMS */

// GET items
router.get('/items', item_controller.item_list_get)

// GET item detail
router.get('/items/:id', item_controller.item_detail_get)

// GET item creation page
router.get('/create/item', item_controller.item_create_get)

// GET item delete
router.get('/items/:id/delete', item_controller.item_delete_get)

// GET item update
router.get('/items/:id/update', item_controller.item_update_get)

module.exports = router
