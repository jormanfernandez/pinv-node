const mongoose = global.mongoose;
const categorySchema = new mongoose.Schema({
	nombre: String,
	created_date: Date
});

const Category = mongoose.model("categories", categorySchema);

module.exports = Category;
