const express = require('express');
const router = express.Router();
const userRouter = require("./users/middleware");
const personRouter = require("./persons/middleware");
const categoryRouter = require("./category/middleware");
const departmentRouter = require("./department/middleware");
const articleStateRouter = require("./articleState/middleware");
const articleRouter = require("./article/middleware");
const markRouter = require("./marks/middleware");
const inventoryRouter = require("./inventory/middleware");
const reportRouter = require("./reports/middleware");

/**/
// Middlewares
console.log(`********* Setting User Middlewares`);
userRouter.forEach(route => router.use("/user", route));
console.log(`********* Done setting User Middlewares`);

console.log(`********* Setting Person Middlewares`);
personRouter.forEach(route => router.use("/person", route));
console.log(`********* Done setting Person Middlewares`);

console.log(`********* Setting Category Middlewares`);
categoryRouter.forEach(route => router.use("/category", route));
console.log(`********* Done setting Category Middlewares`);

console.log(`********* Setting Department Middlewares`);
departmentRouter.forEach(route => router.use("/department", route));
console.log(`********* Done setting Department Middlewares`);

console.log(`********* Setting Article State Middlewares`);
articleStateRouter.forEach(route => router.use("/article/state", route));
console.log(`********* Done setting Article State Middlewares`);

console.log(`********* Setting Article Middlewares`);
articleRouter.forEach(route => router.use("/article", route));
console.log(`********* Done setting Article Middlewares`);

console.log(`********* Setting Marks Middlewares`);
markRouter.forEach(route => router.use("/mark", route));
console.log(`********* Done setting Marks Middlewares`);

console.log(`********* Setting Inventory Middlewares`);
inventoryRouter.forEach(route => router.use("/inventory", route));
console.log(`********* Done setting Inventory Middlewares`);

console.log(`********* Setting Reports Middlewares`);
reportRouter.forEach(route => router.use("/report", route));
console.log(`********* Done setting Reports Middlewares`);

router.use("*", (req, res) => {
	res.send({
		code: 500,
		message: `Ruta equivocada`
	});
});
/**/

module.exports = router;
