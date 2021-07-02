
  //Function: Add Todo Item
  const addTodoItem = item => {
    const li = document.createElement('li');
    if (item.status) li.classList.add('item-complete');
    // li.dataset.id = item.id;
    li.innerHTML = `<span class="item-check">
      <img src="img/icon-check.svg" alt="">
    </span>${ item.name }
    <span class="item-remove"><img src="img/icon-cross.svg" alt=""></span>`;
    const itemCheck = li.querySelector('.item-check');
    const itemRemove = li.querySelector('.item-remove');
    //complete the list with click on her
    itemCheck.addEventListener('click', e => {
      const element = e.currentTarget.parentElement;
      if (element.classList.contains('item-complete')) {
        element.classList.remove('item-complete');
        editItemFromStore(item.id, false);
        //show item count
        showItemCount();
      } else {
        element.classList.add('item-complete');
        editItemFromStore(item.id, true);
        //show item count
        showItemCount();
      }
    });
    //remove the list with clik on remove button
    itemRemove.addEventListener('click', e => {
      const element = e.currentTarget.closest('li');
      //remove from dom
      document.querySelector('#todoOutput').removeChild(element);
      //remove from store
      removeItemFromStore(item.id);
      //show item count
      showItemCount();
    });
    document.querySelector('#todoOutput').appendChild(li);
  };

  //Function: Fill Todo List
  const fillTodoList = () => {
    const items = getItemsFromStore();
    if (items.length > 0) {
      items.forEach(item => addTodoItem(item));
      showItemCount();
    }
  };

  //Function: Setup App
  const setupApp = element => {
    if (element.classList.contains('todo-list-clear')) {
      let items = getItemsFromStore();
      items = items.filter(item => item.status === true);
      if (items.length > 0) {
        //remove all complete items from dom
        document.querySelectorAll('.item-complete')
        .forEach(item => document.querySelector('#todoOutput').removeChild(item));
        //remove all complete items from store
        items.forEach(item => removeItemFromStore(item.id));
      }
    } else if (element.classList.contains('all')) {
      const items = getItemsFromStore();
      if (items.length > 0) {
        document.querySelector('#todoOutput').innerHTML = '';
        items.forEach(item => addTodoItem(item));
        //add active status on clicked element
        [...document.querySelector('#todoListSelect').children].forEach(item => item.classList.remove('active'));
        element.classList.add('active');
      }
    } else if (element.classList.contains('active-item')) {
      let items = getItemsFromStore();
      if (items.length > 0) {
        items = items.filter(item => item.status !== true);
        if (items.length > 0) {
          document.querySelector('#todoOutput').innerHTML = '';
          items.forEach(item => addTodoItem(item));
          [...document.querySelector('#todoListSelect').children].forEach(item => item.classList.remove('active'));
          element.classList.add('active');
        }
      }
    } else if (element.classList.contains('completed')) {
      let items = getItemsFromStore();
      if (items.length > 0) {
        items = items.filter(item => item.status === true);
        if (items.length > 0) {
          document.querySelector('#todoOutput').innerHTML = '';
          items.forEach(item => addTodoItem(item));
          [...document.querySelector('#todoListSelect').children].forEach(item => item.classList.remove('active'));
          element.classList.add('active');
        }
      }
    }
  };

  //Function: show active item count
  const showItemCount = () => {
    let items = getItemsFromStore();
    items = items.filter(item => item.status !== true);
    document.querySelector('#item-left').innerText = items.length;
  };

  //check all items
  const checkAllItems = () => {
    let items = getItemsFromStore();
    if (items.length > 0) {
      //add class to all dom items
      [...document.querySelector('#todoOutput').children]
      .forEach(item => {
        item.classList.add('item-complete');
      });
      items.forEach(item => item.status = true);
      localStorage.setItem('todos', JSON.stringify(items));
      //show item count
      showItemCount();
    }
  };

  //Function: Get Items From Store
  const getItemsFromStore = () => {
    return localStorage.getItem('todos') ? JSON.parse(localStorage.getItem('todos')) : [];
  };

  //Function: Add Item To Store
  const addItemToStore = item => {
    const items = getItemsFromStore();
    items.push(item);
    localStorage.setItem('todos', JSON.stringify(items));
  };

  //Function: Edit Item From Store
  const editItemFromStore = (id, status) => {
    const items = getItemsFromStore();
    items.forEach(item => {
      if (item.id === id) {
        item.status = status;
      }
    });
    localStorage.setItem('todos', JSON.stringify(items));
  };

  //Function: Remove Item From Store
  const removeItemFromStore = id => {
    let items = getItemsFromStore();
    items = items.filter(item => item.id !== id);
    localStorage.setItem('todos', JSON.stringify(items));
  };

  //Event: Document Loaded
  document.addEventListener('DOMContentLoaded', () => {
    //fill todo list
    fillTodoList();
    //setup app
    document.querySelector('#todoSetup').addEventListener('click', e => {
      setupApp(e.target);
    });
    //check all items
    document.querySelector('#check-all').addEventListener('click', checkAllItems);
  });

  //Event: setup theme
  document.querySelector('#todoTheme').addEventListener('click', e => {
    const element = e.target;
    if (element.classList.contains('dark-theme')) {
      element.style.display = 'none';
      element.previousElementSibling.style.display = 'block';
      document.querySelector('html').className = 'dark-theme';
    } else if (element.classList.contains('light-theme')) {
      element.style.display = 'none';
      element.nextElementSibling.style.display = 'block';
      document.querySelector('html').className = 'light-theme';
    }
  });

  //Event: submit todo item
  document.querySelector('#todoForm').addEventListener('submit', e => {
    e.preventDefault();
    const todoInput = document.querySelector('#todoInput');
    const inputValue = todoInput.value;
    if (inputValue) {
      const itemId = new Date().getTime();
      const itemObj = {
        id : itemId,
        name : inputValue,
        status : false
      };
      //Clear Input Field
      todoInput.value = '';
      //add item to list
      addTodoItem(itemObj);
      //add item to local storage
      addItemToStore(itemObj);
      //show item count
      showItemCount();
    }
  });
