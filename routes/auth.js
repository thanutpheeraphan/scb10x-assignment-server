const router = require("express").Router()
const pool = require("../db");
const bcrypt = require("bcrypt");
const jwtGenerator = require("../utils/jwtGenerator");
const validInfo = require("../middleware/validInfo");
const authorization = require("../middleware/authorization");



router.post("/register", validInfo, async(req,res)=>{
	try{

		//1.destructure the req.body(name,email,password)

		const {email,password} = req.body;

		//2. check if user exist (if user exist then throw error)

		const user = await pool.query("SELECT * FROM users WHERE user_email = $1", [email]);

		// res.json(user.rows)

		if(user.rows.length !== 0){
			return res.status(401).json("User already exist!")
		}
		//3. bcrypt the user password

		const saltRounds = 10; //how encrypted it is gonna be
		const salt = await bcrypt.genSalt(saltRounds);

		const bcryptPassword = await bcrypt.hash(password,salt);

		//4. enter the new user inside the database

		let newUser = await pool.query("INSERT INTO users ( user_email, user_password) VALUES ($1, $2) RETURNING * ",[email,bcryptPassword]);
		
		// res.json(newUser.rows[0]);
		//5. generating the token

		const jwtToken = jwtGenerator(newUser.rows[0].user_id);
		return res.json({ jwtToken });

	}catch(err){
		console.error(err.message);
		res.status(500).send("Server Error");
	}
})

router.post("/login", validInfo , async (req,res)=>{
	try{
		
		//1. destructure the req.body

		const {email,password} = req.body;

		//2. check if user doesnt exist (if not we throw error)

		const user = await pool.query("SELECT * FROM users WHERE user_email = $1",[email]);

		if(user.rows.length == 0){
			return res.status(401).json("Password or Email is incorrect!");
		}

		//3. check if incoming password is the same as the database password

		const validPassword = await bcrypt.compare(password, user.rows[0].user_password);

		if (!validPassword){
			return res.status(401).json("Invalid Credentials");
		}
		//4. give them jwt token

		const jwtToken = jwtGenerator(user.rows[0].user_id);
		const userId = user.rows[0].user_id;
		const userEmail = user.rows[0].user_email;

		return res.json({ jwtToken , userId , userEmail});
		
	}catch(err){
		console.error(err.message);
		res.status(500).send("Server Error");
	}
})

router.get("/verify", authorization, async (req,res)=>{
	try{

		res.json(true);

	}catch(err){
		console.error(err.message);
		res.status(500).send("Server Error");
	}
})

module.exports = router;