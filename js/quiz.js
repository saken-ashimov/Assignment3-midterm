// Franchise knowledge quiz for compare.html
const quizQuestions = [
  {
    question: "What was the first spoken word Caesar shouted to stop the shelter guard in Rise (2011)?",
    options: ["Home!", "No!", "Run!", "Peace!"],
    correctIndex: 1,
    explanation: "Caesar shouted 'No!' against Dodge Landon — the moment the apes truly rebelled."
  },
  {
    question: "Where did Caesar establish the apes' forest colony after escaping San Francisco?",
    options: ["Yosemite Valley", "Muir Woods redwood forest", "Central Park", "Sierra Nevada ski resort"],
    correctIndex: 1,
    explanation: "Will used to take young Caesar to Muir Woods, so Caesar led the apes there."
  },
  {
    question: "Which ape betrayed Caesar and shot him to blame the humans in Dawn (2014)?",
    options: ["Rocket", "Maurice", "Koba", "Bad Ape"],
    correctIndex: 2,
    explanation: "Koba could not forgive humans for his lab scars and staged Caesar's shooting to start a war."
  },
  {
    question: "Which studio created the digital motion-capture effects for all three films?",
    options: ["Weta Digital", "Pixar", "DreamWorks", "Aardman"],
    correctIndex: 0,
    explanation: "Weta Digital turned Andy Serkis and the cast's motion-capture performances into lifelike apes."
  },
  {
    question: "In War (2017), who helps Caesar and his group find the Colonel's border fortress?",
    options: ["Will Rodman", "Dodge Landon", "Bad Ape", "Malcolm"],
    correctIndex: 2,
    explanation: "Bad Ape survived alone at a mountain zoo and knew where the human soldiers were camped."
  }
];

const progressEl = document.querySelector("#quiz-progress");
const scoreLiveEl = document.querySelector("#quiz-score-live");
const questionEl = document.querySelector("#quiz-question");
const optionsBox = document.querySelector("#quiz-options");
const feedbackBox = document.querySelector("#quiz-feedback");
const nextBtn = document.querySelector("#quiz-next");
const playArea = document.querySelector("#quiz-play");
const resultArea = document.querySelector("#quiz-result");
const finalScoreEl = document.querySelector("#quiz-final-score");
const finalRankEl = document.querySelector("#quiz-final-rank");
const restartBtn = document.querySelector("#quiz-restart");

let currentIndex = 0;
let score = 0;
let hasAnswered = false;

function renderQuestion() {
  const item = quizQuestions[currentIndex];
  hasAnswered = false;

  progressEl.textContent = "Question " + (currentIndex + 1) + " of " + quizQuestions.length;
  scoreLiveEl.textContent = "Score: " + score;
  questionEl.textContent = item.question;

  feedbackBox.classList.add("hidden");
  feedbackBox.classList.remove("win", "loss");
  nextBtn.classList.add("hidden");

  optionsBox.textContent = "";

  for (let i = 0; i < item.options.length; i++) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.classList.add("quiz-option");
    btn.textContent = (i + 1) + ". " + item.options[i];
    btn.dataset.index = i;

    btn.addEventListener("click", function () {
      chooseAnswer(i);
    });

    optionsBox.appendChild(btn);
  }
}

function chooseAnswer(chosenIndex) {
  if (hasAnswered === true) {
    return;
  }
  hasAnswered = true;

  const item = quizQuestions[currentIndex];
  const allButtons = optionsBox.querySelectorAll(".quiz-option");

  for (let i = 0; i < allButtons.length; i++) {
    allButtons[i].disabled = true;
    if (i === item.correctIndex) {
      allButtons[i].classList.add("correct");
    } else if (i === chosenIndex) {
      allButtons[i].classList.add("wrong");
    }
  }

  feedbackBox.classList.remove("hidden");

  if (chosenIndex === item.correctIndex) {
    score = score + 1;
    feedbackBox.classList.add("win");
    feedbackBox.textContent = "Correct! " + item.explanation;
  } else {
    feedbackBox.classList.add("loss");
    feedbackBox.textContent = "Not quite. " + item.explanation;
  }

  scoreLiveEl.textContent = "Score: " + score;
  nextBtn.textContent =
    currentIndex === quizQuestions.length - 1 ? "See final result" : "Next question →";
  nextBtn.classList.remove("hidden");
}

function showFinalResult() {
  playArea.classList.add("hidden");
  resultArea.classList.remove("hidden");

  const percent = Math.round((score / quizQuestions.length) * 100);
  finalScoreEl.textContent =
    "You scored " + score + " out of " + quizQuestions.length + " (" + percent + "%)";

  let rankText = "";
  if (score === quizQuestions.length) {
    rankText = "Rank: Alpha Leader (Caesar's Equal) — Apes together strong!";
  } else if (score >= 3) {
    rankText = "Rank: Council Elder (Maurice's Trusted Ally) — Strong knowledge of the trilogy.";
  } else {
    rankText = "Rank: Forest Scout — Time for a rewatch from Rise (2011) to War (2017)!";
  }

  finalRankEl.textContent = rankText;
}

function nextStep() {
  if (currentIndex < quizQuestions.length - 1) {
    currentIndex = currentIndex + 1;
    renderQuestion();
  } else {
    showFinalResult();
  }
}

function restartQuiz() {
  currentIndex = 0;
  score = 0;
  hasAnswered = false;
  resultArea.classList.add("hidden");
  playArea.classList.remove("hidden");
  renderQuestion();
}

nextBtn.addEventListener("click", nextStep);
restartBtn.addEventListener("click", restartQuiz);

// Keyboard support: keys 1-4 choose an answer when not typing in a form field
document.addEventListener("keydown", function (event) {
  const activeTag = document.activeElement ? document.activeElement.tagName : "";
  if (activeTag === "INPUT" || activeTag === "TEXTAREA" || activeTag === "SELECT") {
    return;
  }
  if (playArea.classList.contains("hidden")) {
    return;
  }

  if (event.key >= "1" && event.key <= "4" && hasAnswered === false) {
    chooseAnswer(Number(event.key) - 1);
  }
});

renderQuestion();
