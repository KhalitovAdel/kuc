import { Locale } from "adminjs";

export class I18nUtil {
    private static readonly propertyMetadataKey = `${I18nUtil.name}:property`;
    private static readonly propertyKeysMetadataKey = `${I18nUtil.name}:propertyKeys`;
    private static readonly classMetadataKey = `${I18nUtil.name}:class`;

    constructor(private readonly entities: Function[]) {}

    // TODO: Fix this MVP
    public getLocale(): Locale {
        return {
            language: 'ru',
            translations: {
                actions: {
                    show: 'Детали',
                    edit: 'Изменить',
                    delete: 'Удалить',
                    bulkDelete: 'Удалить выделенное',
                    new: 'Создать',
                    list: 'Список',
                    search: 'Найти',
                    file: 'Файл'
                },
                labels: this.entities.reduce((acc, curr) => {
                    const metadata = Reflect.getMetadata(I18nUtil.classMetadataKey, curr);
                    if (!metadata) return acc;
        
                    return {...acc, [metadata.entity?.name]: metadata.translate};
                }, {} as Record<string, string>),
                resources: this.entities.reduce((acc, curr) => {
                    const metadata = Reflect.getMetadata(I18nUtil.classMetadataKey, curr);
                    if (!metadata) return acc;
                    const keys: string[] = (Reflect.getMetadata(I18nUtil.propertyKeysMetadataKey, curr.prototype) as any[] || []);
                    if (!keys.length) return acc;
        
                    const properties = keys.reduce((acc, key) => {
                        const m = Reflect.getMetadata(I18nUtil.propertyMetadataKey, curr.prototype, key);
                        if (!m) return acc;

                        const extra = m.enumTranslate 
                            ? Object.entries(m.enumTranslate).reduce((ac, [k, v]) => {
                                return {...ac, [`${key}.${k}`]: String(v)}
                            }, {})
                            : {};
        
                        return {...acc, [key]: m.translate, ...extra};
                    }, {})
        
                    return {...acc, [metadata.entity?.name]: { properties }};
                }, {})
            }
        }
    }

    public static getPropertyDecorator() {
        return function<T extends string>(translate: string, enumTranslate?: Record<T, string>): PropertyDecorator {
            return (target, propertyKey) => {
                Reflect.defineMetadata(I18nUtil.propertyMetadataKey, { translate, enumTranslate }, target, propertyKey);
                const keys = Reflect.getMetadata(I18nUtil.propertyKeysMetadataKey, target) || [];
                Reflect.defineMetadata(I18nUtil.propertyKeysMetadataKey, [...keys, propertyKey], target);
            }
        }
    }

    public static getClassDecorator() {
        return function(entity: Function, translate: string): ClassDecorator {
            return Reflect.metadata(I18nUtil.classMetadataKey, { entity, translate });
        }
    }
}