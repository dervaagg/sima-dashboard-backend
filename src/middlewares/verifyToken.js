const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
    const token = req.headers["x-access-token"];
    if (token) {
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
            if (err) {
                if (err.name === "TokenExpiredError") {
                    return res.status(401).json({
                        message: "Token expired",
                    });
                }
                return res.status(401).json({ message: "Token is not valid" });
            } else {
                const { id, role } = decoded;
                // console.log(decoded);
                req.id = id;
                req.role = role;

                // if path is register
                if (
                    req.path === "/dosen/register" ||
                    req.path === "/dosen/update-data"
                ) {
                    next();
                } else {
                    // Check if user can access the route based on their roles
                    // Check multiple role
                    if (Array.isArray(role)) {
                        // console.log(role);
                        let roleExists = false;
                        role.forEach((item) => {
                            // console.log(item);
                            // console.log(req.originalUrl);
                            // If url consists of the role, (/dosen/search), continue
                            if (req.originalUrl.includes(item.toLowerCase())) {
                                roleExists = true;
                                res.headers
                                next();
                            }
                        });

                        if (!roleExists) {
                            return res.status(403).json({
                                message: "You are not authorized to access this resource",
                            });
                        }
                        // One role, check url immediately
                    } else if (req.originalUrl.includes(role.toLowerCase())) {
                        next();
                        // User don't have the valid role to access the route
                    } else {
                        return res.status(403).json({
                            message: "You are not authorized to access this resource",
                        });
                    }
                }
            }
        });
    } else {
        res.status(401).json({ message: "Token is not provided" });
    }
};

module.exports = verifyToken;
