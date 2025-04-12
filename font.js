const form = document.getElementById('task-form');
const input = document.getElementById('task-input');
const list = document.getElementById('task-list');

form.addEventListener('submit', function (e) {
  e.preventDefault();
  const taskText = input.value.trim();
  if (taskText !== '') {
    addTask(taskText);
    input.value = '';
  }
});

function addTask(text) {
  const li = document.createElement('li');

  const span = document.createElement('span');
  span.textContent = text;

  const actions = document.createElement('div');

  const completeBtn = document.createElement('button');
  completeBtn.textContent = '✓';
  completeBtn.title = 'Mark as Done';
  completeBtn.onclick = () => span.classList.toggle('completed');

  const editBtn = document.createElement('button');
  editBtn.textContent = '✎';
  editBtn.title = 'Edit';
  editBtn.onclick = () => {
    const newText = prompt('Edit your task:', span.textContent);
    if (newText) span.textContent = newText;
  };

  const deleteBtn = document.createElement('button');
  deleteBtn.textContent = '🗑';
  deleteBtn.title = 'Delete';
  deleteBtn.onclick = () => li.remove();

  actions.appendChild(completeBtn);
  actions.appendChild(editBtn);
  actions.appendChild(deleteBtn);

  li.appendChild(span);
  li.appendChild(actions);

  list.appendChild(li);
}
