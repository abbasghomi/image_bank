const express = require("express");
const pool = require("../configs/db");
const bcrypt = require("bcrypt");

const usersRouter = express.Router();

const auth_middleware = require("../middleware/auth-middleware");

//get 

usersRouter.get("/users", auth_middleware, async (req, res) => {
    try{
        console.log(req.body);
        const allUsers = await pool.query("SELECT * FROM users");
        res.json(allUsers.rows);
    } catch (err){
        console.error(err.message);
        res.status(400).json("error getting user!");
    }
});

usersRouter.get("/users/:id", auth_middleware, async (req, res) => {
    try{
        console.log(req.params);

        const { id } = req.params;

        const user = await pool.query("SELECT * FROM users WHERE id = ($1)", [id]);

        res.json(user.rows[0]);
    } catch (err){
        console.error(err.message);
        res.status(400).json("error getting user!");
    }
});

//create
// todo: registration is open without logging in and should be revised!
usersRouter.post("/users", async (req, res) => {  //, auth_middleware 
    try{
        console.log(req.body);

        const { username, name, family, password, email } = req.body;

        console.log(username, name, family, password, email);
        const hashedPassword = await bcrypt.hash(password,10);
        console.log(hashedPassword);

        const newUser = await pool.query("INSERT INTO users(username, name, family, password, email) VALUES ($1,$2,$3,$4,$5) RETURNING *", 
                                            [username, name, family, hashedPassword, email]);

        res.status(200).json({status: 200, message: 'OK'});
    } catch (err){
        console.error(err.message);
        res.status(400).json("error creating new user!");
    }
});

//update

usersRouter.put("/users/:id", auth_middleware, async (req, res) => {
    try{
        console.log(req.params); 
        console.log(req.body); 
        
        const { id } = req.params; //where

        const { name } = req.body; // set

        const updateUser = await pool.query("UPDATE users SET name = $1 WHERE id = $2", [name, id]);

        res.json("User was updated!");
    } catch (err){
        console.error(err.message);
        res.status(400).json("error updating user!");
    }
});

//delete

usersRouter.delete("/users/:id", auth_middleware, async (req, res) => {
    try{
        console.log(req.params);
        const { id } = req.params; //where

        const deletedUsers = await pool.query("DELETE FROM users WHERE id=$1",[id]);

        res.json("User was successfully deleted!");
    } catch (err){
        console.error(err.message);
        res.status(400).json("error deleting user!");
    }
});

module.exports = usersRouter;