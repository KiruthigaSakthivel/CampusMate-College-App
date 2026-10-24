const $ = (id) => document.getElementById(id);
const load = (key, fallback) => {
  try { return JSON.parse(localStorage.getItem(key)) ?? fallback; }
  catch { return fallback; }
};
let assignments = load("campusmate-assignments", []);
let notes = load("campusmate-notes", []);
let attended = Number(load("campusmate-attended", 10));
let total = Number(load("campusmate-total", 12));

function save() {
  localStorage.setItem("campusmate-assignments", JSON.stringify(assignments));
  localStorage.setItem("campusmate-notes", JSON.stringify(notes));
  localStorage.setItem("campusmate-attended", JSON.stringify(attended));
  localStorage.setItem("campusmate-total", JSON.stringify(total));
}
function renderAssignments() {
  const list = $("assignmentList"); list.replaceChildren();
  assignments.forEach((item, index) => {
    const li = document.createElement("li");
    if (item.done) li.classList.add("done");
    const check = document.createElement("input");
    check.type = "checkbox"; check.checked = item.done;
    check.setAttribute("aria-label", "Mark assignment complete");
    check.addEventListener("change", () => { item.done = check.checked; save(); renderAssignments(); });
    const span = document.createElement("span"); span.textContent = item.text;
    const del = document.createElement("button"); del.textContent = "Delete"; del.className = "secondary";
    del.addEventListener("click", () => { assignments.splice(index, 1); save(); renderAssignments(); });
    li.append(check, span, del); list.append(li);
  });
  $("assignmentCount").textContent = assignments.filter(a => !a.done).length;
}
function renderNotes() {
  const list = $("noteList"); list.replaceChildren();
  notes.forEach((note, index) => {
    const li = document.createElement("li");
    const span = document.createElement("span"); span.textContent = note;
    const del = document.createElement("button"); del.textContent = "Delete"; del.className = "secondary";
    del.addEventListener("click", () => { notes.splice(index, 1); save(); renderNotes(); });
    li.append(span, del); list.append(li);
  });
  $("noteCount").textContent = notes.length;
}
function renderAttendance() {
  attended = Math.max(0, Math.min(attended, total));
  const percent = total ? Math.round(attended / total * 100) : 0;
  $("attendedCount").textContent = attended;
  $("totalCount").textContent = total;
  $("attendancePercent").textContent = percent + "%";
  $("attendanceBar").style.width = percent + "%";
  $("attendanceMessage").textContent = percent >= 75 ? "Great! Keep maintaining your attendance." : "Your attendance is below 75%. Try to attend more classes.";
}
$("assignmentForm").addEventListener("submit", e => {
  e.preventDefault(); const input = $("assignmentInput");
  if (input.value.trim()) { assignments.push({ text: input.value.trim(), done: false }); input.value = ""; save(); renderAssignments(); }
});
$("noteForm").addEventListener("submit", e => {
  e.preventDefault(); const input = $("noteInput");
  if (input.value.trim()) { notes.push(input.value.trim()); input.value = ""; save(); renderNotes(); }
});
$("attendedBtn").addEventListener("click", () => { attended++; total++; save(); renderAttendance(); });
$("missedBtn").addEventListener("click", () => { total++; save(); renderAttendance(); });
renderAssignments(); renderNotes(); renderAttendance();
