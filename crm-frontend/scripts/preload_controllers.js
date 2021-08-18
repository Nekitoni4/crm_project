import { renderMoreContacts } from './preload_clients.js';
import { onServe } from "../helpers/serving.js";

onServe('http://localhost:3000/api/clients', 'GET').then((contacts) => {
    renderMoreContacts('.clients__inner', contacts);
    tippy('[data-tippy-content]');
});