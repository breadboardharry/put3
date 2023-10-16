import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class TypeService {

    constructor() { }

    public static isPartOfEnum<T extends object>(value: any, enumType: T): value is T[keyof T] {
        return Object.values(enumType).includes(value);
    }

}
