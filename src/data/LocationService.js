import axios from 'axios';

export default class Location {

    getLocation() {
		return axios.get('demo/data/location.json').then(res => res.data.data);
	}
}
