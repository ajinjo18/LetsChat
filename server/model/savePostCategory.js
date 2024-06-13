const mongoose = require("mongoose");

const savePostCategorySchema = new mongoose.Schema(
  {
    name: String,
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'userCollection'
    },
    savedPost: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'postCollection'
    }]
  },
  { timestamps: true }
);

module.exports = mongoose.model("savepostcategory", savePostCategorySchema);