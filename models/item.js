const mongoose = require('mongoose')

const Schema = mongoose.Schema

const ItemSchema = new Schema({
  name: { type: String, required: true, maxLength: 100 },
  description: { type: String, maxLength: 300 },
  model: { type: String, required: true, maxLength: 100 },
  year: { type: Number, required: true, maxLength: 4 },
  category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
  number_in_stock: { type: Number, required: true, maxLength: 10 },
  price: { type: Number, required: true, maxLength: 15 },
})

// Url
ItemSchema.virtual('url').get(function () {
  return '/items/' + this._id
})

module.exports = mongoose.model('Item', ItemSchema)
