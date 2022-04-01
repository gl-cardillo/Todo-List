/* eslint-disable max-len */
/* eslint-disable require-jsdoc */
import {saveTodo} from './createTodo';
const LOCAL_STORAGE_PROJECT_KEY = 'task.project';
export let projectslist =
  JSON.parse(localStorage.getItem(LOCAL_STORAGE_PROJECT_KEY)) || [];

const errorMessage = document.querySelector('.required2');
const projects = document.querySelector('.projects-section');
const cancelButton = document.querySelector('#cancel-project');
const submitButton = document.querySelector('#submit-project');
const todoForm = document.querySelector('.todo-form-container');
const todosContainer = document.querySelector('.todo-container');
const projectForm = document.querySelector('.project-form-container');
const addProjectButton = document.querySelector('.add-projects-button');

function Project(id, name) {
  this._id = id;
  this._name = name;
  this._list = [];
}

function addProject() {
  const name = document.querySelector('#project-name');
  const id = Date.now().toString();

  if (name.value === '') {
    errorMessage.textContent = 'required';
    return;
  }
  errorMessage.textContent = '';

  for (let i = 0; i < projectslist.length; i++) {
    if (projectslist[i]._name === name.value) return;
  }

  const newProject = new Project(id, name.value);

  name.value = '';
  projectForm.classList.add('remove-form');

  projectslist.push(newProject);

  saveProject();
  showProjects();
}

export function saveProject() {
  localStorage.setItem(LOCAL_STORAGE_PROJECT_KEY, JSON.stringify(projectslist));
}

function removeProject(e) {
  if (e.target.className === 'delete-project') {
    projectslist = projectslist.filter(
        (project) => project._id !== e.target.getAttribute('data-list-id'),
    );
    saveProject();
    showProjects();
  }
}

function removeTodoInProject(e) {
  if (e.target.className === 'delete-todo-project') {
    const id = e.target.getAttribute('data-list-id');
    const projectOfTodoId =
      e.target.parentNode.parentNode.getAttribute('data-list-id');

    const projectOfTodo = projectslist.filter(
        (project) => `${project._id}--` === projectOfTodoId,
    );
    const todoToRemoveFromProject = projectOfTodo[0]._list.filter(
        (todo) => todo._id === id,
    );
    todoToRemoveFromProject[0]._projectId = '';

    saveTodo();

    projectOfTodo[0]._list = projectOfTodo[0]._list.filter(
        (todo) => todo._id !== id,
    );

    saveProject();
    showProjects();
  }
}

function showProjects() {
  removeChild(todosContainer);

  projectslist.forEach((projects) => {
    const name = document.createElement('p');
    const project = document.createElement('div');
    const editProject = document.createElement('div');
    const deleteProject = document.createElement('button');
    const todoInProjectContainer = document.createElement('div');
    const projectAndTodoContainer = document.createElement('div');
    const buttonShowtodoInProject = document.createElement('button');

    project.classList.add('projects');
    deleteProject.classList.add('delete-project');
    buttonShowtodoInProject.classList.add('show-todo');
    projectAndTodoContainer.classList.add('project-and-todo-container');

    name.textContent = projects._name;
    deleteProject.textContent = '✕';
    buttonShowtodoInProject.textContent = '⌄';

    deleteProject.dataset.listId = projects._id;
    // add '--' at the and for showTodoInProject
    todoInProjectContainer.dataset.listId = `${projects._id}--`;
    buttonShowtodoInProject.dataset.listId = projects._id;

    editProject.appendChild(buttonShowtodoInProject);
    editProject.appendChild(deleteProject);
    project.appendChild(name);
    project.appendChild(editProject);

    projectAndTodoContainer.appendChild(project);
    projectAndTodoContainer.appendChild(todoInProjectContainer);

    todosContainer.appendChild(projectAndTodoContainer);
  });
}

function removeChild(element) {
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
}
// function for show the tod in the projects
function showtodoInProject(e) {
  const id = e.target.getAttribute('data-list-id');
  const todoInProjectContainer = document.querySelector(
      `[data-list-id="${id}--"] `,
  );

  // if when the button is clicked todo in the project is already visible,hide them
  if (e.target.className === 'show-todo active' || e === 'delete-todo') {
    removeChild(todoInProjectContainer);
    e.target.classList.remove('active');
  } else if (e.target.className === 'show-todo') {
    e.target.classList.add('active');
    const todoInProject = projectslist.filter(
        (project) => project._id === e.target.getAttribute('data-list-id'),
    );

    for (let i = 0; i < todoInProject[0]._list.length; i++) {
      const todoTitle = document.createElement('p');
      const dueDate = document.createElement('p');
      const deleteTodo = document.createElement('button');

      todoTitle.textContent = todoInProject[0]._list[i]._title;
      dueDate.textContent = todoInProject[0]._list[i]._dueDate;

      deleteTodo.textContent = '✕';
      deleteTodo.dataset.listId = todoInProject[0]._list[i]._id;
      deleteTodo.classList.add('delete-todo-project');

      const todoDetails = document.createElement('div');
      todoDetails.classList.add('todo-details');

      todoDetails.appendChild(todoTitle);
      todoDetails.appendChild(dueDate);
      todoDetails.appendChild(deleteTodo);

      if (todoInProject[0]._list[i]._priority === 'high') {
        todoTitle.classList.add('high-in-project');
      } else if (todoInProject[0]._list[i]._priority === 'medium') {
        todoTitle.classList.add('medium-in-project');
      } else if (todoInProject[0]._list[i]._priority === 'low') {
        todoTitle.classList.add('low-in-project');
      }

      todoInProjectContainer.appendChild(todoDetails);
    }
  }
}

projects.addEventListener('click', () => showProjects());
submitButton.addEventListener('click', () => addProject());
todosContainer.addEventListener('click', (e) => removeProject(e));
todosContainer.addEventListener('click', (e) => removeTodoInProject(e));
todosContainer.addEventListener('click', (e) => showtodoInProject(e));
cancelButton.addEventListener('click', () =>
  projectForm.classList.add('remove-form'),
);

// remove todo form and add project form to the screen
addProjectButton.addEventListener('click', () => {
  projectForm.classList.remove('remove-form');
  projectForm.classList.add('active-form');
  todoForm.classList.add('remove-form');
});
