import {client} from "./client.js";
import {onServe} from "../helpers/serving.js";
import {clientHelper} from "../helpers/client.js";


const search = {
    action() {
        document.querySelector('.header_search').addEventListener('keyup', (event) => {
            this.getSearch(event);
        });
    },

    getSearch: function(event) {
        const searchValue = event.target.value;
        this.sendSearchRequest(searchValue);
    },

    sendSearchRequest(searchValue) {
      const url = `http://localhost:3000/api/clients?search=${searchValue}`;
      const request = 'GET';
      onServe(url, request).then((clientsData) => {
          this.renderClientsData(clientsData);
      });
    },

    renderClientsData(clientsData) {
        let targetClientHTML = ``;
        clientsData.forEach((elem) => {
            targetClientHTML += client.renderRow(elem);
        });
        clientHelper.clearContacts();
        document.querySelector('.clients__inner').innerHTML = targetClientHTML;
    },
}

search.action();

export {search};