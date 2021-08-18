import {client} from "./client.js";
import {clientHelper} from "../helpers/client.js";

const sort = {
    ascCompare(prev, next) {
        if (prev < next) {
            return -1;
        } else if (prev > next) {
            return 1;
        }
        return 0;
    },

    descCompare(prev, next) {
        if (prev < next) {
            return 1;
        } else if (prev > next) {
            return -1;
        }
        return 0;
    },

    sortDataToggle(node) {
        const targetDataSort = node.dataset.sort.toUpperCase();
        if (targetDataSort === 'ASC') {
            node.dataset.sort = 'DESC';
        } else if (targetDataSort === 'DESC') {
            node.dataset.sort = 'ASC';
        }
    },

    getSortData(node) {
        return node.dataset.sort.toUpperCase();
    },

    getAllClientRows() {
        return document.querySelectorAll('.clients__inner > tr');
    },

    ascDescController(prev, next, sortData) {
        return sortData === 'ASC' ? this.ascCompare(prev, next) : this.descCompare(prev, next);
    },

    getSortedArray(datasetColumn, node, processingCallback) {
        const clients = this.getAllClientRows();
        const sortData = this.getSortData(node);
        this.sortDataToggle(node);
        return [...clients].sort((prevElem, nextElem) => {
            const prevElemValue = prevElem.querySelector(datasetColumn).textContent;
            const nextElemValue = nextElem.querySelector(datasetColumn).textContent;
            const [firstValue, secondValue] = processingCallback(prevElemValue, nextElemValue);
            return this.ascDescController(firstValue, secondValue, sortData);
        });
    },

    renderNewClientRows(nodesArray) {
        nodesArray.forEach((elem) => {
           document.querySelector('.clients__inner').insertAdjacentElement('afterbegin', elem);
        });
    },

    clientsFullRender(nodesArray) {
        clientHelper.clearContacts();
        this.renderNewClientRows(nodesArray);
    },

    sort(datasetColumn, node, processingCallback) {
        this.clientsFullRender(this.getSortedArray(datasetColumn, node, processingCallback));
    }
}


const sortByID = Object.create(sort);
const sortByFullName = Object.create(sort);
const sortByCreateDate = Object.create(sort);
const sortByChangeDate = Object.create(sort);

sortByID['action'] = function (sortNodeBtn) {
    this.sort('[data-id]', sortNodeBtn, (first, second) => {
        return [parseInt(first), parseInt(second)];
    });
};

sortByFullName['action'] = function (sortNodeBtn) {
    this.sort('[data-fullname]', sortNodeBtn, (first, second) => [first, second]);
}

sortByCreateDate['action'] = function (sortNodeBtn) {
    this.sort('[data-createdAt]', sortNodeBtn, (first, second) => {
       return [new Date(first).getTime(), new Date(second).getTime()];
    });
}

sortByChangeDate['action'] = function (sortNodeBtn) {
    this.sort('[data-updatedAt]', sortNodeBtn, (first, second) => {
        return [new Date(first).getTime(), new Date(second).getTime()];
    });
}


function sortController(event) {
    switch (event.target.id) {
        case 'id':
            sortByID.action(event.target);
            return;
        case 'full_name':
            sortByFullName.action(event.target);
            return;
        case 'create_date':
            sortByCreateDate.action(event.target);
            return;
        case 'change_date':
            sortByChangeDate.action(event.target);
            return;
    }
}


export { sortController, sort };