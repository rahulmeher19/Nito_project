const config = require('config.json');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('_helpers/db');
const Role = db.Role;

module.exports = {
    authenticate,
    getAll,
    getById,
    create,
    update,
    delete: _delete
};

async function authenticate({ rolename, description }) {
    const role = await Role.findOne({ rolename,description });
    if (role && bcrypt.compareSync(role.hash)) {
        const token = jwt.sign({ sub: role.id }, config.secret, { expiresIn: '7d' });
        return {
            ...role.toJSON(),
            token
        };
    }
}

async function getAll() {
    return await Role.find();
}

async function getById(id) {
    return await Role.findById(id);
}

async function create(roleParam) {
    // validate
    if (await Role.findOne({ roleName: roleParam.roleName })) {
        throw 'roleName "' + roleParam.roleName + '" is already taken';
    }

    const role = new Role(roleParam);

    // hash password
    if (roleParam.password) {
        role.hash = bcrypt.hashSync(roleParam.password, 10);
    }

    // save role
    await role.save();
}

async function update(id, roleParam) {
    const role = await Role.findById(id);

    // validate
    if (!role) throw 'Role not found';
    if (role.roleName !== roleParam.roleName && await Role.findOne({ roleName: roleParam.roleName })) {
        throw 'roleName "' + roleParam.roleName + '" is already taken';
    }

    // hash password if it was entered
    if (roleParam.password) {
        roleParam.hash = bcrypt.hashSync(roleParam.password, 10);
    }

    // copy roleParam properties to role
    Object.assign(role, roleParam);

    await role.save();
}

async function _delete(id) {
    await Role.findByIdAndRemove(id);
}