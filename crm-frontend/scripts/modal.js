import { $ } from "../helpers/DOM.js"
import {clientController} from "./client_controllers.js";
import { onServe } from "../helpers/serving.js";

// P.S onclick используем для предотвращения дублирования обработчиков "Цикла жизни" формы

const modal = {

    // Сеттер для принятия id клиента из нижнего уровня
    set clientID(id) {
      if (typeof id === "number") {
          this.id = id;
      } else {
          console.log('Передано неверное значение идентификатора клиента');
      }
    },

    // Функция нижнего уровня открытия модального окна
    "onOpen": function(selector) {
        $.selector(selector).classList.remove('hidden');
    },

    // Функция верхнего уровня открытия модального окна

    "open": function(defaultSelector = null) {
        if (defaultSelector) {
            this.onOpen(defaultSelector);
            //this.showContactsForm(); - ???
            return;
        }
        this.onOpen('.modal');
    },


    // Функция верхнего уровня закрытия модального окна
    "close": function() {
        // Закрываем модалку при нажатии на кнопку закрытия, определённым классом modal__close
        $.selectorAll('.modal__close').forEach((elem) => {
            elem.addEventListener('click', (event) => {
               this.onClose(event);
               this.clearContactsForm();
               this.clearFullNameForm();
            });
        });
        // Закрывам модалку при нажатии на оверлей
        [...$.selectorAll('.modal')].forEach((elem) => {
           elem.addEventListener('click', (event) => {
               if (event.target.isEqualNode(elem)) {
                   this.onClose(event);
                   this.clearContactsForm();
                   this.clearFullNameForm();
               }
           });
        });
    },

    // Функция верхнего уровня добавления контактов
    "addContact": function() {
        this.onAddContact.contactIsInit = false;
        $.selector('.modal__action_contact_btn').onclick = () => {
            this.onAddContact();
            this.setAddContactLimit();
        };
    },

    // Функция верхнего уровня удаления контактов клиента
    "removeContact": function () {
        $.delegate('click', (event) => {
            this.onRemoveContact.call(this, event);
        }, '.modal__contact_delete', '.modal');
    },

    // Точка инициализации "общего" модального окна
    "action": function(isDeleteModal) {
        !isDeleteModal ? this.open() : this.open('[delete-modal]');
        this.onAction();
        if (!isDeleteModal) {
            this.addContact();
            this.removeContact();
        }
        this.close();
    },

    // Функция-арбитр для изменения поведения в зависимости от дата атрибута
    "onAction": function() {
        $.selectorAll('.modal__save_state_btn').forEach((elem) => {
           elem.onclick = (event) => {
               const targetAction = event.target.closest('.modal').dataset.action;
               if (targetAction === 'add') {
                   this.onAdd(event);
               } else if (targetAction === 'change') {
                   this.onChange(event);
               } else if (targetAction === 'delete') {
                   this.onDelete(event);
               }
           };
        });
    },

    // Низкоуровневая функция закрытия модального окна
    "onClose": function(event) {
        event.target.closest('.modal').classList.add('hidden');
    },

    // Низкоуровневая функция добавления клиента
    "onAdd": function(event) {
        const targetURL = "http://localhost:3000/api/clients";
        const targetObject = this.onSubmit();
        const typeRequest = "POST";
        onServe(targetURL, typeRequest, targetObject).then((body) => {
            const targetObject = {
                action: 'add',
                data: body
            }
            clientController(targetObject);
            this.clearFullNameForm();
            this.clearContactsForm();
            this.onClose(event);
        });
    },

    // Низкоуровневая функция изменения клиента
    "onChange": function (event) {
        const targetURL = `http://localhost:3000/api/clients/${this.id}`;
        const targetObject =this.onSubmit();
        const typeRequest = "PATCH";
        onServe(targetURL, typeRequest, targetObject).then((body) => {
            const targetObject = {
                action: 'change',
                data: body
            }
            clientController(targetObject);
            this.clearFullNameForm();
            this.clearContactsForm();
            this.onClose(event);
        });
    },

    // Низкоуровневая функция удаления клиента

    "onDelete": function(event) {
        const targetURL = `http://localhost:3000/api/clients/${this.id}`;
        const typeRequest = "DELETE";
        onServe(targetURL, typeRequest).then(() => {
           const targetObject = {
               action: 'delete',
               data: {
                   id: this.id
               }
           };
           clientController(targetObject);
           this.onClose(event);
        });
    },

    // Низкоуровневая функция добавления контакта
    "onAddContact": function() {
        if (!this.onAddContact.contactIsInit) {
            $.selector('.modal__contact_rows').classList.remove('hidden');
            this.onAddContact.contactIsInit = true;
        }
        $.selector('.modal__contact_rows').insertAdjacentElement('beforeend', this.getContactRow());
    },

    "getContactRow": function () {
        const contactRow = `
        <li class="modal__contact_row">
            <select class="modal__contact_type">
                <option value="phone">Телефон</option>
                <option value="add_phone">Доп.телефон</option>
                <option value="email">Email</option>
                <option value="vk">Vk</option>
                <option value="facebook">Facebook</option>
            </select>
            <input class="modal__contact_input">
            <button class="modal__contact_delete"></button>
        </li>
        `;
        return new DOMParser().parseFromString(contactRow, 'text/html').querySelector('.modal__contact_row');
    },

    // Низкоуровневая функция удаления контакта
    "onRemoveContact": function(event) {
        event.target.closest('.modal__contact_row').remove();
        if ($.selectorAll('.modal__contact_row').length === 0) {
            this.clearContacts();
        }
        this.setAddContactLimit();
    },

    // Функция верхнего уровня очистки контактов
    "clearContacts": function () {
        this.clearContactsForm();
        this.onAddContact.contactIsInit = false;
    },

    // Низкоуровневая функция обработки полей ввода полного имени
    "onFullName": function() {
        const name = $.selector('#name').value;
        const surname = $.selector('#surname').value;
        const lastName = $.selector('#patronymic').value;
        return {
            name,
            surname,
            lastName
        }
    },

    "clearContactsForm": function() {
        const targetContactForm = document.querySelector('.modal__contact_rows');
        targetContactForm.classList.add('hidden');
        targetContactForm.innerHTML = '';
    },

    "showContactsForm":function() {
      document.querySelector('.modal__contact_rows').classList.remove('hidden');
    },

    "clearFullNameForm": function() {
      document.forms.fullName.reset();
    },

    // Низкоуровневая функция обработки контактов
    "onContacts": function() {
        const targetContactRows = $.selectorAll('.modal__contact_type, .modal__contact_input');
        const targetContacts = targetContactRows.length === 0 ? null : {
            contacts: []
        };
       targetContactRows.forEach((node, index) => {
           if (index + 1 === targetContactRows.length || (index % 2 !== 0 && index !== 0 )) {
               return;
           }
           targetContacts.contacts.push({
               type: node.value,
               value: targetContactRows[index + 1].value
           });

       });
       return targetContacts;
    },

    // Функция верхнего уровня формирования объекта клиента
    "onSubmit": function() {
        return Object.assign({}, this.onFullName(), this.onContacts());
    },

    "modalPrerender": function() {
        onServe(`http://localhost:3000/api/clients/${this.id}`, 'GET').then((client) => {
            const {name, surname, lastName, contacts} = client;
            this.fullNameRender(name, surname, lastName);
            if (contacts.length) {
                this.showContactsForm();
                this.contactsPrerender(contacts);
            }
        });
    },

    "fullNameRender": function(name, surname, patronymic) {
        document.querySelector('#surname').value = surname;
        document.querySelector('#name').value = name;
        document.querySelector('#patronymic').value = patronymic;
    },

    "contactsPrerender": function(contacts) {
        contacts.forEach((elem) => {
            this.contactPrerender(elem);
        });
    },

    "setAddContactLimit": function() {
        const countContacts = document.querySelectorAll('.modal__contact_rows > li').length;
        const addContactBtn = document.querySelector('.modal__action_contact_btn');
        countContacts >= 10 ? addContactBtn.disabled = true : addContactBtn.disabled = false;
    }
    ,

    "contactPrerender": function(contact) {
        const {type, value} = contact;
        const targetContactRow = this.getContactRow();
        targetContactRow.querySelector('.modal__contact_type').value = type;
        targetContactRow.querySelector('.modal__contact_input').value = value;
        console.log(targetContactRow);
        document.querySelector('.modal__contact_rows').insertAdjacentElement("beforeend", targetContactRow);
    },

    // Действия на нажатие кнопки снизу основного действия ("Удалить клиента", "Отменить")
    "secondAction": function() {
        document.querySelector('.modal__cancel_state_btn').onclick = (event) => {
           switch (event.target.dataset.action) {
               case 'cancel':
                   this.onCancel();
               case 'delete':
                   this.onDelete(event);
           }
        };
    },

    "onCancel": function() {
        document.querySelector('[data-action="cancel"]').addEventListener('click', (event) => {
            this.onClose(event);
        });
    },

    "onRemove": function() {
        document.querySelector('[data-action="delete"]').addEventListener('click', (event) => {
            console.log(event.target);
        });
    }
};

