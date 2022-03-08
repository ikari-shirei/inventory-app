var Category = require('../models/category')
var Item = require('../models/item')
var async = require('async')

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
