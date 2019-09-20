const mongoose = global.mongoose;
const articleStateSchema = new mongoose.Schema({
	nombre: String,
	created_date: Date
});

const ArticleState = mongoose.model("article_state", articleStateSchema);

module.exports = ArticleState;
