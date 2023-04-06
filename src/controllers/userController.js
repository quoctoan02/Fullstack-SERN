import userService from '../services/userService';

let handleLogin = async (req, res) => {
    let { email, password } = req.body;
    if (!email || !password) {
        return res.status(500).json({
            errCode: 1,
            message: 'Missing inputs parameter!',
        });
    }

    let message = await userService.handleUserLogin(email, password);
    //console.log(userData)
    //check user_email exist
    //user_password nhap vao ko dung
    //return userInfor
    // access_token :JWT json web token

    return res.status(200).json(message);
};

let handleGetAllUsers = async (req, res) => {
    let id = req.query.id;
    let users = await userService.getAllUsers(id);
    return res.status(200).json({
        errCode: 0,
        errMessage: 'get all user success',
        users,
    });
};

let handleCreateNewUser = async (req, res) => {
    let message = await userService.createNewUser(req.body);
    return res.status(200).json(message);
};

let handleDeleteUser = async (req, res) => {
    let message = await userService.deleteUser(req.body.id);
    return res.status(200).json(message);
};

let handleEditUser = async (req, res) => {
    let message = await userService.editUser(req.body);
    return res.status(200).json(message);
};

let handleGetAllCodes = async (req, res) => {
    try {
        setTimeout(async () => {
            let data = await userService.getAllCodes(req.query.type);
            return res.status(200).json(data);
        });
    } catch (error) {
        console.log(error);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server',
        });
    }
};

module.exports = {
    handleLogin: handleLogin,
    handleGetAllUsers: handleGetAllUsers,
    handleCreateNewUser: handleCreateNewUser,
    handleEditUser: handleEditUser,
    handleDeleteUser: handleDeleteUser,
    handleGetAllCodes: handleGetAllCodes,
};
