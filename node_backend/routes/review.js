const express = require("express");
const pool = require("../configs/db");

const reviewRouter = express.Router();

const auth_middleware = require("../middleware/auth-middleware");
//get

reviewRouter.get("/review", auth_middleware, async (req, res) => {
    try{
        var page = req.query.page;
        var pageItemsLimit = process.env.PAGE_LIMIT;
        
        if(!page || page==0){
            page=1;
        }

        console.log(`page: ${page}`);
        console.log(`limit: ${pageItemsLimit}`);
        const allLayers = await pool.query(`SELECT * FROM layers LIMIT ${pageItemsLimit} OFFSET ${(page - 1) * pageItemsLimit}`);
        const layersCount = await pool.query(`SELECT Count(id) as cnt FROM layers`);
        let pageCount = Math.ceil(layersCount.rows[0].cnt / pageItemsLimit); 

        const allClasses = await pool.query(`SELECT * FROM classes`);
        const allLabels = await pool.query(`SELECT * FROM labels`);

        res.status(200).json({status: 200, limit: pageItemsLimit, pagecount: pageCount, currentpage: page, items: allLayers.rows, labels: allLabels.rows, classes: allClasses.rows});
    } catch (err){
        console.error(err.message);
        res.status(400).json("error getting layers!");
    }
});


reviewRouter.get("/review/:id", auth_middleware, async (req, res) => {
    try{
        console.log(req.params);

        const { id } = req.params;

        const layerSelected = await pool.query("SELECT * FROM layers WHERE id = ($1)", [id]);
        const imageSelected = await pool.query("SELECT * FROM images WHERE id = ($1)", [layerSelected.rows[0].image_id]);

        var filename = imageSelected.rows[0].filename;
        const fs = require('fs');
        const imageData = fs.readFileSync(`uploads/${filename}`, 'utf8');

        const allClasses = await pool.query(`SELECT * FROM classes`);
        const allLabels = await pool.query(`SELECT * FROM labels`);

        res.json({status: 200, layer: layerSelected.rows[0], image: imageSelected.rows[0], classes: allClasses.rows, labels: allLabels.rows, imagedata: imageData});
    } catch (err){
        console.error(err.message);
        res.status(400).json("error getting layer!");
    }
});

//update

reviewRouter.put("/review/:id", auth_middleware, async (req, res) => {
    try{
        console.log(req.params); 
        console.log(req.body); 
        
        const { id } = req.params; //where

        const { x, y, width, height, layerThumbnail, user_id , classId, labelId} = req.body; // set

        console.log(x, y, width, height, user_id , id);
        const updateLayer = await pool.query("UPDATE layers SET x = $1, y = $2, width = $3, height = $4, thumbnail = $5, user_id = $6, class_id= $7, label_id = $8 WHERE id = $9", [x, y, width, height, layerThumbnail, -1, classId, labelId, id]);

        res.json({status: 200, message: "layer was updated!"});
    } catch (err){
        console.error(err.message);
        res.status(400).json("error updating layer!");
    }
});

//delete

reviewRouter.delete("/review/:id", auth_middleware, async (req, res) => {
    try{
        console.log(req.params);
        const { id } = req.params; //where

        const deletedLayer = await pool.query("DELETE FROM layers WHERE id=$1",[id]);

        res.status(200).json({status: 200, message: "layer was successfully deleted!"});
    } catch (err){
        console.error(err.message);
        res.status(400).json("error deleting image!");
    }
});


module.exports = reviewRouter;