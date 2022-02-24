const expressJwt = require('express-jwt');
const config = require('config.json');
const userService = require('../users/user.service');
const roleService = require('../roles/role.service')

module.exports = jwt;

function jwt() {
    const secret = config.secret;
    return expressJwt({ secret, algorithms: ['HS256'], isRevoked }).unless({
        path: [
            // public routes that don't require authentication
            '/users/authenticate',
            '/users/register',
            '/roles/authenticate',
            '/roles/register'
        ]
    });
}

async function isRevoked(req, payload, done) {
    const user = await userService.getById(payload.sub);

    // revoke token if user no longer exists
    if (!user) {
        return done(null, true);
    }

    done();
};
async function isRevoked(req, payload, done) {
    const role = await roleService.getById(payload.sub);

    // revoke token if user no longer exists
    if (!role) {
        return done(null, true);
    }

    done();
};