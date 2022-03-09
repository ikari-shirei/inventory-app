var Category = require('../models/category')
var Item = require('../models/item')
var async = require('async')

// Get categories list
exports.category_list_get = function (req, res, next) {
  Category.find().exec(function (err, results) {
    if (err) {
      return next(err)
    }

    // Success
    res.render('list', { title: 'Categories', results: results })
  })
}

// Get category
exports.category_detail_get = function (req, res, next) {
  async.parallel(
    {
      category: function (callback) {
        Category.findById(req.params.id).exec(callback)
      },
      items: function (callback) {
        Item.find({ category: req.params.id }).exec(callback)
      },
    },

    function (err, results) {
      if (err) {
        return next(err)
      }

      // Success
      res.render('category_detail', {
        category: results.category,
        items: results.items,
      })
    }
  )
}

// Get create category
exports.category_create_get = function (req, res, next) {
  res.render('category_form', {})
}
