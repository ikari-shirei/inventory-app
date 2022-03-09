var express = require('express')
var router = express.Router()

const category_controller = require('../controllers/categoryController')
const item_controller = require('../controllers/itemController')

/* CATEGORY DANGER ZONE */

// POST category creation page
router.post('/create/category', category_controller.category_create_post)

// POST category delete page
router.post('/categories/:id/delete', category_controller.category_delete_post)

// GET category delete page
router.post('/categories/:id/update', category_controller.category_update_post)

/* ITEM DANGER ZONE*/

// POST item creation page
router.post('/create/item', item_controller.item_create_post)

// POST item delete
router.post('/items/:id/delete', item_controller.item_delete_post)

// POST item update
router.post('/items/:id/update', item_controller.item_update_post)

module.exports = router
