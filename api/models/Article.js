const mongoose = global.mongoose;
const articleStateSchema = new mongoose.Schema({
	nombre: String,
	serial: String,
	category: {type: mongoose.Schema.Types.ObjectId, ref: "categories"},
	mark: {type: mongoose.Schema.Types.ObjectId, ref: "marks"},
	state: {type: mongoose.Schema.Types.ObjectId, ref: "article_state"},
	created_date: Date
});

const Article = mongoose.model("marks", articleStateSchema);

module.exports = Article;
