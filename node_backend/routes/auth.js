const express = require("express");
const pool = require("../configs/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const jwtTokens = require("../utils/jwt-helpers.js");

const authRouter = express.Router();

authRouter.post("/login", async (req, res) => {
    try{
        console.log(req.body);

        const { username, password } = req.body;

        const user = await pool.query("SELECT * FROM  users WHERE username = $1", [username]);
        
        console.log(user.rows.length);

        if(user.rows.length === 0) {
            return res.status(401).json({error: "username not found!"});
        }

        const isValidPassword = await bcrypt.compare(password,user.rows[0].password);

        if(!isValidPassword){
            console.log('invalid password');
            return res.status(401).json({error: "Incorrect password!"});
        }

        let token = jwtTokens(user.rows[0]);
        
        res.status(200).json(token);
        console.log(`sent token! ${token.accessToken}`);
    } catch (err){
        console.error(err.error);
        res.status(400).json({error: "error creating new user!"});
    }
});

module.exports = authRouter;