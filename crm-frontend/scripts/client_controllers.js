import { client } from "./client.js";

function clientController(clientObject) {
    const {data, action} = clientObject;
    if (action === 'add') {
        client.addRow('.clients__inner', data);
        tippy('[data-tippy-content]');
    } else if (action === 'change') {
        client.changeRow(data.id, data);
        tippy('[data-tippy-content]');
    } else if (action === 'delete') {
        client.deleteRow(data.id);
    }
}


export { clientController };
