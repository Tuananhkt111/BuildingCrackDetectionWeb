import axios from 'axios';
import { locationApi } from "../apis/location";
import { crackApi } from "../apis/cracks";
import { mainteanceOrderApi } from "../apis/maintenanceOrder";
export default class Location {

    getLocation() {
		return locationApi.getAll();
	}

	getCracks() {
		return crackApi.getAll();
	}

	getUsers() {
		return axios.get('demo/data/users.json').then(res => res.data.data);
	}

	getMainteanceOrder() {
		return mainteanceOrderApi.getAll();
	}

	getMainteanceOrderById(id) {
		return mainteanceOrderApi.getById(id);
	}

	getMainteanceWorker() {
		return axios.get('demo/data/mainteanceWorker.json').then(res => res.data.data);
	}
}
