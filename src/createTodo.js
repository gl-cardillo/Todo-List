/* eslint-disable indent */
/* eslint-disable require-jsdoc */
import {addWeeks, format} from 'date-fns';
import {projectslist, saveProject} from './createProject';

// localStorage.clear();
const LOCAL_STORAGE_LIST_KEY = 'task.list';
export let lists =
  JSON.parse(localStorage.getItem(LOCAL_STORAGE_LIST_KEY)) || [];

// form input
const title = document.querySelector('#title');
const dueDate = document.querySelector('#dueDate');
const priority = document.querySelector('#priority');
const project = document.querySelector('#project-list');
// sidebar
const week = document.querySelector('.week');
const home = document.querySelector('.home');
const today = document.querySelector('.today');

const errorMessage = document.querySelector('.required1');
const cancelTodo = document.querySelector('#cancel-todo');
const submitTodo = document.querySelector('#submit-todo');
const projects = document.querySelector('.projects-section');
const todoForm = document.querySelector('.todo-form-container');
const addTodoButton = document.querySelector('.add-todo-button');
const selectPojectList = document.querySelector('#project-list');
const todosContainer = document.querySelector('.todo-container');
const projectForm = document.querySelector('.project-form-container');

// store id for todo to edit
let temporaryTodoEditId = null;

function Todo(id, title, dueDate, priority) {
  this._id = id;
  this._title = title;
  this._dueDate = dueDate;
  this._priority = priority;
  this._projectId = null;
}

function menageForm() {
  // set dueDate min to todays date
  const dueDatemin = document.getElementById('dueDate');
  const date = new Date();
  const dateFormatted = format(date, 'yyyy-MM-dd');
  dueDatemin.min = dateFormatted;
  optionList();
  // show form
  todoForm.classList.remove('remove-form');
  todoForm.classList.add('active-form');
  projectForm.classList.add('remove-form');
}

// add new Todo
function addTodo() {
  const id = Date.now().toString();
  lists = lists.filter((list) => list._id !== temporaryTodoEditId);

  if (title.value === '') {
    errorMessage.textContent = 'required';
    return;
  }
  errorMessage.textContent = '';

  for (let i = 0; i < lists.length; i++) {
    if (lists[i]._title === title.value) {
      errorMessage.textContent = 'title already used';
      return;
    }
  }
  errorMessage.textContent = '';

  const newTodo = new Todo(id, title.value, dueDate.value, priority.value);

  lists.push(newTodo);
  if (project.value) {
    for (let i = 0; i < projectslist.length; i++) {
      if (projectslist[i]._name === project.value) {
        projectslist[i]._list.push(newTodo);
        newTodo._projectId = projectslist[i]._id;
        break;
      }
    }
    saveProject();
  }

  saveTodo();
  showTodo();

  title.value = '';
  dueDate.value = '';
  priority.value = '';
  project.value = '';
  todoForm.classList.add('remove-form');
  setPage(home);
}

function removeTodo(e) {
  if (e.target.className === 'delete-todo') {
    const id = e.target.getAttribute('data-list-id');
    const todoToRemove = lists.filter((list) => list._id === id);
    lists = lists.filter((list) => list._id !== id);

    if (todoToRemove[0]._projectId) {
      for (let i = 0; i < projectslist.length; i++) {
        projectslist[i]._list = projectslist[i]._list.filter(
            (project) => project._id !== id,
        );
      }
      saveProject();
    }

    saveTodo();

    // showTodo with the current page
    const selectedPage = document.querySelector('#active');
    if (selectedPage.className === 'week') {
      showTodo(
          lists.filter(
              (list) =>
                list._dueDate < format(addWeeks(new Date(), 1), 'yyyy-MM-dd'),
          ),
      );
    } else if (selectedPage.className === 'today') {
      showTodo(
          lists.filter(
              (list) => list._dueDate === format(new Date(), 'yyyy-MM-dd'),
          ),
      );
    } else {
      showTodo();
    }
  }
}

