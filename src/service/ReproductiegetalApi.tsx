import axios from 'axios';

export function getReproductiegetal() {
    return axios('https://data.rivm.nl/covid-19/COVID-19_reproductiegetal.json');
}
