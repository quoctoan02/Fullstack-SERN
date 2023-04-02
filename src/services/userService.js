import db from '../models/index'
import bcrypt from 'bcryptjs'

const salt = bcrypt.genSaltSync(10);

let handleUserLogin = (email, password) => {
    return new Promise(async (resolve, reject) => {
        try {
            let isExist = await checkUserEmail(email);

            if (isExist) {
                //user already exist
                let user = await db.User.findOne({
                    attributes: ['email', 'roleId', 'firstname', 'lastName', 'password'],
                    where: { email: email }
                })
                if (user) {
                    let check = await bcrypt.compareSync(password, user.password)
                    delete user.password;
                    if (check) {
                        resolve({
                            errCode: 0,
                            errMessage: 'ok',
                            user: user,
                        })

                    } else {
                        resolve({
                            errCode: 3,
                            errMessage: `Wrong password`
                        })
                    }

                } else {
                    resolve({
                        errCode: 2,
                        errMessage: `User's not found`
                    })

                }

            } else {
                // return

                resolve({
                    errCode: 1,
                    errMessage: `Your's email isn't exist`
                })
            }

            //resolve(userData);

        } catch (e) {
            reject(e);
        }
    })
}

let checkUserEmail = (userEmail) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.User.findOne({ where: { email: userEmail } })
            if (user) {
                resolve(true);
            } else {
                resolve(false);
            }
        } catch (e) {
            reject(e);
        }
    })
}

let getAllUsers = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let users = '';
            if (userId === 'ALL') {
                users = await db.User.findAll({
                    attributes: {
                        exclude: ['password']
                    }
                })
            } else if (userId) {
                users = await db.User.findOne({
                    where: { id: userId },
                    attributes: {
                        exclude: ['password']
                    }
                })
            }
            resolve(users);
        } catch (error) {
            reject(error);
        }
    })
}

let createNewUser = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let check = await checkUserEmail(data.email);
            if (check) {
                resolve({
                    errCode: 1,
                    errMessage: 'Email already exists',
                })
            } else {
                let hashPassWordFromBcrypt = await hashUserPassword(data.password);
                await db.User.create({
                    email: data.email,
                    password: hashPassWordFromBcrypt,
                    firstName: data.firstName,
                    lastName: data.lastName,
                    address: data.address,
                    gender: data.gender,
                    roleId: data.role,
                    positionId: data.position,
                    phoneNumber: data.phoneNumber,
                    image: data.avatar,
                });
                resolve({
                    errCode: 0,
                    errMessage: 'create new user success'

                });
            }
        } catch (error) {
            reject(error);
        }
    })
}

let hashUserPassword = (password) => {
    return new Promise(async (resolve, reject) => {
        try {
            let hashPassWord = await bcrypt.hashSync(password, salt);
            resolve(hashPassWord);
        } catch (e) {
            reject(e);
        }

    })
}

let getUserInfoByUserId = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.User.findOne({ where: { id: id } })
            if (user) {
                resolve(user)
            } else {
                resolve(null);
            }
        } catch (error) {
            reject(error);
        }
    })
}

let deleteUser = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!userId) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing input parameter'
                })
            } else {
                let user = await db.User.findOne({ where: { id: userId }, raw: false });
                if (user) {
                    await user.destroy()
                    resolve({
                        errCode: 0,
                        errMessage: 'User deleted successfully'
                    })
                } else {
                    resolve({
                        errCode: 2,
                        errMessage: 'User not found'
                    })
                }
            }
        } catch (error) {
            reject(error);
        }
    })
}

let editUser = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (data.id && data.gender && data.role) {
                let user = await db.User.findOne({
                    where: { id: data.id },
                    raw: false
                })
                if (user) {
                    user.firstName = data.firstName;
                    user.lastName = data.lastName;
                    user.address = data.address;
                    user.phoneNumber = data.phoneNumber;
                    user.gender = data.gender;
                    user.roleId = data.role;
                    user.positionId = data.position;
                    if (data.avatar) {
                        console.log('abc')
                        user.image = data.avatar;
                    }
                    await user.save()
                    resolve({
                        errCode: 0,
                        errMessage: 'Updated user successfully.',
                    })
                } else {
                    resolve({
                        errCode: 1,
                        errMessage: 'User not found'
                    })
                }
            } else {
                resolve({
                    errCode: 2,
                    errMessage: 'Missing or invalid user'
                })
            }

        } catch (error) {
            reject(error);
        }
    })
}

let getAllCodes = (typeInput) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!typeInput) {
                resolve({
                    errCode: 1,
                    errMessage: 'Invalid type input provided'
                })
            } else {
                let res = {};
                let allcodes = await db.Allcode.findAll(
                    {
                        where: { type: typeInput }
                    }
                );

                res.errCode = 0;
                res.data = allcodes;
                resolve(res);
            }

        } catch (error) {
            reject(error);
        }
    })
}
module.exports = {
    handleUserLogin: handleUserLogin,
    getAllUsers: getAllUsers,
    createNewUser: createNewUser,
    deleteUser: deleteUser,
    editUser: editUser,
    getAllCodes: getAllCodes,
}