const calendarBody = document.getElementById("calendar-body");
const calendarTitle = document.getElementById("calendar-title");
const prevMonthBtn = document.getElementById("prev-month");
const nextMonthBtn = document.getElementById("next-month");

let currentYear, currentMonth;
let events = {};

async function fetchEvents() {
  try {
    const res = await fetch("events.json");
    const data = await res.json();
    events = {};
    data.forEach(item => {
      events[item.date] = item.description;
    });
    renderCalendar(currentYear, currentMonth);
  } catch (error) {
    console.error("イベント読み込みエラー", error);
  }
}

function renderCalendar(year, month) {
  currentYear = year;
  currentMonth = month;

  calendarTitle.textContent = `🗓 ${year}年${month + 1}月の予定`;

  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const firstWeekday = firstDay.getDay();
  const daysInMonth = lastDay.getDate();

  calendarBody.innerHTML = "";

  const today = new Date();
  const todayDate = new Date(today.getFullYear(), today.getMonth(), today.getDate()); // 00:00 にリセット
  const isCurrentMonth = year === today.getFullYear() && month === today.getMonth();

  let date = 1;
  for (let i = 0; i < 6; i++) {
    const row = document.createElement("tr");

    for (let j = 0; j < 7; j++) {
      const cell = document.createElement("td");

      if (i === 0 && j < firstWeekday) {
        cell.textContent = "";
      } else if (date > daysInMonth) {
        cell.textContent = "";
      } else {
        const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(date).padStart(2, "0")}`;
        cell.textContent = date;

        const cellDate = new Date(year, month, date);

        // 過去の日
        if (cellDate < todayDate) {
          cell.classList.add("past-day");

        // 今日
        } else if (isCurrentMonth && date === today.getDate()) {
          cell.classList.add("today");
        }

        // イベント
if (events[dateStr]) {
  cell.classList.add("event");
  cell.title = events[dateStr];

  // マウスカーソルを明示的にポインターに
  cell.style.cursor = "pointer";

  cell.addEventListener("click", (e) => {
    e.preventDefault();     // 通常は不要だけど念のため残すのはOK
    e.stopPropagation();    // 他のクリックイベントに干渉させない
  // モーダルを表示
document.getElementById("event-detail-text").textContent = `${dateStr} のイベント：\n${events[dateStr]}`;
document.getElementById("event-modal").style.display = "flex";

  });
}


        date++;
      }

      row.appendChild(cell);
    }

    calendarBody.appendChild(row);
  }
}

prevMonthBtn.addEventListener("click", () => {
  currentMonth = (currentMonth === 0) ? 11 : currentMonth - 1;
  currentYear = (currentMonth === 11) ? currentYear - 1 : currentYear;
  renderCalendar(currentYear, currentMonth);
});

nextMonthBtn.addEventListener("click", () => {
  currentMonth = (currentMonth === 11) ? 0 : currentMonth + 1;
  currentYear = (currentMonth === 0) ? currentYear + 1 : currentYear;
  renderCalendar(currentYear, currentMonth);
});

document.addEventListener("DOMContentLoaded", () => {
  const today = new Date();
  currentYear = today.getFullYear();
  currentMonth = today.getMonth();
  fetchEvents();
  document.getElementById("event-close").addEventListener("click", () => {
  document.getElementById("event-modal").style.display = "none";
});

});

