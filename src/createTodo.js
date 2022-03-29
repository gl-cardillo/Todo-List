import { addWeeks, format } from "date-fns";
import { projectslist, saveProject } from './createProject';

//localStorage.clear();
const LOCAL_STORAGE_LIST_KEY = 'task.list';
export let lists = JSON.parse(localStorage.getItem(LOCAL_STORAGE_LIST_KEY)) || [];

const todoForm = document.querySelector('.todo-form-container');
const projectForm = document.querySelector('.project-form-container');
const addTodoButton = document.querySelector('.add-todo-button');
const cancelTodo = document.querySelector('#cancel-todo');
const submitTodo = document.querySelector('#submit-todo');
const todosContainer = document.querySelector('.todo-container');
const week = document.querySelector('.week');
const home = document.querySelector('.home');
const today = document.querySelector('.today');
const projects = document.querySelector('.projects-section');
const selectPojectList = document.querySelector('#project-list')


function  Todo(id, title, dueDate, priority )  {
  this._id = id;  
  this._title = title;
  this._dueDate = dueDate;
  this._priority = priority;

}

function menageForm() {
  //set dueDate min to todays date
  const dueDatemin = document.getElementById("dueDate");
  const date  = new Date(); 
  const dateFormatted = format(date, "yyyy-MM-dd");
  dueDatemin.min = dateFormatted;
  optionList();
  //show form
  todoForm.classList.remove('remove-form');
  todoForm.classList.add('active-form');
  projectForm.classList.add('remove-form');

}

//add new Todo

function addTodo()  {

  const title = document.querySelector('#title');
  const dueDate = document.querySelector('#dueDate');
  const priority = document.querySelector('#priority');
  const project = document.querySelector('#project-list');
  const id = Date.now().toString();

  if ( title.value === '' || dueDate.value === '') return;

  for (let i = 0; i < lists.length; i++) {
    if (lists[i]._title === title.value) return;
  }

  const newTodo = new Todo(id, title.value,  dueDate.value, priority.value);

  lists.push(newTodo);
  if (project.value) {
   
    for (let i = 0; i< projectslist.length; i++) {
      console.log(projectslist[i]._name)
      console.log(project.value)
      if (projectslist[i]._name === project.value) { 
        console.log('cia')
        projectslist[i]._list.push(newTodo);
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
  todoForm.classList.add('remove-form')

}


function removeTodo(e) {
  if (e.target.className === 'delete-todo') { 
    lists = lists.filter(list => list._id !== e.target.getAttribute('data-list-id'))
    
    saveTodo();

    // showTodo with the current page
    const selectedPage = document.querySelector('#active');
    if (selectedPage.className === 'week') {
      showTodo(lists.filter(list => list._dueDate < format(addWeeks(new Date(), 1), "yyyy-MM-dd")))
    } else if ( selectedPage.className === 'today') {
      showTodo(lists.filter(list => list._dueDate === format(new Date(), "yyyy-MM-dd")));
    } else {
      showTodo()
    }
  }
}


function saveTodo() {
  localStorage.setItem(LOCAL_STORAGE_LIST_KEY, JSON.stringify(lists))
}


export function showTodo(list = lists) {

  removeChild(todosContainer);

  list.forEach(list => {
    //for each todo create the elements 
    const todo = document.createElement('div');
    const deleteTodo = document.createElement('button');
    deleteTodo.classList.add('deleteTodo');
    const title = document.createElement('p');
    const date = document.createElement('p');
    const modify = document.createElement('modify');

    modify.textContent = '✎';
    title.textContent = list._title;
    date.textContent = list._dueDate;

    //change background color of todo based on priority
    const priority = list._priority;
    if (priority === 'high') {
      todo.classList.add('high')
    } else if (priority === 'medium') {
      todo.classList.add('medium')
    } else if (priority === 'low') {
      todo.classList.add('low');
    } else {
      todo.classList.add('standard');
    }

    deleteTodo.textContent = "✕";
    // set the id in the delete button for remove the todo
    deleteTodo.dataset.listId = list._id;
    const edit = document.createElement('div');
    edit.classList.add('edit');
    edit.appendChild(modify);
    edit.appendChild(deleteTodo);

    todo.appendChild(title);
    todo.appendChild(date);
    todo.appendChild(edit);

    todo.classList.add('todos');

    todosContainer.appendChild(todo);
  })
}

function optionList() {
  removeChild(selectPojectList);
  const defaultOption = document.createElement('option');
  defaultOption. value = '';
  defaultOption.textContent = ""
  selectPojectList.appendChild(defaultOption)
  for (let i = 0; i< projectslist.length; i++) {
    const option = document.createElement('option')
    option.value = projectslist[i]._name;
    option.textContent = projectslist[i]._name;
    selectPojectList.appendChild(option);
  }
}


//remove child everytime 
function removeChild(element) {
  while (element.firstChild) {
    element.removeChild(element.firstChild)
  }
}

function setPage(page) {
  today.id = '';
  home.id = '';
  week.id = '';
  projects.id = '';
  todoForm.classList.remove('active-form')
  projectForm.classList.remove('active-form')
  page.id = 'active';
}



addTodoButton.addEventListener('click', () => menageForm());
//remove todo form
cancelTodo.addEventListener('click', () => todoForm.classList.add('remove-form'))
submitTodo.addEventListener('click', () => addTodo());
todosContainer.addEventListener('click', (e) => removeTodo(e));


home.addEventListener('click', () => {
  setPage(home)
  showTodo()
});


today.addEventListener('click', () => {
  setPage(today)
  showTodo(lists.filter(list => list._dueDate === format(new Date(), "yyyy-MM-dd")) );
});


week.addEventListener('click', () => {
  setPage(week)
  showTodo(lists.filter(list => list._dueDate < format(addWeeks(new Date(), 1), "yyyy-MM-dd")))
});


projects.addEventListener('click', () => setPage(projects));


home.id = 'active';
showTodo();
