export interface CreateResourceHandler<T extends object, T_C extends object> {
    create(toCreate: T_C, userId: number): Promise<T>;
}

export interface UpdateResourceHandler<T extends object, T_U extends object> {
    update(id: number, toUpdate: T_U): Promise<T>;
}


export type ResourceHandler<T extends object, T_C extends object = any, T_U extends object = any>  = Partial<CreateResourceHandler<T, T_C> & UpdateResourceHandler<T, T_U>>;