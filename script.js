/**
 * Collaborative To-Do List App (Vanilla JS)
 * ------------------------------------------
 * - Advanced task management (CRUD, priority, category, tags, deadline, assignment)
 * - Team & individual productivity metrics
 * - Theme toggle: playful/professional
 * - Responsive, animated, error handling, persistent storage
 */

// ---- Storage Handling ----
let tasks = JSON.parse(localStorage.getItem('tasks') || '[]');

// ---- Utility Functions ----
function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}
function makeID() { return Date.now() + Math.random().toString(36).slice(2,7); }
function todayISO() { return new Date().toISOString().split('T')[0]; }

// ---- Rendering & Filtering ----
const taskList = document.getElementById('task-list');
const categoryFilter = document.getElementById('filter-category');
const priorityFilter = document.getElementById('filter-priority');
const assignedFilter = document.getElementById('filter-assigned');
const searchBox = document.getElementById('search-box');

function renderTasks() {
  // Filtering
  const sf = searchBox.value.toLowerCase();
  const cf = categoryFilter.value;
  const pf = priorityFilter.value;
  const af = assignedFilter.value;

  let filtered = tasks.filter(t =>
    (!cf || t.category === cf) &&
    (!pf || t.priority === pf) &&
    (!af || t.assigned === af) &&
    ( t.title.toLowerCase().includes(sf) ||
      t.category.toLowerCase().includes(sf) ||
      t.tags.join(',').toLowerCase().includes(sf) ||
      t.assigned.toLowerCase().includes(sf) )
  );

  taskList.innerHTML = '';
  if(filtered.length === 0) {
    taskList.innerHTML = "<li class='task-item'>No tasks found.</li>";
    return;
  }
  filtered.forEach(task => {
    let li = document.createElement('li');
    li.className = "task-item" + (task.completed ? " completed" : "");
    li.dataset.id = task.id;
    li.innerHTML = `
      <div class="task-main"><strong>${task.title}</strong></div>
      <span class="task-category">${task.category || "General"}</span>
      <span class="task-tags">${task.tags.map(tag=>`#${tag}`).join(' ')}</span>
      <span class="task-priority" data-priority="${task.priority}">${task.priority}</span>
      <span class="task-due${isOverdue(task) ? " overdue" : ""}">
        ${task.due || ""}
      </span>
      <span class="task-assigned">👤 ${task.assigned||"Unassigned"}</span>
      <div class="task-actions">
        <button title="Complete/Incomplete" class="toggle-complete">${task.completed ? '✅' : '⬜'}</button>
        <button title="Edit" class="edit-task">✏️</button>
        <button title="Delete" class="delete-task">🗑️</button>
      </div>
    `;
    taskList.appendChild(li);
  });
  updateFilters();
  updateProductivity();
}

function isOverdue(task) {
  return !task.completed && task.due && task.due < todayISO();
}

// ---- Filter Dropdowns Update ----
function updateFilters() {
  // build unique option sets
  const cats = [...new Set(tasks.map(t => t.category).filter(Boolean))].sort();
  const pris = [...new Set(tasks.map(t => t.priority))].sort();
  const assigns = [...new Set(tasks.map(t => t.assigned).filter(Boolean))].sort();
  updateFilterOptions(categoryFilter, cats);
  updateFilterOptions(priorityFilter, pris);
  updateFilterOptions(assignedFilter, assigns);
}
function updateFilterOptions(sel, arr) {
  let selected = sel.value;
  sel.innerHTML = `<option value="">${sel === categoryFilter ? "All Categories" : sel === priorityFilter ? "All Priorities" : "All Assigned"}</option>`;
  arr.forEach(opt => {
    let o = document.createElement('option');
    o.value = opt;
    o.textContent = opt;
    sel.appendChild(o);
  });
  sel.value = selected;
}

// ---- CRUD Operations ----
const taskForm = document.getElementById('task-form');
const feedback = document.getElementById('form-feedback');

taskForm.onsubmit = function(e) {
  e.preventDefault();
  const title = document.getElementById('task-title').value.trim();
  const category = document.getElementById('task-category').value.trim();
  const tags = document.getElementById('task-tags').value.trim().split(',').map(tag=>tag.trim()).filter(Boolean);
  const due = document.getElementById('task-due').value;
  const priority = document.getElementById('task-priority').value;
  const assigned = document.getElementById('task-assigned').value.trim();

  // Validation
  if(!title) return setFeedback("Task title is required.", feedback);
  if(!due) return setFeedback("Due date is required.", feedback);

  // Task Object
  const task = {
    id: makeID(),
    title,
    category,
    tags,
    due,
    priority,
    assigned,
    completed: false,
    created: todayISO()
  };
  tasks.push(task);
  saveTasks();
  taskForm.reset();
  setFeedback("Task added!", feedback, true);
  renderTasks();
  setTimeout(()=>setFeedback("",feedback),1300);
};

// ---- Edit Modal Logic ----
const modal = document.getElementById('edit-modal');
const modalBackdrop = document.getElementById('modal-backdrop');
const editForm = document.getElementById('edit-task-form');
const editFeedback = document.getElementById('edit-form-feedback');
let editingId = null;

function openModal(id) {
  let task = tasks.find(t=>t.id===id);
  if(!task) return;
  editingId = id;
  modal.classList.remove('hidden');
  modalBackdrop.classList.remove('hidden');
  document.getElementById('edit-task-title').value = task.title;
  document.getElementById('edit-task-category').value = task.category;
  document.getElementById('edit-task-tags').value = task.tags.join(', ');
  document.getElementById('edit-task-due').value = task.due;
  document.getElementById('edit-task-priority').value = task.priority;
  document.getElementById('edit-task-assigned').value = task.assigned;
  setFeedback("", editFeedback);
}

// Close Modal
document.getElementById('close-modal').onclick = closeModal;
modalBackdrop.onclick = closeModal;

function closeModal() {
  modal.classList.add('hidden');
  modalBackdrop.classList.add('hidden');
  editingId = null;
  setFeedback("",editFeedback);
}

editForm.onsubmit = function(e) {
  e.preventDefault();
  if(!editingId) return;
  const title = document.getElementById('edit-task-title').value.trim();
  const category = document.getElementById('edit-task-category').value.trim();
  const tags = document.getElementById('edit-task-tags').value.trim().split(',').map(tag=>tag.trim()).filter(Boolean);
  const due = document.getElementById('edit-task-due').value;
  const priority = document.getElementById('edit-task-priority').value;
  const assigned = document.getElementById('edit-task-assigned').value.trim();
  if(!title) return setFeedback("Task title is required.", editFeedback);
  if(!due) return setFeedback("Due date is required.", editFeedback);

  let task = tasks.find(t=>t.id===editingId);
  if(!task) return setFeedback("Task not found.", editFeedback);

  Object.assign(task,{ title, category, tags, due, priority, assigned });
  saveTasks();
  closeModal();
  setFeedback("Task edited!", editFeedback, true);
  renderTasks();
  setTimeout(()=>setFeedback("",editFeedback),900);
};

// ---- Task Actions (Delete, Complete, Edit) ----
taskList.onclick = function(e) {
  let li = e.target.closest('.task-item');
  if(!li) return;
  let id = li.dataset.id;
  if(e.target.classList.contains('delete-task')) {
    if(confirm("Delete this task?")) {
      tasks = tasks.filter(t=>t.id!==id);
      saveTasks(); renderTasks();
    }
  }
  if(e.target.classList.contains('edit-task')) {
    openModal(id);
  }
  if(e.target.classList.contains('toggle-complete')) {
    let t = tasks.find(t=>t.id===id);
    t.completed = !t.completed;
    saveTasks(); renderTasks();
  }
};

// ---- Productivity Metrics ----
const summaryDiv = document.getElementById('productivity-summary');
function updateProductivity() {
  // count tasks per day/completed, per assigned
  let completedToday = tasks.filter(t=>t.completed && t.created === todayISO()).length;
  let totalToday = tasks.filter(t=>t.created === todayISO()).length;
  let assigned = {};
  tasks.forEach(t=>{
    if(!assigned[t.assigned]) assigned[t.assigned]=0;
    assigned[t.assigned]++;
  });
  let html = `
    <strong>Tasks added today:</strong> ${totalToday} <br>
    <strong>Tasks completed today:</strong> ${completedToday} <br>
    <strong>By user/team:</strong><br>
    <ul>${Object.entries(assigned).filter(([u])=>u).map(([u,c])=>`<li>${u}: ${c} tasks</li>`).join('')}</ul>
  `;
  summaryDiv.innerHTML = html;
}

// ---- Error Handling and Feedback ----
function setFeedback(msg, el, success=false) {
  el.textContent = msg;
  el.style.color = success ? "green" : "red";
}

// ---- Theme Toggle ----
const themeToggle = document.getElementById('theme-toggle');
themeToggle.onclick = function() {
  document.body.classList.toggle('professional');
  localStorage.setItem('theme',document.body.classList.contains('professional') ? 'professional' : '');
};
// Load theme preference
window.onload = function() {
  renderTasks();
  if(localStorage.getItem('theme')==='professional')
    document.body.classList.add('professional');
  updateFilters();
  updateProductivity();
};
/* End of Script */
