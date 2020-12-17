import axios from 'axios';

export default class Location {

    getLocation() {
		return axios.get('demo/data/location.json').then(res => res.data.data);
	}

	getCracks() {
		return axios.get('demo/data/cracks.json').then(res => res.data.data);
	}

	getUsers() {
		return axios.get('demo/data/users.json').then(res => res.data.data);
	}

	getMainteanceOrder() {
		return axios.get('demo/data/mainteanceOrder.json').then(res => res.data.data);
	}

	getMainteanceWorker() {
		return axios.get('demo/data/mainteanceWorker.json').then(res => res.data.data);
	}
}
