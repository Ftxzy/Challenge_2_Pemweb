// ── State ────────────────────────────────────────────────────
const STORAGE_KEY = 'myTasks';

// Baca teks JSON dari storage, lalu terjemahkan kembali jadi Array (fallback [] jika null)
let tasks = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
let currentFilter = 'all';

// ── Helpers ──────────────────────────────────────────────────
function getTodayString() {
  return new Date().toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });
}

// WAJIB: Ubah Array of Objects menjadi String JSON sebelum disimpan ke storage!
function saveTasks() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
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

  // id task langsung dipakai sebagai id elemen <li>, jadi tidak butuh atribut data-* untuk menandainya.
  list.innerHTML = filtered.map(task => `
    <li class="task-card" id="${task.id}">
      <div class="task-check ${task.done ? 'checked' : ''}"></div>
      <span class="task-text ${task.done ? 'done' : ''}">${task.text}</span>
      <button class="delete-btn">delete</button>
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
  saveTasks(); // Setiap ada tambah task, update juga data di localStorage
  render();
}

// ── Event listeners ──────────────────────────────────────────

document.getElementById('add-btn').addEventListener('click', addTask);

document.getElementById('task-input').addEventListener('keydown', (e) => {
  if (e.key === 'Enter') addTask();
});

// Event Delegation: satu listener di parent (#task-list), lalu dicek pakai .matches()
document.getElementById('task-list').addEventListener('click', (e) => {
  const card = e.target.closest('.task-card');
  if (!card) return;

  const id = Number(card.id);

  // A. Klik tombol Delete
  if (e.target.matches('.delete-btn')) {
    tasks = tasks.filter(t => t.id !== id);
    saveTasks(); // Setiap ada hapus task, update juga data di localStorage
    render();
  }

  // B. Klik checkbox atau teks task -> tandai selesai/belum (coret)
  if (e.target.matches('.task-check') || e.target.matches('.task-text')) {
    for (let i = 0; i < tasks.length; i++) {
      if (tasks[i].id === id) {
        tasks[i].done = !tasks[i].done;
        break;
      }
    }
    saveTasks();
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