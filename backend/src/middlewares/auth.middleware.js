const jwt = require("jsonwebtoken");

function authMiddleware(req, res, next) {
    try {
        console.log(
        "AUTH CHECK:",
          req.originalUrl,
        "| Cookie present:",
        Boolean(req.cookies?.token)
        );
        const token = req.cookies.token;

        if (!token) {
            return res.status(401).json({
                message: "Please login first"
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = decoded;
        console.log("AUTH SUCCESS:", req.originalUrl);
        next();
    } catch (err) {
        return res.status(401).json({
            message: "Invalid or expired token"
        });
    }
}

module.exports = authMiddleware;