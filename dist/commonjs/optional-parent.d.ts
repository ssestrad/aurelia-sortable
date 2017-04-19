import { Container } from 'aurelia-dependency-injection';
export declare class OptionalParent {
    private key;
    constructor(key: Function | string);
    get(container: Container): any;
    static of(key: Function | string): OptionalParent;
}
