const UserModel = require('../model/users')
const { errorHandle } = require('./form.controller')

const deleteUser = async (req, res) => {
    try {
        const deleteUser = await UserModel.findByIdAndDelete(req.params.id)
        if (deleteUser) res.status(200).json({ msg: "user has deleted" });
    } catch (err) {
        errorHandle(err, res)
    }
}

module.exports = { deleteUser }