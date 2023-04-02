import db from "../models/index";
import CRUDService from "../services/CRUDService";

let getHomePage = async (req, res) => {
    try {
        let data = await db.User.findAll();
        console.log(data);
        return res.render("homepage.ejs", {
            data: JSON.stringify(data),
        });
    } catch (error) {
        console.log(error);
    }
};

let getCRUD = async (req, res) => {
    return res.render("crud.ejs");
};

let postCRUD = async (req, res) => {
    //console.log(req.body)
    let message = await CRUDService.createNewUser(req.body);

    return res.send(message);
};

let getEditCRUD = async (req, res) => {
    let userId = req.query.id;
    let userData = await CRUDService.getUserInfoByUserId(userId);
    return res.send("ok");
};

let displayCRUD = async (req, res) => {
    let data = await CRUDService.getAllUsers();
    return res.render("displayCRUD.ejs", {
        data: data,
    });
};
module.exports = {
    getHomePage: getHomePage,
    getCRUD: getCRUD,
    postCRUD: postCRUD,
    displayCRUD: displayCRUD,
};
