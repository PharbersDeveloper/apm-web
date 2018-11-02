import DS from 'ember-data';
import { inject } from '@ember/service';
import rsvp from 'rsvp';

export function InvalidError(resolve, reject, data) {
    if (data.errors !== undefined) {
        return reject(new DS.InvalidError(data.errors))
    } else {
        return resolve(data);
    }
}

export default DS.JSONAPIAdapter.extend({
    cookies: inject(),
    handleResponse(status) {
        return this._super(...arguments);
    },
    init() {
        this.set('headers', {
            "dataType": 'json',
            "contentType": 'application/json',
            "Content-Type": 'application/json'
        })
    },
    queryObject(url, store, type, jsonObject) {
        this.set('headers.Authorization', "bearer " + this.get('cookies').read('token'))
        return new rsvp.Promise((resolve, reject) => {
            this.ajax(url, 'POST', { data: jsonObject })
                .then(data => InvalidError(resolve, reject, data))
                .catch(() => reject('failed'))
        });
    },
    queryMultipleObject(url, store, type, jsonObject) {
        this.set('headers.Authorization', "bearer " + this.get('cookies').read('token'))
        return new rsvp.Promise((resolve, reject) => {
            this.ajax(url, 'POST', { data: jsonObject })
                .then(data => InvalidError(resolve, reject, data))
                .catch(() => reject('failed'))
        });
    },
    transaction(url, store, type, jsonObject) {
        this.set('headers.Authorization', "bearer " + this.get('cookies').read('token'))
        return new rsvp.Promise((resolve, reject) => {
            this.ajax(url, 'POST', { data: jsonObject })
                .then(data => InvalidError(resolve, reject, data))
                .catch(() => reject('failed'))
        });
    },
});
