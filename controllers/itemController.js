var Category = require('../models/category')
var Item = require('../models/item')
var async = require('async')

const { body, validationResult } = require('express-validator')

// Get categories list
exports.item_list_get = function (req, res, next) {
  Item.find().exec(function (err, results) {
    if (err) {
      return next(err)
    }

    // Success
    res.render('list', { title: 'All items', results: results })
  })
}

//Get item detail
exports.item_detail_get = function (req, res, next) {
  Item.findById(req.params.id)
    .populate('category', 'name')
    .exec(function (err, result) {
      if (err) {
        return next(err)
      }

      // Success
      res.render('item_detail_get', { item: result })
    })
}

//Get item creation page
exports.item_create_get = function (req, res, next) {
  Category.find().exec(function (err, results) {
    if (err) {
      return next(err)
    }

    // Success
    res.render('item_form', { categories: results })
  })
}

//Get item creation page
exports.item_create_post = [
  body('name', 'Name must not be empty.').trim().isLength({ min: 1 }).escape(),
  body('Description').optional({ checkFalsy: true }).escape(),
  body('model', 'model must not be empty.')
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body('year', 'year must not be empty.').trim().isLength({ min: 1 }).escape(),
  body('category').escape(),
  body('number_in_stock', 'number_in_stock must not be empty.')
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body('price', 'price must not be empty.')
    .trim()
    .isLength({ min: 1 })
    .escape(),

  (req, res, next) => {
    const errors = validationResult(req)

    const item = new Item({
      name: req.body.name,
      description: req.body.description,
      model: req.body.model,
      year: req.body.year,
      category: req.body.category,
      number_in_stock: req.body.number_in_stock,
      price: req.body.price,
    })

    if (!errors.isEmpty()) {
      Category.find().exec(function (err, results) {
        if (err) {
          return next(err)
        }

        // Success
        res.render('item_form', {
          categories: results,
          item: item,
          errors: errors.array(),
        })
      })
      return
    } else {
      item.save(function (err) {
        if (err) {
          return next(err)
        }

        // Succesful go to item page
        res.redirect(item.url)
      })
    }
  },
]
