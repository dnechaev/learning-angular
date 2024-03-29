import cors from '@koa/cors';
import bodyParser from 'koa-bodyparser';
import staticData from 'koa-static';

import authMiddleware from '../middlewares/auth.middleware';
import apiRoutes from './api';

export default (app) => {

    // Error handler
    app.use(async (ctx, next) => {
        try {
            await next();
        } catch (err) {
            console.log('ErrorHandler: ', err);
            ctx.status = err.status || 500;
            ctx.body = {
                message: err.message,
                errors: err.errors
            };
        }
    });

    app.use(cors());
    app.use(bodyParser());

    app.use(async (ctx, next) => {
        console.log('------------------------------------------');
        console.log('Href: ', ctx.href);
        // console.log('Query: ', ctx.query);
        // console.log('Params: ', ctx.params);
        // console.log('Body: ', ctx.request.body);
        // console.log('Headers: ', ctx.request.headers);
        await next();
    });

    app.use(authMiddleware());

    app.use(apiRoutes());

    app.use(staticData(__dirname + '/../../public'));

    // Page not found handler
    app.use(async ctx => {
        ctx.status = 404;
        ctx.body = 'Page not found';
    });

}
