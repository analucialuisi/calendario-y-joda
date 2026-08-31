let events = [];
let activeDate = new Date();

const monthTitle = document.getElementById('monthTitle');
const calendarGrid = document.getElementById('calendarGrid');
const upcomingPlans = document.getElementById('upcomingPlans');
const planCount = document.getElementById('planCount');
const template = document.getElementById('planTemplate');

const statusLabel = {
  confirmed: 'Confirmado',
  tentative: 'Tentativo',
  idea: 'Idea',
  done: 'Hecho'
};

const dateFormatter = new Intl.DateTimeFormat('es-AR', {
  weekday: 'short', day: 'numeric', month: 'short'
});

function toLocalDate(dateString) {
  if (!dateString) return null;
  const [year, month, day] = dateString.split('-').map(Number);
  return new Date(year, month - 1, day);
}

function sameDay(a, b) {
  return a && b &&
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();
}

function applyTentativeStyle(element, kind) {
  if (!element) return;
  if (kind === 'chip') {
    element.style.background = '#fff0c9';
    element.style.borderColor = '#e8cc7d';
  } else {
    element.style.background = '#fff0c9';
  }
}

function renderCalendar() {
  const year = activeDate.getFullYear();
  const month = activeDate.getMonth();
  const firstDay = new Date(year, month, 1);

  monthTitle.textContent = new Intl.DateTimeFormat('es-AR', {
    month: 'long', year: 'numeric'
  }).format(firstDay);

  calendarGrid.innerHTML = '';
  const mondayIndex = (firstDay.getDay() + 6) % 7;
  const startDate = new Date(year, month, 1 - mondayIndex);
  const today = new Date();

  for (let i = 0; i < 42; i++) {
    const cellDate = new Date(startDate);
    cellDate.setDate(startDate.getDate() + i);

    const cell = document.createElement('div');
    cell.className = 'day';
    if (cellDate.getMonth() !== month) cell.classList.add('muted');
    if (sameDay(cellDate, today)) cell.classList.add('today');

    const number = document.createElement('span');
    number.className = 'day-number';
    number.textContent = cellDate.getDate();
    cell.appendChild(number);

    const dayEvents = events.filter(event => event.date && sameDay(toLocalDate(event.date), cellDate));
    dayEvents.slice(0, 3).forEach(event => {
      const chip = document.createElement('span');
      chip.className = `event-chip ${event.status || 'confirmed'}`;
      chip.textContent = `${event.emoji || '✨'} ${event.title}${event.status === 'tentative' ? ' ?' : ''}`;
      chip.title = event.title;
      if (event.status === 'tentative') applyTentativeStyle(chip, 'chip');
      cell.appendChild(chip);
    });

    if (dayEvents.length > 3) {
      const more = document.createElement('span');
      more.className = 'event-chip';
      more.textContent = `+${dayEvents.length - 3} más`;
      cell.appendChild(more);
    }

    calendarGrid.appendChild(cell);
  }
}

function renderUpcoming() {
  const today = new Date();
  today.setHours(0,0,0,0);

  const upcoming = [...events]
    .filter(event => event.status !== 'done' && (!event.date || toLocalDate(event.date) >= today))
    .sort((a, b) => {
      if (!a.date && !b.date) return 0;
      if (!a.date) return 1;
      if (!b.date) return -1;
      return toLocalDate(a.date) - toLocalDate(b.date);
    });

  planCount.textContent = upcoming.length;
  upcomingPlans.innerHTML = '';

  if (!upcoming.length) {
    upcomingPlans.innerHTML = '<div class="empty-state">Todavía no hay planes futuros. Hora de inventar uno 💌</div>';
    return;
  }

  upcoming.forEach(event => {
    const node = template.content.cloneNode(true);
    const eventDate = toLocalDate(event.date);

    node.querySelector('.plan-date').textContent = eventDate ? dateFormatter.format(eventDate) : 'Fecha a definir';

    const status = node.querySelector('.status-pill');
    status.textContent = statusLabel[event.status] || statusLabel.confirmed;
    status.classList.add(event.status || 'confirmed');
    if (event.status === 'tentative') applyTentativeStyle(status, 'pill');

    node.querySelector('.plan-title').textContent = `${event.emoji || '✨'} ${event.title}`;

    const time = node.querySelector('.plan-time');
    time.textContent = event.time ? `🕒 ${event.time}` : '';
    if (!event.time) time.style.display = 'none';

    const location = node.querySelector('.plan-location');
    location.textContent = event.location ? `📍 ${event.location}` : '';
    if (!event.location) location.style.display = 'none';

    const notes = node.querySelector('.plan-notes');
    notes.textContent = event.notes || '';
    if (!event.notes) notes.style.display = 'none';

    const map = node.querySelector('.map-link');
    if (event.mapUrl) {
      map.href = event.mapUrl;
    } else if (event.location && event.location !== 'A confirmar') {
      map.href = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.location)}`;
    } else {
      map.style.display = 'none';
    }

    const info = node.querySelector('.info-link');
    if (event.infoUrl) {
      info.href = event.infoUrl;
      info.textContent = `${event.infoLabel || 'Ver más info'} ↗`;
    } else {
      info.style.display = 'none';
    }

    upcomingPlans.appendChild(node);
  });
}

async function loadEvents() {
  try {
    const response = await fetch('events.json', { cache: 'no-store' });
    if (!response.ok) throw new Error('No se pudo cargar events.json');
    events = await response.json();
  } catch (error) {
    console.error(error);
    events = [];
  }

  renderCalendar();
  renderUpcoming();
}

document.getElementById('prevMonth').addEventListener('click', () => {
  activeDate = new Date(activeDate.getFullYear(), activeDate.getMonth() - 1, 1);
  renderCalendar();
});

document.getElementById('nextMonth').addEventListener('click', () => {
  activeDate = new Date(activeDate.getFullYear(), activeDate.getMonth() + 1, 1);
  renderCalendar();
});

loadEvents();
