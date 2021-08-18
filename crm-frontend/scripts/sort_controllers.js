import {sortController} from "./sort.js";


document.querySelectorAll('.clients__col').forEach((elem) => {
   elem.addEventListener('click', sortController);
});