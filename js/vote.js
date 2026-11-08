// Form validation and live community poll for compare.html
const voteForm = document.querySelector("#vote-form");
voteForm.noValidate = true;

const nameInput = document.querySelector("#voter-name");
const emailInput = document.querySelector("#voter-email");
const filmInput = document.querySelector("#voter-film");
const dateInput = document.querySelector("#voter-date");
const commentInput = document.querySelector("#voter-comment");
const seenCheckbox = document.querySelector("#voter-seen");
const commentCountEl = document.querySelector("#comment-count");

// Initial community votes so the poll looks realistic on page load
const pollVotes = [
  { name: "Arman", film: "Dawn", rating: 5 },
  { name: "Diana", film: "War", rating: 5 },
  { name: "Timur", film: "Rise", rating: 4 },
  { name: "Alina", film: "Dawn", rating: 5 },
  { name: "Max", film: "War", rating: 4 }
];

const releaseDates = {
  Rise: "2011-08-05",
  Dawn: "2014-07-11",
  War: "2017-07-14"
};

function getTodayIso() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return year + "-" + month + "-" + day;
}

function containsDigits(text) {
  const digits = "0123456789";
  for (let i = 0; i < text.length; i++) {
    if (digits.includes(text[i])) {
      return true;
    }
  }
  return false;
}

function isValidEmail(email) {
  const atPos = email.indexOf("@");
  const dotPos = email.lastIndexOf(".");
  if (atPos < 1) {
    return false;
  }
  if (dotPos <= atPos + 1) {
    return false;
  }
  if (dotPos >= email.length - 2) {
    return false;
  }
  if (email.includes(" ")) {
    return false;
  }
  return true;
}

function getSelectedRating() {
  const checked = document.querySelector('input[name="rating"]:checked');
  return checked ? Number(checked.value) : 0;
}

function setFieldState(inputEl, errorId, message) {
  const errorEl = document.querySelector("#" + errorId);
  errorEl.textContent = message;

  if (inputEl) {
    if (message !== "") {
      inputEl.classList.add("input-error");
      inputEl.classList.remove("input-valid");
      inputEl.setAttribute("aria-invalid", "true");
    } else {
      inputEl.classList.remove("input-error");
      inputEl.classList.add("input-valid");
      inputEl.setAttribute("aria-invalid", "false");
    }
  }

  return message === "";
}

function validateName() {
  const val = nameInput.value.trim();
  let msg = "";
  if (val === "") {
    msg = "Please enter your name.";
  } else if (val.length < 3) {
    msg = "Name must be at least 3 characters long.";
  } else if (containsDigits(val)) {
    msg = "Name cannot contain numbers.";
  }
  return setFieldState(nameInput, "err-name", msg);
}

function validateEmail() {
  const val = emailInput.value.trim();
  let msg = "";
  if (val === "") {
    msg = "Please enter your email address.";
  } else if (!isValidEmail(val)) {
    msg = "Enter a valid email address (for example, caesar@apes.org).";
  }
  return setFieldState(emailInput, "err-email", msg);
}

function validateFilm() {
  let msg = "";
  if (filmInput.value === "") {
    msg = "Please choose your favourite film from the trilogy.";
  }
  return setFieldState(filmInput, "err-film", msg);
}

function validateDate() {
  const val = dateInput.value;
  const today = getTodayIso();
  const chosenFilm = filmInput.value;
  const minRelease = releaseDates[chosenFilm] || "2011-08-05";

  let msg = "";
  if (val === "") {
    msg = "Please select the date you watched the film.";
  } else if (val > today) {
    msg = "Watch date cannot be in the future.";
  } else if (val < minRelease) {
    msg = "Date cannot be earlier than the film's release (" + minRelease + ").";
  }
  return setFieldState(dateInput, "err-date", msg);
}

function validateRating() {
  let msg = "";
  if (getSelectedRating() === 0) {
    msg = "Please select a rating from 1 to 5.";
  }
  return setFieldState(null, "err-rating", msg);
}

function validateComment() {
  const val = commentInput.value.trim();
  let msg = "";
  if (val === "") {
    msg = "Please tell us briefly why you picked this film.";
  } else if (val.length < 15) {
    msg = "Please write at least 15 characters (currently " + val.length + ").";
  }
  return setFieldState(commentInput, "err-comment", msg);
}

function validateSeen() {
  let msg = "";
  if (!seenCheckbox.checked) {
    msg = "Please confirm that you have watched all three films.";
  }
  return setFieldState(null, "err-seen", msg);
}

function updateCommentCounter() {
  const len = commentInput.value.trim().length;
  commentCountEl.textContent = len + " / 15 min characters";
}

