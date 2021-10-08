const express = require("express");
const pool = require("../configs/db");

const labelingRouter = express.Router();

const auth_middleware = require("../middleware/auth-middleware");
//get

labelingRouter.get("/labeling", auth_middleware, async (req, res) => {
    try{
        var page = req.query.page;
        var pageItemsLimit = process.env.PAGE_LIMIT;
        
        if(!page || page==0){
            page=1;
        }

        console.log(`page: ${page}`);
        console.log(`limit: ${pageItemsLimit}`);

        const allClasses = await pool.query(`SELECT * FROM classes`);
        const allLabels = await pool.query(`SELECT * FROM labels`);

        res.status(200).json({status: 200, labels: allLabels.rows, classes: allClasses.rows}); //limit: pageItemsLimit, pagecount: pageCount, currentpage: page, items: allImages.rows,
    } catch (err){
        console.error(err.message);
        res.status(400).json("error getting images!");
    }
});

//create

labelingRouter.post("/labeling", auth_middleware, async (req, res) => {
    try{

        const { image, classId, labelId, x, y, width, height, layerThumbnail } = req.body;

        console.log('got params');

        const imageThumbnail = require('image-thumbnail');
        let options = { width: 100, height: 100, responseType: 'base64' }
        const thumbnail = await imageThumbnail(image.replace("data:image/jpeg;base64,", "").replace("data:image/png;base64,",""), options);
        console.log('thumbnail created');

        const { 
            v4: uuidv4,
          } = require('uuid');

        var filename = `${uuidv4()}`;
        const fs = require('fs');
        fs.writeFile(`uploads/${filename}`, image,function () {
            console.log(filename);
        });

        const newImage = await pool.query("INSERT INTO images (thumbnail, fileName, user_id) values ($1, $2, $3) RETURNING *", [thumbnail, filename, -1]);//userId=-1
        console.log('image recorded');

        const newLayer = await pool.query("INSERT INTO layers (class_id, label_id, x, y, width, height, image_id, user_id, thumbnail) values ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *", [classId,labelId, x, y, width, height, newImage.rows[0].id, -1, layerThumbnail]);//userId=-1
        console.log('layer recorded');

        res.status(200).json({status: 200, new_image: newImage.rows[0], new_layer: newLayer.rows[0]});
    } catch (err){
        console.error(err.message);
        res.status(400).json("error creating new image!");
    }
});

//delete

labelingRouter.delete("/labeling/:id", auth_middleware, async (req, res) => {
    try{
        console.log(req.params);
        const { id } = req.params; //where

        const deletedLayer = await pool.query("DELETE FROM layers WHERE image_id=$1",[id]);
        const deletedImages = await pool.query("DELETE FROM images WHERE id=$1",[id]);

        res.status(200).json({status: 200, message: "image with layers were successfully deleted!"});
    } catch (err){
        console.error(err.message);
        res.status(400).json("error deleting image!");
    }
});


module.exports = labelingRouter;