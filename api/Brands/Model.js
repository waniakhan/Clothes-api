const { Schema, model } = require('mongoose');

const BrandSchema = new Schema(
  {
    BrandName: {
      type: String,
      unique: true,
      required: true,
    },
  BrandImage: {
      type: String,
      required: true
  }
  },
  { timestamps: true } // This option adds createdAt and updatedAt fields
);

const Brand = model('Brand', BrandSchema);
module.exports = Brand;