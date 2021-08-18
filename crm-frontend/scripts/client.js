import { $ } from '../helpers/DOM.js';


const client = Object.freeze({

    // Низкоуровневая функция подготовки разметки к отрисовке

   'renderRow': function(clientData) {
       const {id, name, surname, lastName, createdAt, updatedAt, contacts} = clientData;
       const [formatCreatedAtDate, formatCreatedAtTime] = this.getFormatDate(createdAt);
       const [formatUpdatedAtDate, formatUpdatedAtTime] = this.getFormatDate(updatedAt);
       const clientRow = `
       <tr class="client_row">
            <td data-id="${id}">${id}</td>
            <td data-fullname>${name} ${surname} ${lastName}</td>
            <td data-createdAt>${formatCreatedAtDate}<span class="time">${formatCreatedAtTime}</span></td>
            <td data-updatedAt>${formatUpdatedAtDate}<span class="time">${formatUpdatedAtTime}</span></td>
            <td data-contacts>${contacts.length > 0 ? this.processingContactRow(contacts): ''}</td>
            <td data-change>Изменить</td>
            <td data-remove>Удалить</td>
       </tr>
       `
       return clientRow;
   },

    'deleteRow': function(id) {
        $.selector(`[data-id="${id}"]`).closest('tr').remove();
    },

    // Низкоуровневая функция добавления клиента в клиентский контейнер

    'addRow': function(containerSelector, clientData) {
       $.selector(containerSelector).insertAdjacentHTML('beforeend', this.renderRow(clientData));
       console.log('Вызов коллбека добавления строки');
       this.openMoreContacts();
    },

    // Низкоуровневая функция изменения строки клиента

    'changeRow': function(rowID, clientData) {
       const targetNode = this.renderRow(clientData);
       $.selector(`[data-id="${rowID}"]`).closest('.client_row').innerHTML = targetNode;
    },

    // Обработка контактов для последующего рендера

    "processingContactRow": function(contacts) {
       let mainWrapper = this.renderContactsWrapper();
       let targetRow = this.renderContactRow();
       contacts.forEach((contact, index) => {
           if (index === 4) {
               const controlContact = this.renderControlContact(contact, contacts.length);
               targetRow.insertAdjacentHTML('beforeend', controlContact);
               mainWrapper.appendChild(targetRow);
               targetRow = this.renderContactRow();
               targetRow.classList.add('hidden');
           } else {
               let targetContact = this.contactsAssociate(contact);
               targetRow.insertAdjacentHTML('afterbegin', targetContact);
           }
       });
       mainWrapper.appendChild(targetRow);
       return mainWrapper.outerHTML;
    },

    // Обработка конкретных типов контактов и возвращение нужной разметки
    "contactsAssociate": function (contact) {
       switch (contact.type) {
           case 'phone':
               return `<span class="contacts__item" data-tippy-content="Телефон: ${contact.value}" data-phone></span>`;
           case 'add_phone':
               return `<span class="contacts__item" data-tippy-content="Доп.телефон: ${contact.value}" data-add_phone></span>`;
           case 'email':
               return `<span class="contacts__item" data-tippy-content="Электронная почта: ${contact.value}" data-email></span>`;
           case 'vk':
               return `<span class="contacts__item" data-tippy-content="Вконтакте: ${contact.value}" data-vk></span>`;
           case 'facebook':
               return `<span class="contacts__item" data-tippy-content="Facebook: ${contact.value}" data-facebook></span>`;
       }
    },

    // Низкоуровневая функция создания строки

    "renderContactRow": function () {
       const row = document.createElement('li');
       row.classList.add('contacts__row');
       return row;
    },

    // Никзоуровневая функция создания разметки количества контактов
    "renderControlContact": function(contact, numberContacts) {
       const contactsDiff = numberContacts - 4;
       const controlContact = `
       <div class="contacts__control_item">
         <span class="control__elem hidden">${this.contactsAssociate(contact)}</span>
         <span class="contacts__item" data-count_contacts>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="8" cy="8" r="7.5" stroke="#9873FF"/>
                <text x="0" y="12" font-family="Verdana" font-size="9" fill="black">+${contactsDiff}</text>
            </svg>
        </span>
       </div>
       `;
       return controlContact;
    },

    // Создание контейнера для "клиентских строк"
    "renderContactsWrapper": function() {
       const wrapper = document.createElement('ul');
       wrapper.classList.add('contacts__rows');
       return wrapper;
    },

    "getFormatDate": function(date) {
       const targetDate = new Date(date);
       return targetDate.toLocaleString().split(',');
    },

    // Высокоуровневая функция для просмотра доп.контактов
    "openMoreContacts": function() {
       console.log('Запуск обработчика открытие доп контактов');
       $.selectorAll('[data-count_contacts]').forEach((elem) => elem.addEventListener('click', this.onOpenMoreContacts));
    },

    // Низкоуровневая функция для просмотра доп.контактов
    "onOpenMoreContacts": function(event) {
       const targetRow = event.target.closest('.contacts__rows').querySelector('.contacts__row:last-child');
       const targetControlElem = event.target.closest('[data-count_contacts]');
       targetControlElem.classList.add('hidden');
       targetControlElem.previousElementSibling.classList.remove('hidden');
       targetRow.classList.remove('hidden');
    }
});

    // Обработчик для получения идентификатора клиента
function getClientID(event) {
    let targetID = null;
    for (let node of event.target.closest('.client_row').children) {
        if (node.dataset.id) {
            targetID = node.dataset.id;
            break;
        }
    }
    return targetID;
}


export { client, getClientID };