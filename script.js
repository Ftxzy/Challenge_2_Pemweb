// ── State ────────────────────────────────────────────────────
let tasks = [];
let currentFilter = 'all';

// ── Helpers ──────────────────────────────────────────────────
function getTodayString() {
  return new Date().toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });
}

// ── Render ───────────────────────────────────────────────────
function render() {
  const list = document.getElementById('task-list');

  const filtered = currentFilter === 'completed'
    ? tasks.filter(t => t.done)
    : tasks;

  // Update counts
  document.getElementById('count-all').textContent = tasks.length;
  document.getElementById('count-completed').textContent = tasks.filter(t => t.done).length;

  if (filtered.length === 0) {
    list.innerHTML = '<li class="empty">No tasks here.</li>';
    return;
  }

  list.innerHTML = filtered.map(task => `
    <li class="task-card" data-id="${task.id}">
      <div class="task-check ${task.done ? 'checked' : ''}" data-action="toggle"></div>
      <span class="task-text ${task.done ? 'done' : ''}" data-action="toggle">${task.text}</span>
      <button class="delete-btn" data-action="delete">delete</button>
    </li>
  `).join('');
}

// ── Add task ─────────────────────────────────────────────────
function addTask() {
  const input = document.getElementById('task-input');
  const text = input.value.trim();

  if (!text) return;

  tasks.push({
    id: Date.now(),
    text,
    done: false,
  });

  input.value = '';
  render();
}

// ── Event listeners ──────────────────────────────────────────

document.getElementById('add-btn').addEventListener('click', addTask);

document.getElementById('task-input').addEventListener('keydown', (e) => {
  if (e.key === 'Enter') addTask();
});

document.getElementById('task-list').addEventListener('click', (e) => {
  const card = e.target.closest('[data-id]');
  if (!card) return;

  const id = Number(card.dataset.id);
  const action = e.target.dataset.action;

  if (action === 'delete') {
    tasks = tasks.filter(t => t.id !== id);
    render();
  }

  if (action === 'toggle') {
    const task = tasks.find(t => t.id === id);
    if (task) task.done = !task.done;
    render();
  }
});

document.getElementById('filter-all').addEventListener('click', () => {
  currentFilter = 'all';
  document.getElementById('filter-all').classList.add('active');
  document.getElementById('filter-completed').classList.remove('active');
  render();
});

document.getElementById('filter-completed').addEventListener('click', () => {
  currentFilter = 'completed';
  document.getElementById('filter-completed').classList.add('active');
  document.getElementById('filter-all').classList.remove('active');
  render();
});

// ── Init ─────────────────────────────────────────────────────
document.getElementById('today-date').textContent = getTodayString();
render();
