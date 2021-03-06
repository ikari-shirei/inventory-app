var Category = require('../models/category')
var Item = require('../models/item')
var async = require('async')

const { body, validationResult } = require('express-validator')
const item = require('../models/item')
const { find } = require('../models/category')

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

//Get item delete page
exports.item_delete_get = function (req, res, next) {
  Item.findById(req.params.id)
    .populate('category')
    .exec(function (err, item) {
      if (err) {
        return next(err)
      }

      // Successful
      res.render('item_delete', { item: item })
    })
}

//Post item delete
exports.item_delete_post = function (req, res, next) {
  Item.findByIdAndRemove(req.params.id, function (err) {
    if (err) {
      return next(err)
    }

    // Item deleted
    res.redirect('/items')
  })
}

//Get item update
exports.item_update_get = function (req, res, next) {
  async.parallel(
    {
      item: function (callback) {
        Item.findById(req.params.id).populate('category').exec(callback)
      },
      categories: function (callback) {
        Category.find().exec(callback)
      },
    },
    function (err, results) {
      if (err) {
        return next(err)
      }

      res.render('item_form', {
        item: results.item,
        categories: results.categories,
      })
    }
  )
}

//Post item update
exports.item_update_post = [
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
      _id: req.params.id,
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
      Item.findByIdAndUpdate(req.params.id, item, {}, function (err, theitem) {
        if (err) {
          return next(err)
        }

        // Item updated
        res.redirect(item.url)
      })
    }
  },
]
