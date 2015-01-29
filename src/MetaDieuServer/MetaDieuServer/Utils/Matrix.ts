export class Matrix<T> {

    private matrix: T[][];

    constructor(public width: number, public height: number) {

        this.matrix = new Array<Array<T>>(height);

        for (var i = 0; i < width; i++) {
            this.matrix[i] = new Array<T>(height);
        }
    }

    getItem(x: number, y: number) {
        return this.matrix[x][y];
    }

    setItem(x: number, y: number, value: T) {
        this.matrix[x][y] = value;
    }
}