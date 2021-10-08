const express = require("express");
const pool = require("../configs/db");

const classesRouter = express.Router();

const auth_middleware = require("../middleware/auth-middleware");
//get

classesRouter.get("/classes", auth_middleware, async (req, res) => {
    try{
        
        var page = req.query.page;
        var pageItemsLimit = process.env.PAGE_LIMIT;
        
        if(!page || page==0){
            page=1;
        }


        console.log(`page: ${page}`);
        console.log(`limit: ${pageItemsLimit}`);
        const allClasses = await pool.query(`SELECT * FROM classes LIMIT ${pageItemsLimit} OFFSET ${(page - 1) * pageItemsLimit}`);
        const classesCount = await pool.query("SELECT COUNT(id) as cnt FROM classes");
        let pageCount = Math.ceil(classesCount.rows[0].cnt / pageItemsLimit); 

        // const allLabels = await pool.query("SELECT * FROM classes");

        res.status(200).json({status: 200, limit: pageItemsLimit, pagecount: pageCount, currentpage: page, items: allClasses.rows});
    } catch (err){
        console.error(err.message);
        res.status(400).json("error getting class!");
    }
});

classesRouter.get("/classes/:id", auth_middleware, async (req, res) => {
    try{
        console.log(req.params);

        const { id } = req.params;

        const classResult = await pool.query("SELECT * FROM classes WHERE id = ($1)", [id]);

        res.json(classResult.rows[0]);
    } catch (err){
        console.error(err.message);
        res.status(400).json("error getting class!");
    }
});

//create

classesRouter.post("/classes", auth_middleware, async (req, res) => {
    try{
        console.log(req.body);

        const { name } = req.body;

        const newClasses = await pool.query("INSERT INTO classes(name) VALUES ($1) RETURNING *", [name]);
        console.log(newClasses.rows[0]);
        res.status(200).json({status: 200, new_class: newClasses.rows[0]});
    } catch (err){
        console.error(err.message);
        res.status(400).json("error creating new class!");
    }
});

//update

classesRouter.put("/classes/:id", auth_middleware, async (req, res) => {
    try{
        console.log(req.params); 
        console.log(req.body); 
        
        const { id } = req.params; //where

        const { name } = req.body; // set

        const updateClass = await pool.query("UPDATE classes SET name = $1 WHERE id = $2", [name, id]);

        res.json("class was updated!");
    } catch (err){
        console.error(err.message);
        res.status(400).json("error updating class!");
    }
});

//delete

classesRouter.delete("/classes/:id", auth_middleware, async (req, res) => {
    try{
        console.log(req.params);
        const { id } = req.params; //where

        const deletedClasses = await pool.query("DELETE FROM classes WHERE id=$1",[id]);

        res.status(200).json({status: 200, message: "class was successfully deleted!"});
    } catch (err){
        console.error(err.message);
        res.status(400).json("error deleting class!");
    }
});

module.exports = classesRouter;