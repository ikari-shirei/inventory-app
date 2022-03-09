var Category = require('../models/category')
var Item = require('../models/item')
var async = require('async')

const { body, validationResult } = require('express-validator')

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

// Post create category
exports.category_create_post = [
  body('name', 'Name must not be empty.').trim().isLength({ min: 1 }).escape(),
  body('Description').optional({ checkFalsy: true }).escape(),

  function (req, res, next) {
    const errors = validationResult(req)

    const category = new Category({
      name: req.body.name,
      description: req.body.description,
    })

    if (!errors.isEmpty()) {
      // There are errors
      res.render('category_form', {
        category: category,
        errors: errors.array(),
      })
      return
    } else {
      category.save(function (err) {
        if (err) {
          return next(err)
        }

        //Successful, return category
        res.redirect(category.url)
      })
    }
  },
]

// Get category delete
exports.category_delete_get = function (req, res, next) {
  Category.findById(req.params.id, function (err, category) {
    if (err) {
      return next(err)
    }

    res.render('category_delete', { category: category })
  })
}

// Post category delete
exports.category_delete_post = function (req, res, next) {
  Category.findByIdAndRemove(req.params.id, function (err) {
    if (err) {
      return next(err)
    }

    res.redirect('/categories')
  })
}

// Get category update
exports.category_update_get = function (req, res, next) {
  Category.findById(req.params.id, function (err, category) {
    if (err) {
      return next(err)
    }

    res.render('category_form', { category: category })
  })
}

// Post category update
exports.category_update_post = [
  body('name', 'Name must not be empty.').trim().isLength({ min: 1 }).escape(),
  body('Description').optional({ checkFalsy: true }).escape(),

  function (req, res, next) {
    const errors = validationResult(req)

    const category = new Category({
      _id: req.params.id,
      name: req.body.name,
      description: req.body.description,
    })

    if (!errors.isEmpty()) {
      res.render('category_form', {
        category: category,
        errors: errors.array(),
      })
      return
    } else {
      Category.findByIdAndUpdate(
        req.params.id,
        category,
        {},
        function (err, thecategory) {
          if (err) {
            return next(err)
          }
          // Category updated
          res.redirect(category.url)
        }
      )
    }
  },
]
