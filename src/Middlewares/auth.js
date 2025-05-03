

const adminAuth = (req, res, next) => {
    console.log("admin auth is getting checked");
    const token = "xyz";
    const isAdminAuthorized = token === "xyz";
    if(!isAdminAuthorized){
        res.status(401).send("Unauthorized request");
    }else{
        // console.log("admin auth")
        next();
    }
}

const userAuth = (req, res, next) => {
    console.log("user auth is getting checked");
    const token = "xyz";
    const isAdminAuthorized = token === "xyz";
    if(!isAdminAuthorized){
        res.status(401).send("Unauthorized request");
    }else{
        // console.log("admin auth")
        next();
    }
}

module.exports = {adminAuth, userAuth}