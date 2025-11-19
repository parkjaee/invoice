import axios from 'axios';

const client = axios.create({
    baseURL: '"http://192.168.200.152:8080"',
    withCredentials: true,
    timeout: 15000
});

//공통 인터셉터(옵션)
client.interceptors.request.use(
    res => res,
    err => {
        // 에러 공통 처리
        return Promise.reject(err);
    }
);

export default client;