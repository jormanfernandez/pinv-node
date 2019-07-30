const mongoose = global.mongoose;
const personSchema = new mongoose.Schema({
	nombre: String,
	apellido: String,
	cedula: Number,
	created_date: Date
});

const Person = mongoose.model("personas", personSchema);

module.exports = Person;
