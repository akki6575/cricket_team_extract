const path = require("path");
const express = require("express");
const app = express();
app.use(express.json());
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");

let db = null;
const dbPath = path.join(__dirname, "cricketTeam.db");
const initializeDbAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("Server Running at https://localhost:3000/");
    });
  } catch (e) {
    console.log(`Database error:${e.message}`);
    process.exit(1);
  }
};
initializeDbAndServer();
// API 1
app.get("/players/", async (request, response) => {
  const dbQuery = "Select * from cricket_team;";
  const dbResponse = await db.all(dbQuery);
  const ans = (dbResponse) => {
    return {
      playerId: dbResponse.player_id,
      playerName: dbResponse.player_name,
      jerseyNumber: dbResponse.jersey_number,
      role: dbResponse.role,
    };
  };
  response.send(dbResponse.map((eachPlayer) => ans(eachPlayer)));
});
//API 2
app.post("/players/", async (request, response) => {
  const playerDetails = request.body;
  const { playerName, jerseyNumber, role } = playerDetails;
  const dbQuery = `Insert into cricket_team (player_name,jersey_number,role) values ('${playerName}',${jerseyNumber},'${role}');`;
  await db.run(dbQuery);
  response.send("Player Added to Team");
});

//API 3
app.get("/players/:playerId", async (request, response) => {
  const { playerId } = request.params;
  const dbQuery = `Select * from cricket_team where player_id=${playerId};`;
  const dbResponse = await db.get(dbQuery);
  const ans = (dbResponse) => {
    return {
      playerId: dbResponse.player_id,
      playerName: dbResponse.player_name,
      jerseyNumber: dbResponse.jersey_number,
      role: dbResponse.role,
    };
  };
  response.send(ans(dbResponse));
});
// API 4
app.put("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const playerDetails = request.body;
  const { playerName, jerseyNumber, role } = playerDetails;
  const dbQuery = `UPDATE cricket_team set player_name='${playerName}',jersey_number=${jerseyNumber},role='${role}' where player_id=${playerId};`;
  await db.run(dbQuery);
  response.send("Player Details Updated");
});
//API 5
app.delete("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const dbQuery = `delete from cricket_team where player_id=${playerId};`;
  await db.run(dbQuery);
  response.send("Player Removed");
});

module.exports = app;
