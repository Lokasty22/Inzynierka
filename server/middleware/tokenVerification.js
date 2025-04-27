const jwt = require("jsonwebtoken");

function tokenVerification(req, res, next) {
    const token = req.headers["x-auth-token"];
    console.log("Token received:", token);
    if (!token) {
        return res.status(403).send({ message: "No token provided!" });
    }

    jwt.verify(token, process.env.JWTPRIVATEKEY, (err, decodeduser) => {
        if (err) {
            console.log("Unauthorized!");
            return res.status(401).send({ message: "Unauthorized!" });
        }

        console.log("Token verified, user:", decodeduser);
        req.user = decodeduser;

        next();
    });
}

module.exports = tokenVerification;
