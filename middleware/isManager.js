const User = require("../models/User.model");

module.exports = (req, res, next) => {
   
    const userId = req.payload._id;

    User.findById(userId)
        .then( userDetails => {
            if(userDetails.isManager){
                next();
            } else {
                res.status(401).json({"message": "unauthorized user"});
            }
        })
        .catch((err) => {
            console.log("this user is not a manager", err);
            res.status(500).json(err);
          });

  };
  