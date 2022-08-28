import "reflect-metadata";

import express from 'express';
import * as entities from './entity';
import { getUserRouter, getOrderRouter } from './routes';
import { createDatabase } from "./db";
import bodyParser from 'body-parser';
import { exceptionMiddleware } from "./middleware";
import { NotNullException } from "./exception";
import React from 'react'
import ReactDOMServer from 'react-dom/server'
import path from 'path';
import { promises } from 'fs';
import { Renderer } from "./renderer";

createDatabase(Object.values(entities)).then(async (ds) => {
    const app = express();

    app.set('view engine', 'ejs');
    app.set('views', path.join(__dirname, 'views'));

    app.use(bodyParser.urlencoded({
        extended: true
    }));
    app.use(bodyParser.json());
    app.use('/', express.static(path.join(__dirname, 'static')));
    app.use(Renderer.getMiddleWare());

    const manifest = await promises.readFile(
        path.join(__dirname, 'static/manifest.json'),
        'utf-8'
    );
    const assets = JSON.parse(manifest);
    const renderer = new Renderer(assets);
    
    app.use('/users', getUserRouter(ds.getRepository(entities.User)));
    app.use('/orders', getOrderRouter(ds.getRepository(entities.Order), renderer));

    app.use((req, res, next) => next(new NotNullException('Route')));
    app.use(exceptionMiddleware);
    
    app.listen(4050, () => {
        console.log('Listen http://localhost:4050');
    })
})
