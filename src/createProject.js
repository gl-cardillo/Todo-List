const LOCAL_STORAGE_PROJECT_KEY = 'task.project';
export let projectslist = JSON.parse(localStorage.getItem(LOCAL_STORAGE_PROJECT_KEY)) || [];

const addProjectButton = document.querySelector('.add-projects-button');
const projectForm = document.querySelector('.project-form-container');
const todoForm = document.querySelector('.todo-form-container');
const cancelButton = document.querySelector('#cancel-project');
const submitButton = document.querySelector('#submit-project');
const projects = document.querySelector('.projects-section');
const todosContainer = document.querySelector('.todo-container');

function Project (id, name) {
  this._id = id;
  this._name = name;
  this._list = [];
}

function addProject() {
  const name = document.querySelector('#project-name');
  const id = Date.now().toString();
  
  if (name.value === '') return;

  for (let i = 0; i < projectslist.length; i++) {
    if (projectslist[i]._name === name.value) return;
  }

  const newProject = new Project(id, name.value);

  name.value = '';
  projectForm.classList.add('remove-form')

  projectslist.push(newProject);

  saveProject();
  showProjects();
}

export function saveProject() {
  localStorage.setItem(LOCAL_STORAGE_PROJECT_KEY, JSON.stringify(projectslist))
}

function removeProject(e) {
  
  if (e.target.className === 'deleteProject') { 

    projectslist = projectslist.filter(project => project._id !== e.target.getAttribute('data-list-id'))
    saveProject();
    showProjects()
  }
}


function showProjects() {
  removeChild(todosContainer)

  projectslist.forEach(projects => {
    const project = document.createElement('div');
    const projectContainer = document.createElement('div');
    project.classList.add('projects');
    projectContainer.classList.add('project-container');

    const name = document.createElement('p');
    const deleteProject = document.createElement('button');
    deleteProject.classList.add('deleteProject')
    const todoListInProject = document.createElement('button');

    todoListInProject.classList.add('showTodo');
    todoListInProject.textContent = '⌄';
    deleteProject.textContent = 'x';

    todoListInProject.dataset.listId = projects._id;
    deleteProject.dataset.listId = projects._id;
    projectContainer.dataset.listId = projects._id;

    name.textContent = projects._name;
    
    project.appendChild(name);
    project.appendChild(todoListInProject);
    project.appendChild(deleteProject);
    projectContainer.appendChild(project)
    todosContainer.appendChild(projectContainer)
 
    
  })
  console.log(projectslist);
}

function removeChild(element) {
  while (element.firstChild) {
    element.removeChild(element.firstChild)
  }
}

function showTodoInProject (e) {
  const id = e.target.getAttribute('data-list-id')
  const project = document.querySelector(`[data-list-id="${id}--"] `);
  console.log(project)


  if (e.target.className === 'showTodo') { 
    const todoInproject = projectslist.filter(project => project._id === e.target.getAttribute('data-list-id'));
    console.log(todoInproject[0]._list);
    for (let i= 0; i < todoInproject[0]._list.length; i++) { 
   
        const todoTitle = document.createElement('p');
        const dueDate = document.createElement('p');
  
        todoTitle.textContent = todoInproject[0]._list[i]._title;
        dueDate.textContent = todoInproject[0]._list[i]._dueDate;
        
        const projectsTodo = document.createElement('div');
    
        projectsTodo.appendChild(todoTitle);
        projectsTodo.appendChild(dueDate);
        projectsTodo.classList.add('project-todo')
 
    }

  }
}

projects.addEventListener('click',() => showProjects())
submitButton.addEventListener('click', () => addProject());
todosContainer.addEventListener('click', (e) => removeProject(e));
todosContainer.addEventListener('click', (e) => showTodoInProject(e));
cancelButton.addEventListener('click', () => projectForm.classList.add('remove-form'));


//remove todo form and add project form to the screen
addProjectButton.addEventListener('click', () => {
 
  projectForm.classList.remove('remove-form');
  projectForm.classList.add('active-form');
  todoForm.classList.add('remove-form')
 
})
