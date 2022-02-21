const router = require("express").Router();
const pool = require("../db");

router.post("/createroom", async (req, res) => {
  try {

    const { room_uri, room_members, room_name } = req.body;

    let room_id = 1;
    let active_members = 0;
    while (true) {
      room_id = Math.floor(Math.random() * 899999 + 100000);
      let newId = await pool.query(
        "SELECT exists (SELECT 1 FROM parties WHERE room_id = $1 LIMIT 1)",
        [room_id]
      );
      if (!newId.rows[0].exists) {
        break;
      }
    }
    let newRoom = await pool.query(
      "INSERT INTO parties (room_id, room_uri, room_members, room_name , active_members) VALUES ($1, $2 , $3, $4 , $5) RETURNING * ",
      [room_id, room_uri, room_members, room_name, active_members]
    );

    return res.status(200).json(newRoom.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

router.get("/getrooms", async (req, res) => {
  try {
    const roomsfromdb = pool.query(
      "SELECT * FROM parties ORDER BY room_name ASC"
    );
    res.status(200).json((await roomsfromdb).rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

router.get("/getroom", async (req, res) => {
  try {

    const roomfromdb = pool.query(
      "SELECT * FROM parties WHERE (room_id = $1)",
      [req.query.roomId]
    );
    res.status(200).json((await roomfromdb).rows[0]);
  } catch (error) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

router.put("/userjoined", async (req, res) => {

	
  try {
    const { room_id, userId , status} = req.body;

	if (status == "Joined"){
		const roomsfromdb = await pool.query(
			"SELECT * FROM parties WHERE (room_id = $1)",
			[room_id]
		  );
		  let active_members = roomsfromdb.rows[0].active_members;
		  active_members += 1;
		  await pool.query(
		    "UPDATE parties SET active_members = $1 WHERE (room_id = $2)",
		    [active_members, room_id]
		  );
		//   await pool.query(
		// 	  "INSERT INTO partymembers (room_id, user_id) VALUES ($1, $2) RETURNING * ",
		// 	  [room_id, userId]
		// 	);
	  
		  res.status(200).json(roomsfromdb.rows[0]);
		  // res.status(200).json((await roomsfromdb).rows[0].room_member);
		
	}
	else{
		const roomsfromdb = await pool.query(
			"SELECT * FROM parties WHERE (room_id = $1)",
			[room_id]
		  );
		  let active_members = roomsfromdb.rows[0].active_members;
		  active_members -= 1;
		  await pool.query(
		    "UPDATE parties SET active_members = $1 WHERE (room_id = $2)",
		    [active_members, room_id]
		  );
		//   await pool.query(
		// 	  "INSERT INTO partymembers (room_id, user_id) VALUES ($1, $2) RETURNING * ",
		// 	  [room_id, userId]
		// 	);
	  
		  res.status(200).json(roomsfromdb.rows[0]);
		  // res.status(200).json((await roomsfromdb).rows[0].room_member);
		

	}

   
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
