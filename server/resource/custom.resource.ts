import AdminJS, { Action, ActionContext, ActionHandler, ActionRequest, ActionResponse, RecordActionResponse, ResourceOptions, ResourceWithOptions } from "adminjs";
import { BaseEntity, DataSource } from "typeorm";
import { DuplicateException } from "../exception";
import { ResourceHandler } from "./interface";

export class CustomResource<T extends object> {
    private readonly resource: ResourceWithOptions = {
        resource: this.entityConstructor,
        options: {
            navigation: null,
            actions: {
                new: { 
                    handler: this.handlers?.create ? CustomResource.handleCustomAction(true, this.handlers.create.bind(this.handlers)) : undefined, 
                },
                edit: { 
                    handler: this.handlers?.update ? CustomResource.handleCustomAction(false, this.handlers.update.bind(this.handlers)) : undefined, 
                },
                list: {
                    isAccessible: this.isAccessible.bind(this)
                }
            },
            properties: {}
        }
    }

    private readonly accessibleRoles: string[] = [];

    constructor(
        private readonly entityConstructor: typeof BaseEntity, 
        private readonly handlers?: ResourceHandler<T>,
        ) {}

    public init(ds: DataSource): ResourceWithOptions {
        this.entityConstructor.useDataSource(ds);

        return this.resource;
    }

    public setPossibleRoles(...roles: string[]): this {
        this.accessibleRoles.push(...roles);
        
        return this;
    }

    public setPropertyVisibility(key: keyof T, show = true, list = true, edit = true, filter = true): this {
        const options = this.resource.options.properties || {};
        const existsProperty = options[String(key)] ? options[String(key)] : options[String(key)] = {};
        existsProperty.isVisible = { show, list, edit, filter};
        if (!this.resource.options.properties) this.resource.options.properties = options;
        
        return this;
    }

    public setPossibilityForAction(
        action: keyof Required<Required<ResourceOptions>['actions']>,
        ...roles: string[]
        ): this {
        const existsAction = this.getActionObject(action);
        existsAction.isAccessible = (context: ActionContext) => context.currentAdmin 
            ? roles.includes(context.currentAdmin.role)
            : true;

        return this;
    }

    public setPossibilityReadOwnDocs(...roles: string[]): this {
        const action = this.getActionObject('list');
        const realHandler =  action.before;

        action.before = async (request, context) => {
            const realRequest = typeof realHandler === 'function' ? await realHandler(request, context) : request;
            const query = realRequest.query ? realRequest.query : (realRequest.query = {})
            if (!roles.includes(context.currentAdmin?.role)) return realRequest;

            const filters = query.filters ? query.filters : (query.filters = {});

            filters.userId = Number(context.currentAdmin?.id);

            return realRequest;
        }

        return this;
    }

    public setNewAction(actionName: string): this {
        if (!this.resource.options.actions) (this.resource.options.actions = {});
        if (Object.keys(this.resource.options.actions).includes(actionName)) throw new DuplicateException(actionName);

        const handler: Action<ActionResponse>['handler'] = async (req, res, context) => {
            context.record?.toJSON(context.currentAdmin)
            return {
                record: context.record?.toJSON(context.currentAdmin),
                // redirectUrl: await cb(Number(context.record?.id()))
            }
        };

        const action: Action<ActionResponse> = {
            handler,
            name: actionName,
            actionType: 'record',
            component: AdminJS.bundle('../view/order-print.view'),
        };
        this.resource.options.actions![actionName as keyof typeof this.resource.options.actions] = action;

        return this;
    }

    private getActionObject(
        action: keyof Required<Required<ResourceOptions>['actions']>,
    ): Partial<Action<any>> {
        const actions = this.resource.options.actions || {};
        if (!this.resource.options.actions) this.resource.options.actions = actions;
        const existsAction = (actions[action] ? actions[action] : (actions[action] = {}))!

        return existsAction;
    }

    private isAccessible(context: ActionContext): boolean {
        return this.accessibleRoles.length && context.currentAdmin 
            ? this.accessibleRoles.includes(context.currentAdmin?.role) 
            : true
    }

    private static handleCustomAction(isCreate: boolean, cb: (...args: any[]) => Promise<object>): ActionHandler<RecordActionResponse> {
        return async (request: ActionRequest, response, context: ActionContext) => {

            if (!isCreate && request.method === 'get') {
                return { record: context.record!.toJSON(context.currentAdmin) }
            }
          
            try {
                const payload = isCreate ? [request.payload, Number(context.currentAdmin?.id)] : [+request.payload?.id, request.payload];
                const entity = await cb(...payload);
                const record = context.resource.build(entity);
                return {
                    redirectUrl: context.h.resourceUrl({ resourceId: context.resource._decorated?.id() || context.resource.id() }),
                    notice: {
                        message: context.translateMessage(isCreate ? 'successfullyCreated' : 'successfullyUpdated', context.resource.id()),
                        type: 'success',
                    },
                    record: record.toJSON(context.currentAdmin)
                };
            } catch (e) {
                console.log(e);
                const record = context.resource.build(request.payload || {});
                return {
                    record: record.toJSON(context.currentAdmin),
                    notice: {
                      message: context.translateMessage('thereWereValidationErrors', context.resource.id()),
                      type: 'error',
                    },
                  }
            }
        }
    }
}