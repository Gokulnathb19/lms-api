module.exports = (roles) => {
    return (req, res, next) => {
        const reqRole = req.role
        if(!reqRole) {
            res.status(401).send("Unauthorized")
        } else {
            if(!roles.includes(reqRole)) {
                res.status(403).send("Unauthorized")
            }
            else {
                next()
            }
        }
    }
}