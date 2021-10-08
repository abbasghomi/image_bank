const express = require("express");
const pool = require("../configs/db");

const labelsRouter = express.Router();

const auth_middleware = require("../middleware/auth-middleware");
//get 

labelsRouter.get("/labels", auth_middleware, async (req, res) => {
    try{
        var page = req.query.page;
        var pageItemsLimit = process.env.PAGE_LIMIT;
        
        if(!page || page==0){
            page=1;
        }

        console.log(`page: ${page}`);
        console.log(`limit: ${pageItemsLimit}`);
        const allLabels = await pool.query(`SELECT * FROM labels LIMIT ${pageItemsLimit} OFFSET ${(page - 1) * pageItemsLimit}`);
        const labelsCount = await pool.query(`SELECT Count(id) as cnt FROM labels`);
        let pageCount = Math.ceil(labelsCount.rows[0].cnt / pageItemsLimit); 

        res.status(200).json({status: 200, limit: pageItemsLimit, pagecount: pageCount, currentpage: page, items: allLabels.rows});
    } catch (err){
        console.error(err.message);
        res.status(400).json("error getting label!");
    }
});

labelsRouter.get("/labels/:id", auth_middleware, async (req, res) => {
    try{
        console.log(req.params);

        const { id } = req.params;

        const label = await pool.query("SELECT * FROM labels WHERE id = ($1)", [id]);

        res.json(label.rows[0]);
    } catch (err){
        console.error(err.message);
        res.status(400).json("error getting label!");
    }
});

//create

labelsRouter.post("/labels", auth_middleware, async (req, res) => {
    try{
        console.log(req.body);

        const { name } = req.body;

        const newLabel = await pool.query("INSERT INTO labels(name) VALUES ($1) RETURNING *", [name]);

        res.status(200).json({status: 200, new_label: newLabel.rows[0]});
    } catch (err){
        console.error(err.message);
        res.status(400).json("error creating new label!");
    }
});

//update

labelsRouter.put("/labels/:id", auth_middleware, async (req, res) => {
    try{
        console.log(req.params); 
        console.log(req.body); 
        
        const { id } = req.params; //where

        const { name } = req.body; // set

        const updateLabel = await pool.query("UPDATE labels SET name = $1 WHERE id = $2", [name, id]);

        res.json("label was updated!");
    } catch (err){
        console.error(err.message);
        res.status(400).json("error updating label!");
    }
});

//delete

labelsRouter.delete("/labels/:id", auth_middleware, async (req, res) => {
    try{
        console.log(req.params);
        const { id } = req.params; //where

        const deletedLabels = await pool.query("DELETE FROM labels WHERE id=$1",[id]);

        res.status(200).json({status: 200, message: "label was successfully deleted!"});
    } catch (err){
        console.error(err.message);
        res.status(400).json("error deleting label!");
    }
});

module.exports = labelsRouter;