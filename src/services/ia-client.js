const axios = require('axios');

const IA_API_ENDPOINT = 'https://ia.sport-care.net';
const RMSSD_ENPOINT = IA_API_ENDPOINT + '/rmssd';
const STATE_ENDPOINT = IA_API_ENDPOINT + '/state';

 const getRmssd = (heartrate) => {
    return axios.post(RMSSD_ENPOINT, heartrate);
}

 const getState = (listRmssd) => {
    return axios.post(STATE_ENDPOINT, listRmssd);
}

exports.getRmssd = getRmssd;
exports.getState = getState;
