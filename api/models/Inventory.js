const mongoose = global.mongoose;
const inventorySchema = new mongoose.Schema({
	department: {
		type: mongoose.Schema.Types.ObjectId, 
		ref: "departments"
	},
	state: {
		type: mongoose.Schema.Types.ObjectId, 
		ref: "article_state"
	},
	article: {
		type: mongoose.Schema.Types.ObjectId, 
		ref: "articles"
	},
	person: {
		type: mongoose.Schema.Types.ObjectId, 
		ref: "personas"
	},
	assigned: Boolean,
	puesto: Number,
	created: Date,
	note: String,
});

const Inventory = mongoose.model("inventory", inventorySchema);

module.exports = Inventory;
