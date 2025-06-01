const calendarBody = document.getElementById("calendar-body");
const calendarTitle = document.getElementById("calendar-title");
const prevMonthBtn = document.getElementById("prev-month");
const nextMonthBtn = document.getElementById("next-month");

let currentYear, currentMonth;
let events = {};

// イベントJSONを読み込む
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

// カレンダー描画
function renderCalendar(year, month) {
  currentYear = year;
  currentMonth = month;

  calendarTitle.textContent = `🗓 ${year}年${month + 1}月の予定`;

  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const firstWeekday = firstDay.getDay();
  const daysInMonth = lastDay.getDate();

  calendarBody.innerHTML = "";

  // 今日の日付と比較するための文字列
  const today = new Date();
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

  let date = 1;
  for (let i = 0; i < 6; i++) { // 最大6行の週
    const row = document.createElement("tr");
    for (let j = 0; j < 7; j++) { // 日〜土
      const cell = document.createElement("td");

      if (i === 0 && j < firstWeekday) {
        cell.textContent = "";
      } else if (date > daysInMonth) {
        cell.textContent = "";
      } else {
        const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(date).padStart(2, "0")}`;
        cell.textContent = date;

        // 今日の日付を強調
        if (dateStr === todayStr) {
          cell.classList.add("today");
        }

        // イベントがある日
        if (events[dateStr]) {
          cell.classList.add("event");
          cell.title = events[dateStr];
          cell.addEventListener("click", () => {
            alert(`${dateStr} のイベント：\n${events[dateStr]}`);
          });
        }

        date++;
      }

      row.appendChild(cell);
    }
    calendarBody.appendChild(row);
  }
}

// 月送り（前へ）
prevMonthBtn.addEventListener("click", () => {
  currentMonth = (currentMonth === 0) ? 11 : currentMonth - 1;
  currentYear = (currentMonth === 11) ? currentYear - 1 : currentYear;
  renderCalendar(currentYear, currentMonth);
});

// 月送り（次へ）
nextMonthBtn.addEventListener("click", () => {
  currentMonth = (currentMonth === 11) ? 0 : currentMonth + 1;
  currentYear = (currentMonth === 0) ? currentYear + 1 : currentYear;
  renderCalendar(currentYear, currentMonth);
});

// 初期表示
document.addEventListener("DOMContentLoaded", () => {
  const today = new Date();
  currentYear = today.getFullYear();
  currentMonth = today.getMonth();
  fetchEvents();
});
