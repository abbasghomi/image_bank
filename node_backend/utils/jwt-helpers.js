const jwt = require("jsonwebtoken");

function jwtTokens({id,username}){
    const user = {id: id,username: username};
    const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET,{expiresIn:"48h"});

    return({accessToken});
}

module.exports = jwtTokens;