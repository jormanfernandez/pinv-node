const mongoose = global.mongoose;
const articleStateSchema = new mongoose.Schema({
	category: {
		type: mongoose.Schema.Types.ObjectId, 
		ref: "categories"
	},
	mark: {
		type: mongoose.Schema.Types.ObjectId, 
		ref: "marks"
	},
	state: {
		type: mongoose.Schema.Types.ObjectId, 
		ref: "article_state"
	},
	created_date: Date,
	nombre: String,
	serial: String,
});

const Article = mongoose.model("articles", articleStateSchema);

module.exports = Article;
