const Pool = require("pg").Pool

const devConfig = new Pool({
	user: "postgres",
	password: "admin",
	host: "localhost",
	port: 5432,
	database: "partyweb"
});


const proConfig = {
	connectionString: process.env.DATABASE_URL,
	ssl: {
        rejectUnauthorized: false,
    }
}

const pool = new Pool(process.env.NODE_ENV === "production" ? proConfig : devConfig );
module.exports = pool;