// Создаём объекты для реализации конкретных свойств

let add_modal = Object.create(modal);
let change_modal = Object.create(modal);
let delete_modal = Object.create(modal);

delete_modal['openDelete'] = function(id) {
    modal.clientID = parseInt(id);
    $.selector('[delete-modal]').dataset.action = 'delete';
    $.selector('[delete-modal] .modal__title').textContent = 'Удалить клиента';
    $.selector('[delete-modal] .modal__description').textContent = 'Вы действительно хотите удалить данного клиента?';
    const secondActionNode = $.selector('.modal [data-action]');
    secondActionNode.dataset.action = 'cancel'
    secondActionNode.textContent = 'Отмена'
    this.action(true);
    this.secondAction();
}.bind(delete_modal);

add_modal['openAdd'] = function() {
    $.selector('.modal').dataset.action = 'add';
    $.selector('.modal__title').textContent = 'Новый клиент';
    const secondActionNode = $.selector('.modal [data-action]');
    secondActionNode.dataset.action = 'cancel'
    secondActionNode.textContent = 'Отмена'
    this.action();
    this.secondAction();
}.bind(add_modal);

change_modal['renderID'] = function(id) {
    $.selector('.modal__client_id').textContent = id;
    $.selector('.modal__client_id').classList.remove('hidden');
};

change_modal['openChange'] = function(id) {
    this.renderID(id);
    modal.clientID = parseInt(id);
    this.modalPrerender()
    $.selector('.modal').dataset.action = 'change';
    $.selector('.modal__title').textContent = 'Изменить данные';
    $.selector('.modal__client_id').classList.remove('hidden');
    const secondActionNode = $.selector('.modal [data-action]');
    secondActionNode.dataset.action = 'delete'
    secondActionNode.textContent = 'Удалить клиента'
    this.action();
    this.secondAction();
}.bind(change_modal);


export { add_modal, change_modal, delete_modal };