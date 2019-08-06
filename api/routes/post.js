const express = require('express');
const router = express.Router();
const userRouter = require("./users_post/middleware");

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
/**/

module.exports = router;
