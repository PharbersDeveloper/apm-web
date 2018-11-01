import DS from 'ember-data';
import { inject } from '@ember/service';
import rsvp from 'rsvp';

export default DS.JSONAPIAdapter.extend({
	cookies: inject(),
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
				.then(data => resolve(data))
				.catch(() => reject('failed'))
		});
	},
	queryMultipleObject(url, store, type, jsonObject) {
		this.set('headers.Authorization', "bearer " + this.get('cookies').read('token'))
		return new rsvp.Promise((resolve, reject) => {
			this.ajax(url, 'POST', { data: jsonObject })
				.then(data => resolve(data))
				.catch(() => reject('failed'))
		});
	},
	transaction(url, store, type, jsonObject) {
		this.set('headers.Authorization', "bearer " + this.get('cookies').read('token'))
		return new rsvp.Promise((resolve, reject) => {
			this.ajax(url, 'POST', { data: jsonObject })
				.then(data => resolve(data))
				.catch(() => reject('failed'))
		});
	},
});