export class Dictionary<TKey, TValue> {

    private jsonDictionary: any;

    public constructor() {
        this.jsonDictionary = {};
    }

    add(key: TKey, value: TValue) {
        this.jsonDictionary[key] = value;
    }

    getByKey(key: TKey) : TValue {
        return this.jsonDictionary[key];
    }

    getByIndex(i: number) : TValue {
        return this.jsonDictionary[Object.keys(this.jsonDictionary)[i]];
    }

    length() {
        return Object.keys(this.jsonDictionary).length;
    }

    contains(key: TKey) {
        return this.getByKey(key) != null;
    }

    remove(key: TKey) {
        delete this.jsonDictionary[key];
    }
}