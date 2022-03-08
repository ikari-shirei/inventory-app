#! /usr/bin/env node

console.log('Add models to database')

// Get arguments passed on command line
require('dotenv').config()
/*
if (!userArgs[0].startsWith('mongodb')) {
    console.log('ERROR: You need to specify a valid mongodb URL as the first argument');
    return
}
*/
var async = require('async')
var Item = require('./models/item')
var Category = require('./models/category')

var mongoose = require('mongoose')
var mongoDB = process.env.DB_CONNECT
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = global.Promise
var db = mongoose.connection
db.on('error', console.error.bind(console, 'MongoDB connection error:'))

var items = []
var categories = []

function itemCreate(
  name,
  description,
  model,
  year,
  category,
  number_in_stock,
  price,
  cb
) {
  var item = new Item({
    name: name,
    description: description,
    model: model,
    year: year,
    category: category,
    number_in_stock: number_in_stock,
    price: price,
  })

  item.save(function (err) {
    if (err) {
      cb(err, null)
      return
    }
    console.log('New Item: ' + item)
    items.push(item)
    cb(null, item)
  })
}

function categoryCreate(name, description, cb) {
  var category = new Category({
    name: name,
    description: description,
  })

  category.save(function (err) {
    if (err) {
      cb(err, null)
      return err
    }
    console.log('New Category: ' + category)
    categories.push(category)
    cb(null, category)
  })
}
/* 
function createCategories(cb) {
  async.series(
    [
      function (callback) {
        categoryCreate('Post-Modern Cars', 'They are futuristic.', callback)
      },
      function (callback) {
        categoryCreate('Modern Cars', 'They are normal.', callback)
      },
      function (callback) {
        categoryCreate('Old Cars', 'They are old.', callback)
      },
      function (callback) {
        categoryCreate('Classic Cars', 'They look good.', callback)
      },
    ],

    // optional callback
    cb
  )
} */

function createItems(cb) {
  async.series(
    [
      function (callback) {
        itemCreate(
          'Mercedes',
          '',
          'CL600',
          2003,
          '6227b78a9380f9c76bf8ca5f',
          1,
          9000,
          callback
        )
      },
      function (callback) {
        itemCreate(
          'Jaguar',
          'Good one',
          'S-Type R',
          2004,
          '6227b78a9380f9c76bf8ca5f',
          1,
          16000,
          callback
        )
      },
    ],

    // optional callback
    cb
  )
}

async.series(
  [/* createCategories, */ createItems],
  // Optional callback
  function (err, results) {
    if (err) {
      console.log('FINAL ERR: ' + err)
    } else {
      console.log('items: ' + items)
    }
    // All done, disconnect from database
    mongoose.connection.close()
  }
)
