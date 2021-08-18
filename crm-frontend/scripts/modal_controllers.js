import { add_modal, change_modal, delete_modal } from "./modal.js";
import { $ } from "../helpers/DOM.js";
import { getClientID } from "../scripts/client.js";

$.selector('#add_client').addEventListener('click', add_modal.openAdd)

$.delegate('click', (event) => {
    change_modal.openChange(getClientID(event));
}, '[data-change]', '.clients');

$.delegate('click', (event) => {
    delete_modal.openDelete(getClientID(event));
}, '[data-remove]', '.clients');