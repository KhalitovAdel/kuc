import "reflect-metadata";

import express from 'express';
import * as entities from './entity';
import { createDatabase } from "./db";
import bodyParser from 'body-parser';
import { exceptionMiddleware } from "./middleware";
import AdminJs from 'adminjs';
import AdminJsExpress from '@adminjs/express';
import { Order, User } from "./entity";
import { Database, Resource } from '@adminjs/typeorm';
import { OrderService, UserService } from "./service";
import { CustomResource, OrderResourceHandler, UserResourceHandler } from "./resource";
import { I18nUtil, OrderI18n, UserI18n } from "./i18n";
import { promises } from 'fs';
import { join } from 'path';
import { HtmlEditor, HtmlToPdf } from "./util";
import { OrderToHtml } from "./adapter";
import { PrintOrderCase } from "./useCase";

AdminJs.registerAdapter({ Database, Resource });
/**
 * 4) pdf template
 * 7) Error handling
 */
createDatabase(Object.values(entities)).then(async (ds) => {
    const app = express();
    User.useDataSource(ds);
    Order.useDataSource(ds);

    const htmlEditor = new HtmlEditor<OrderToHtml>(await promises.readFile(join(__dirname, 'template.html'), { encoding: 'utf8' }));
    const htmlConverter = new HtmlToPdf({ format: 'A4' });
    const orderRepository = ds.getRepository(Order);

    const orderService = new OrderService(orderRepository);
    const userService = new UserService(ds.getRepository(User));

    const printOrderCase = new PrintOrderCase(orderRepository, htmlEditor, htmlConverter);

    const userResource = new CustomResource(User, new UserResourceHandler(userService));
    const orderResource = new CustomResource(Order, new OrderResourceHandler(orderService));

    userResource.setPossibleRoles('admin');
    orderResource.setPropertyVisibility('price', true, true, false, true);
    orderResource.setPropertyVisibility('userId', true, true, false, true);
    orderResource.setPossibilityForAction('bulkDelete', 'admin');
    orderResource.setPossibilityForAction('delete', 'admin');
    
    orderResource.setPossibilityReadOwnDocs('external_user');

    orderResource.setNewAction('file')

    const i18n = new I18nUtil([OrderI18n, UserI18n])

    const adminJs = new AdminJs({
        rootPath: '/',
        loginPath: '/login',
        resources: [
            userResource.init(ds),
            orderResource.init(ds),
        ],
        branding: {
            companyName: 'Казанский Технадзор',
            logo: 'https://static.tildacdn.com/tild3638-3632-4466-b831-356636366363/logo-.png',
        },
        locale: i18n.getLocale(),
    });

    const router = AdminJsExpress.buildAuthenticatedRouter(adminJs, {
        authenticate: async (email, password) => {
            const [canLogin, user] = await userService.canLogin(email, password);
            if (!canLogin) return false;

            return user;
        },
        cookiePassword: 'KUC'
    })
    
    app.use(adminJs.options.rootPath, router);

    app.get('/orderPrint/:id', async (req, res, next) => {
        try {
            return res.status(200).send(await printOrderCase.exec(+req.params.id))
        } catch (e) {
            next(e);
        }
    })

    app.use(bodyParser.urlencoded({
        extended: true
    }));
    app.use(bodyParser.json());

    // app.use((req, res, next) => next(new NotNullException('Route')));
    app.use(exceptionMiddleware);
    
    app.listen(4050, () => {
        console.log('Listen http://localhost:4050');
    })
})
