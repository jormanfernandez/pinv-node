const mongoose = global.mongoose;
const categorySchema = new mongoose.Schema({
	created_date: Date,
	nombre: String,
});

const Category = mongoose.model("categories", categorySchema);

module.exports = Category;
