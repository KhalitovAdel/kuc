import { NextFunction, Request, Response } from "express";
import { AsyncLocalStorage } from "node:async_hooks";
import React from "react";
import ReactDOMServer from "react-dom/server";
import { StaticRouter } from "react-router-dom/server";
import { NotNullException } from "./exception";

export class Renderer {
    private static readonly storage = new AsyncLocalStorage<[Request, Response]>();
    constructor(private readonly assets: object) {}

    public renderDom<T>(c: React.FC<T>, props: T): string {
        const store = Renderer.storage.getStore();
        if (!store) throw new NotNullException(Renderer.name);

        const component = ReactDOMServer.renderToStaticMarkup(React.createElement(StaticRouter, { location: store[0].baseUrl }, ...[
            React.createElement(c, props)
        ]));

        
        store[1].render('client', { assets: this.assets, component });
        return component;
    }

    public static getMiddleWare() {
        return (req: Request, res: Response, next: NextFunction) => {
            Renderer.storage.enterWith([req, res]);
            next();
        }
    }
}