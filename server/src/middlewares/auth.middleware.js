const UsersService = require('../services/users.service');

module.exports = () => {

    return async (ctx, next) => {

        ctx.authorizedUser = null;

        if ( 'x-ssid' in ctx.request.headers ) {
            const user = await UsersService.getBySsid(ctx.db, ctx.request.headers['x-ssid'] );
            if (user) {
                ctx.authorizedUser = user;
            }
        }

        // console.log('Auth middleware', ctx.authorizedUser);
        await next();
    }

};