const express = require('express');
const router = express.Router();
const userRouter = require("./users/middleware");
const personRouter = require("./persons/middleware");

/**/
// Middlewares
console.log(`********* Setting Post User Middlewares`);
userRouter.forEach(route => router.use("/user", route));
router.use("/user/*", (req, res) => {
	res.send({
		code: 500,
		message: `Ruta equivocada`
	});
});
console.log(`********* Done setting Post User Middlewares`);

console.log(`********* Setting Post Person Middlewares`);
personRouter.forEach(route => router.use("/person", route));
router.use("/person/*", (req, res) => {
	res.send({
		code: 500,
		message: `Ruta equivocada`
	});
});
console.log(`********* Done setting Post Person Middlewares`);
/**/

module.exports = router;
