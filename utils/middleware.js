const jwt = require('jsonwebtoken');
const constants = require('./constants')

exports.isAuthenticated = async (req, res, next) => {

    const token = req.headers.authorization;

    if (token) { 

        try{

            const decoded = jwt.verify(token.replace('Bearer ', ''), constants.SECRET);
            if (!decoded.id) return res.status(401).json({ message: "Invalid Token" }); 

            next();

        }catch(error) {

            return res.status(401).json({ code: 401, message: "Expired Token" });
        }
        
    } else {
        return res.status(401).json({ message: "No Token" }); 
    }    
}
