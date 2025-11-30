import axios from 'axios';

export const gatewayApi = axios.create({
  baseURL: 'http://localhost:8081/api/v1',
  headers: { 'Content-Type': 'application/json' }
});

export const coreApi = axios.create({
  baseURL: 'http://localhost:8082/api/v2/banking',
  headers: { 'Content-Type': 'application/json' }
});