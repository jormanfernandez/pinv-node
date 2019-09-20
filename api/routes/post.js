const express = require('express');
const router = express.Router();
const userRouter = require("./users/middleware");
const personRouter = require("./persons/middleware");
const categoryRouter = require("./category/middleware");
const departmentRouter = require("./department/middleware");
const articleStateRouter = require("./articleState/middleware");

/**/
// Middlewares
console.log(`********* Setting User Middlewares`);
userRouter.forEach(route => router.use("/user", route));
router.use("/user/*", (req, res) => {
	res.send({
		code: 500,
		message: `Ruta equivocada`
	});
});
console.log(`********* Done setting User Middlewares`);

console.log(`********* Setting Person Middlewares`);
personRouter.forEach(route => router.use("/person", route));
router.use("/person/*", (req, res) => {
	res.send({
		code: 500,
		message: `Ruta equivocada`
	});
});
console.log(`********* Done setting Person Middlewares`);

console.log(`********* Setting Category Middlewares`);
categoryRouter.forEach(route => router.use("/category", route));
router.use("/category/*", (req, res) => {
	res.send({
		code: 500,
		message: `Ruta equivocada`
	});
});
console.log(`********* Done setting Category Middlewares`);

console.log(`********* Setting Department Middlewares`);
departmentRouter.forEach(route => router.use("/department", route));
router.use("/department/*", (req, res) => {
	res.send({
		code: 500,
		message: `Ruta equivocada`
	});
});
console.log(`********* Done setting Department Middlewares`);

console.log(`********* Setting Article Middlewares`);
articleStateRouter.forEach(route => router.use("/article/state", route));
router.use("/article/state/*", (req, res) => {
	res.send({
		code: 500,
		message: `Ruta equivocada`
	});
});

router.use("/article/*", (req, res) => {
	res.send({
		code: 500,
		message: `Ruta equivocada`
	});
});
console.log(`********* Done setting Article Middlewares`);
/**/

module.exports = router;
