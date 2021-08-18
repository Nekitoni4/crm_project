/** Модуль для более простого доступа к DOM */

const $ = (function() {



    return {
        selector: (selector) => document.querySelector(selector),
        selectorAll: (selector) => document.querySelectorAll(selector),
        fragment: () => document.createDocumentFragment,
        on: (event, selector, callback) => {
            document.querySelector(selector).addEventListener(event, callback)
        },
        delegate: (on, callback, delegatedSelector, delegatingSelector = 'body') => {
            document.querySelector(delegatingSelector).addEventListener(on, (event) => {
                if (event.target.isEqualNode(document.querySelector(delegatedSelector))) {
                    callback(event)
                }
            })
        },
        removeAllChildNodes: (parent) => {
            while (parent.firstChild) {
                parent.removeChild(parent.firstChild);
            }
        },
    }

})()


export { $ }