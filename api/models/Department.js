const mongoose = global.mongoose;
const departmentSchema = new mongoose.Schema({
	nombre: String,
	created_date: Date
});

const Department = mongoose.model("department", departmentSchema);

module.exports = Department;
