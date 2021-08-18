import { client } from "./client.js";

function renderMoreContacts(containerSelector, contactsIterable) {
    let targetClientHTML = '';
    contactsIterable.forEach((elem) => {
       targetClientHTML += client.renderRow(elem);
    });
    document.querySelector(containerSelector).innerHTML = targetClientHTML;
}

export { renderMoreContacts }