import _ from 'lodash';

export class DateExtractor {
    private readonly data: Array<Array<string | Date>>;

    constructor(data: Array<Array<string | Date>>) {
        this.data = data;
    }

    public extractDates() {
        return _(this.data[1]).without("").value();
    }

    extractUsersRow(username: string, spitAt: number) {
        return _(this.data)
            .thru(function (coll) {
                return _.union(coll, _.map(coll, e => [_.head(e)]));
            })
            .find(function (n) {
                return n.includes(username);
            }).slice(1, spitAt + 1);
    }
}
