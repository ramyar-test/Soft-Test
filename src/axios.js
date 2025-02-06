import axios from 'axios';

const instance = axios.create({
    baseURL: 'http://blog-panel.suly-soft.com.www67.your-server.de/api',
    headers: {
        'Content-Type': 'application/json',
        'x-key': '7368169e-b2b6-39c1-99a7-1e00804854c8',
    },
});

export default instance;