export function saveTodo() {
  localStorage.setItem(LOCAL_STORAGE_LIST_KEY, JSON.stringify(lists));
}

export function showTodo(list = lists) {
  removeChild(todosContainer);

  list.forEach((list) => {
    // for each todo create the elements
    const todo = document.createElement('div');
    const deleteTodo = document.createElement('button');
    const titleTodo = document.createElement('p');
    const dateTodo = document.createElement('p');
    const editTodo = document.createElement('button');

    deleteTodo.classList.add('delete-todo');
    editTodo.classList.add('edit-todo');

    editTodo.textContent = '✎';
    titleTodo.textContent = list._title;
    dateTodo.textContent = list._dueDate;

    // change background color of todo based on priority
    const priority = list._priority;
    if (priority === 'high') {
      todo.classList.add('high');
    } else if (priority === 'medium') {
      todo.classList.add('medium');
    } else if (priority === 'low') {
      todo.classList.add('low');
    } else {
      todo.classList.add('standard');
    }

    deleteTodo.textContent = '✕';
    // set the id in the delete button for remove the todo
    deleteTodo.dataset.listId = list._id;
    editTodo.dataset.listId = list._id;

    const editAndDelete = document.createElement('div');
    editAndDelete.classList.add('edit-delete');
    editAndDelete.appendChild(editTodo);
    editAndDelete.appendChild(deleteTodo);

    todo.appendChild(titleTodo);
    todo.appendChild(dateTodo);
    todo.appendChild(editAndDelete);

    todo.classList.add('todos');

    todosContainer.appendChild(todo);
  });
}

function editTodo(e) {
  if (e.target.className === 'edit-todo') {
    temporaryTodoEditId = e.target.getAttribute('data-list-id');
    const todoToEdit = lists.filter((list) => list._id === temporaryTodoEditId);

    menageForm();
    title.value = todoToEdit[0]._title;
    dueDate.value = todoToEdit[0]._dueDate;
    priority.value = todoToEdit[0]._priority;
    project.value = todoToEdit[0]._project;
  }
}

// choose a project where to add the todo
function optionList() {
  removeChild(selectPojectList);
  const defaultOption = document.createElement('option');
  defaultOption.value = '';
  defaultOption.textContent = '';
  selectPojectList.appendChild(defaultOption);
  for (let i = 0; i < projectslist.length; i++) {
    const option = document.createElement('option');
    option.value = projectslist[i]._name;
    option.textContent = projectslist[i]._name;
    selectPojectList.appendChild(option);
  }
}

// remove child everytime
function removeChild(element) {
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
}
// set page in the sidebar
function setPage(page) {
  today.id = '';
  home.id = '';
  week.id = '';
  projects.id = '';
  todoForm.classList.remove('active-form');
  projectForm.classList.remove('active-form');
  page.id = 'active';
}

submitTodo.addEventListener('click', () => addTodo());
addTodoButton.addEventListener('click', () => menageForm());
todosContainer.addEventListener('click', (e) => editTodo(e));
todosContainer.addEventListener('click', (e) => removeTodo(e));

// remove todo form
cancelTodo.addEventListener('click', () => {
  errorMessage.textContent = '';
  todoForm.classList.add('remove-form');
  title.value = '';
  dueDate.value = '';
  priority.value = '';
  project.value = '';
});

home.addEventListener('click', () => {
  setPage(home);
  showTodo();
});

today.addEventListener('click', () => {
  setPage(today);
  showTodo(
    lists.filter((list) => list._dueDate === format(new Date(), 'yyyy-MM-dd')),
  );
});

week.addEventListener('click', () => {
  setPage(week);
  showTodo(
      lists.filter(
          (list) =>
            list._dueDate !== '' &&
        list._dueDate < format(addWeeks(new Date(), 1), 'yyyy-MM-dd'),
      ),
  );
});

projects.addEventListener('click', () => setPage(projects));

home.id = 'active';
showTodo();
