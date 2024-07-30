const itemForm = document.getElementById('item-form');
const itemInput = document.getElementById('item-input');
const itemList = document.getElementById('item-list');
const clrButton = document.getElementById('clear');
const itemFilter = document.getElementById('filter');
let isEditMode = false;
const formBtn = itemForm.querySelector('button');

function displayItems(){
   const itemsFromStorage = getItemsFromStorage();

   itemsFromStorage.forEach(item => addItemtoDom(item));
   checkUI();
}


function addItem(e) {
   e.preventDefault();

   const newItem = itemInput.value;
   //validate input
   if (newItem === '') {
      alert('Please add an item');
      return;
   }

   //check for edit mode
   if (isEditMode){
      const itemToEdit = itemList.querySelector('.edit-mode');

      removeItemFromStorage(itemToEdit.textContent);
      itemToEdit.classList.remove('edit-mode');
      itemToEdit.remove();
      isEditMode = false;
   } else {
      if (checkIfItemExists(newItem)) {
         alert('That Item already exists!');
         return
      }
   }

   //create item DOM element
   addItemtoDom(newItem);   
   
   //add item to local storage
   addItemToStorage(newItem);

   itemInput.value = '';
   checkUI();
}

function addItemtoDom(item) {
   //create list item
   const li = document.createElement('li');
   li.appendChild(document.createTextNode(item));

   const btn = document.createElement('button');
   btn.className = 'remove-item btn-link text-red';

   const icon = document.createElement('i');
   icon.className = 'fa-solid fa-xmark';
   btn.appendChild(icon);
   li.appendChild(btn);
   itemList.appendChild(li);
}

function addItemToStorage(item) {
   const itemsFromStorage = getItemsFromStorage();

   //add new item to array
   itemsFromStorage.push(item);
   console.log(itemsFromStorage);

   //convert to JSON string and set to local storage
   localStorage.setItem('items', JSON.stringify(itemsFromStorage));
}

function getItemsFromStorage() {
   let itemsFromStorage;
   if(localStorage.getItem('items') === null){
      itemsFromStorage = [];
   } else {
      itemsFromStorage = JSON.parse(localStorage.getItem('items'));
   }

   return itemsFromStorage;
}

function onClickItem(e) {
   if (e.target.parentElement.classList.contains('remove-item')) {
      e.target.parentElement.parentElement.remove();
      removeItem(e.target.parentElement.parentElement);
      } else {
         setItemToEdit(e.target);
      }
}

function checkIfItemExists(item) {
   const itemsFromStorage = getItemsFromStorage();

   return itemsFromStorage.includes(item);
}


function setItemToEdit(item) {
   isEditMode = true;

   itemList.querySelectorAll('li').forEach((i) => i.classList.remove('edit-mode'));

   item.classList.add('edit-mode');
   formBtn.innerHTML = '<i class="fa-solid fa-pen"></i> Update Item';
   formBtn.style.backgroundColor = '#228B22';
   itemInput.value = item.textContent;
}

function removeItem(item) {
    item.remove();
      
    //remove from storage
    removeItemFromStorage(item.textContent);
    checkUI();  
}

function removeItemFromStorage(item) {
   let itemsFromStorage = getItemsFromStorage();
   
   //filter out item to be removed
   itemsFromStorage = itemsFromStorage.filter((i) => i != item);

   //re-set local storage
   localStorage.setItem('items', JSON.stringify(itemsFromStorage));
}



function clearItems(e) {
   //itemList.textContent = '';
   if (confirm('Are you sure?')) {
      while (itemList.firstChild) {
         itemList.removeChild(itemList.firstChild);
      } 
   }
   checkUI();
   localStorage.removeItem('items');
}

function filterItems(e) {
   const text = e.target.value.toLowerCase();
   const items = itemList.querySelectorAll('li');

   items.forEach(item => {
      const itemName = item.firstChild.textContent.toLowerCase();

      if (itemName.indexOf(text) != -1) {
         item.style.display = 'flex';
      } else {
         item.style.display = 'none';
      }
   });

}


function checkUI() {
   itemInput.value = '';
   const items = itemList.querySelectorAll('li');
   if (items.length === 0){
      clrButton.style.display = 'none';
      itemFilter.style.display = 'none';
   } else {
      clrButton.style.display = 'block';
      itemFilter.style.display = 'block';
   }

   formBtn.innerHTML = '<i class="fa-solid fa-plus"></i> Add Item';
   formBtn.style.backgroundColor = '#333';

   isEditMode = false;
}

//initialize app
function init() {
   //Event Listener
   itemForm.addEventListener('submit', addItem);
   itemList.addEventListener('click', onClickItem);
   clrButton.addEventListener('click', clearItems);
   itemFilter.addEventListener('input', filterItems);
   document.addEventListener('DOMContentLoaded', displayItems);
   checkUI();
}

init();


