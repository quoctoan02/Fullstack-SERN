import bcrypt from "bcryptjs";
import db from "../models/index";

let getAllUsers = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let data = await db.User.findAll({
                raw: true,
            });
            console.log(data);
            resolve(data);
        } catch (error) {
            reject(error);
        }
    });
};
let getUserInfoByUserId = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.User.findOne({ where: { id: id } });
            if (user) {
                resolve(user);
            } else {
                resolve(null);
            }
        } catch (error) {
            reject(error);
        }
    });
};

let updateUserData = async (req, res) => {
    let data;
};
let createNewUser = async (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let check = await checkUserEmail(data.email);
            if (check) {
                resolve({
                    errCode: 1,
                    errMessage: "Email already exists",
                });
            } else {
                let hashPassWordFromBcrypt = await hashUserPassword(
                    data.password
                );
                await db.User.create({
                    email: data.email,
                    password: hashPassWordFromBcrypt,
                    firstName: data.firstName,
                    lastName: data.lastName,
                    address: data.address,
                    gender: data.gender === "1" ? true : false,
                    roleId: data.roleId,
                    phoneNumber: data.phoneNumber,
                });
                resolve({
                    errCode: 0,
                    errMessage: "create new user success",
                });
            }
        } catch (e) {
            reject(e);
        }
    });
};

let hashUserPassword = (password) => {
    return new Promise(async (resolve, reject) => {
        try {
            let hashPassWord = await bcrypt.hashSync(password, salt);
            resolve(hashPassWord);
        } catch (e) {
            reject(e);
        }
    });
};

module.exports = {
    createNewUser: createNewUser,
    getAllUsers: getAllUsers,
    getUserInfoByUserId: getUserInfoByUserId,
};
