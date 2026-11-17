// Form validation, Letterboxd star+heart rating, and persistent live poll for compare.html
const VOTES_STORAGE_KEY = "apes_votes";

const voteForm = document.querySelector("#vote-form");
voteForm.noValidate = true;

const nameInput = document.querySelector("#voter-name");
const emailInput = document.querySelector("#voter-email");
const filmInput = document.querySelector("#voter-film");
const dateInput = document.querySelector("#voter-date");
const ratingInput = document.querySelector("#voter-rating");
const starGroup = document.querySelector("#star-group");
const starButtons = document.querySelectorAll(".star-btn");
const likeButton = document.querySelector("#voter-like");
const ratingReadout = document.querySelector("#rating-readout");
const commentInput = document.querySelector("#voter-comment");
const seenCheckbox = document.querySelector("#voter-seen");
const commentCountEl = document.querySelector("#comment-count");
const resetVotesBtn = document.querySelector("#reset-votes");

let selectedRating = 0;
let isLiked = false;

const defaultVotes = [
  { name: "Arman", film: "Dawn", rating: 5, liked: true },
  { name: "Diana", film: "War", rating: 5, liked: true },
  { name: "Timur", film: "Rise", rating: 4, liked: false },
  { name: "Alina", film: "Dawn", rating: 5, liked: true },
  { name: "Max", film: "War", rating: 4, liked: false }
];

function loadVotes() {
  try {
    if (typeof localStorage !== "undefined") {
      const raw = localStorage.getItem(VOTES_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    }
  } catch (e) {
    // Fall back to default votes
  }
  return defaultVotes.slice();
}

function saveVotes(votes) {
  try {
    if (typeof localStorage !== "undefined") {
      localStorage.setItem(VOTES_STORAGE_KEY, JSON.stringify(votes));
    }
  } catch (e) {
    // Ignore storage quota errors
  }
}

let pollVotes = loadVotes();

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
  return selectedRating;
}

function updateRatingReadout(previewStars) {
  if (!ratingReadout) {
    return;
  }
  const activeCount = previewStars > 0 ? previewStars : selectedRating;
  if (activeCount === 0 && !isLiked) {
    ratingReadout.textContent = "No rating selected";
    return;
  }
  const starText = activeCount > 0 ? activeCount + " / 5 ★" : "0 / 5 ★";
  ratingReadout.textContent = isLiked ? starText + " · ♥ Liked" : starText;
}

function paintStars(activeCount, hoverCount) {
  for (const btn of starButtons) {
    const val = Number(btn.dataset.value);
    btn.classList.toggle("active", val <= activeCount);
    btn.classList.toggle("hover-preview", hoverCount > 0 && val <= hoverCount);
    btn.setAttribute("aria-pressed", String(val === activeCount));
  }
  updateRatingReadout(hoverCount);
}

for (const btn of starButtons) {
  btn.addEventListener("mouseenter", function () {
    paintStars(selectedRating, Number(btn.dataset.value));
  });

  btn.addEventListener("click", function () {
    selectedRating = Number(btn.dataset.value);
    if (ratingInput) {
      ratingInput.value = String(selectedRating);
    }
    paintStars(selectedRating, 0);
    validateRating();
  });
}

if (starGroup) {
  starGroup.addEventListener("mouseleave", function () {
    paintStars(selectedRating, 0);
  });
}

if (likeButton) {
  likeButton.addEventListener("click", function () {
    isLiked = !isLiked;
    likeButton.classList.toggle("liked", isLiked);
    likeButton.setAttribute("aria-pressed", String(isLiked));
    updateRatingReadout(0);
  });
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
    msg = "Please select a star rating from 1 to 5.";
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

  const avgRating = total > 0 ? (sumRatings / total).toFixed(1) : "0.0";
  const risePct = total > 0 ? Math.round((riseVotes / total) * 100) : 0;
  const dawnPct = total > 0 ? Math.round((dawnVotes / total) * 100) : 0;
  const warPct = total > 0 ? Math.round((warVotes / total) * 100) : 0;

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

  // Show the 4 most recent votes with Letterboxd green stars and orange heart
  const startIdx = Math.max(0, pollVotes.length - 4);
  for (let i = pollVotes.length - 1; i >= startIdx; i--) {
    const v = pollVotes[i];
    const li = document.createElement("li");

    const nameText = document.createTextNode(v.name + " watched " + v.film + " ");
    const starsSpan = document.createElement("span");
    starsSpan.classList.add("lb-stars");
    starsSpan.textContent = "★".repeat(v.rating);

    li.appendChild(nameText);
    li.appendChild(starsSpan);

    if (v.liked) {
      const heartSpan = document.createElement("span");
      heartSpan.classList.add("lb-heart");
      heartSpan.textContent = " ♥";
      li.appendChild(heartSpan);
    }

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
  const submittedLike = isLiked;

  pollVotes.push({
    name: submittedName,
    film: submittedFilm,
    rating: submittedRating,
    liked: submittedLike
  });

  saveVotes(pollVotes);
  renderPoll();

  // Clear the form, Letterboxd stars/heart, and validation states
  voteForm.reset();
  selectedRating = 0;
  isLiked = false;
  if (ratingInput) {
    ratingInput.value = "0";
  }
  if (likeButton) {
    likeButton.classList.remove("liked");
    likeButton.setAttribute("aria-pressed", "false");
  }
  paintStars(0, 0);

  const inputsToClear = [nameInput, emailInput, filmInput, dateInput, commentInput];
  for (const el of inputsToClear) {
    el.dataset.touched = "";
    el.classList.remove("input-error", "input-valid");
    el.removeAttribute("aria-invalid");
  }
  updateCommentCounter();

  // Show success message smoothly using jQuery
  const likeNote = submittedLike ? " ♥" : "";
  const $banner = $("#vote-success");
  $banner
    .text(
      "Thank you, " +
        submittedName +
        "! Your rating (" +
        submittedRating +
        "/5 ★" +
        likeNote +
        " for " +
        submittedFilm +
        ") has been saved and added to the community poll."
    )
    .stop(true, true)
    .hide()
    .slideDown(300);
});

if (resetVotesBtn) {
  resetVotesBtn.addEventListener("click", function () {
    pollVotes = defaultVotes.slice();
    saveVotes(pollVotes);
    renderPoll();
  });
}

updateCommentCounter();
paintStars(0, 0);
renderPoll();
