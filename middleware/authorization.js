const jwt = require("jsonwebtoken");
require("dotenv").config()

module.exports = async (req,res,next) => {
	try{

		const token = req.header("jwt_token");
		console.log(token);

		if (!token){
			return res.status(403).json("Not Authorize in Token");
		}
		
		//this checks if token is valid
		const payload = jwt.verify(token,process.env.jwtSecret);

		req.user = payload.user;

	}catch(err){
		console.error(err.message);
		return res.status(403).json("Not Authorize in Error Message");
	}

	next(); 
};