// Live validation: errors disappear immediately as the user fixes each field
nameInput.addEventListener("blur", function () {
  nameInput.dataset.touched = "yes";
  validateName();
});
nameInput.addEventListener("input", function () {
  if (nameInput.dataset.touched === "yes") validateName();
});

emailInput.addEventListener("blur", function () {
  emailInput.dataset.touched = "yes";
  validateEmail();
});
emailInput.addEventListener("input", function () {
  if (emailInput.dataset.touched === "yes") validateEmail();
});

filmInput.addEventListener("change", function () {
  filmInput.dataset.touched = "yes";
  validateFilm();
  if (dateInput.dataset.touched === "yes") validateDate();
});

dateInput.addEventListener("blur", function () {
  dateInput.dataset.touched = "yes";
  validateDate();
});
dateInput.addEventListener("change", function () {
  dateInput.dataset.touched = "yes";
  validateDate();
});

const ratingRadios = document.querySelectorAll('input[name="rating"]');
for (const radio of ratingRadios) {
  radio.addEventListener("change", validateRating);
}

commentInput.addEventListener("blur", function () {
  commentInput.dataset.touched = "yes";
  validateComment();
});
commentInput.addEventListener("input", function () {
  updateCommentCounter();
  if (commentInput.dataset.touched === "yes") validateComment();
});

seenCheckbox.addEventListener("change", validateSeen);

// Render the live poll results in the right column
function renderPoll() {
  const total = pollVotes.length;
  let sumRatings = 0;
  let riseVotes = 0;
  let dawnVotes = 0;
  let warVotes = 0;

  for (const vote of pollVotes) {
    sumRatings = sumRatings + vote.rating;
    if (vote.film === "Rise") riseVotes = riseVotes + 1;
    if (vote.film === "Dawn") dawnVotes = dawnVotes + 1;
    if (vote.film === "War") warVotes = warVotes + 1;
  }

  const avgRating = (sumRatings / total).toFixed(1);
  const risePct = Math.round((riseVotes / total) * 100);
  const dawnPct = Math.round((dawnVotes / total) * 100);
  const warPct = Math.round((warVotes / total) * 100);

  document.querySelector("#poll-total").textContent = total;
  document.querySelector("#poll-avg").textContent = avgRating + " / 5 ★";

  document.querySelector("#pct-rise").textContent = riseVotes + " votes (" + risePct + "%)";
  document.querySelector("#bar-rise").style.width = risePct + "%";

  document.querySelector("#pct-dawn").textContent = dawnVotes + " votes (" + dawnPct + "%)";
  document.querySelector("#bar-dawn").style.width = dawnPct + "%";

  document.querySelector("#pct-war").textContent = warVotes + " votes (" + warPct + "%)";
  document.querySelector("#bar-war").style.width = warPct + "%";

  const recentList = document.querySelector("#poll-recent");
  recentList.textContent = "";

  // Show the 4 most recent votes
  const startIdx = Math.max(0, pollVotes.length - 4);
  for (let i = pollVotes.length - 1; i >= startIdx; i--) {
    const v = pollVotes[i];
    const li = document.createElement("li");
    li.textContent = v.name + " voted for " + v.film + " (" + v.rating + "/5 ★)";
    recentList.appendChild(li);
  }
}

voteForm.addEventListener("submit", function (event) {
  event.preventDefault();

  nameInput.dataset.touched = "yes";
  emailInput.dataset.touched = "yes";
  filmInput.dataset.touched = "yes";
  dateInput.dataset.touched = "yes";
  commentInput.dataset.touched = "yes";

  const okName = validateName();
  const okEmail = validateEmail();
  const okFilm = validateFilm();
  const okDate = validateDate();
  const okRating = validateRating();
  const okComment = validateComment();
  const okSeen = validateSeen();

  if (!okName || !okEmail || !okFilm || !okDate || !okRating || !okComment || !okSeen) {
    return;
  }

  const submittedName = nameInput.value.trim();
  const submittedFilm = filmInput.value;
  const submittedRating = getSelectedRating();

  pollVotes.push({
    name: submittedName,
    film: submittedFilm,
    rating: submittedRating
  });

  renderPoll();

  // Clear the form and validation states
  voteForm.reset();
  const inputsToClear = [nameInput, emailInput, filmInput, dateInput, commentInput];
  for (const el of inputsToClear) {
    el.dataset.touched = "";
    el.classList.remove("input-error", "input-valid");
    el.removeAttribute("aria-invalid");
  }
  updateCommentCounter();

  // Show success message smoothly using jQuery
  const $banner = $("#vote-success");
  $banner
    .text(
      "Thank you, " +
        submittedName +
        "! Your vote (" +
        submittedRating +
        "/5 ★ for " +
        submittedFilm +
        ") has been added to the community poll."
    )
    .stop(true, true)
    .hide()
    .slideDown(300);
});

updateCommentCounter();
renderPoll();
