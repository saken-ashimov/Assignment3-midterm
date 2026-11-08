// Dynamic character archive for index.html (9 objects, 6 properties each)
const characters = [
  {
    name: "Caesar",
    actor: "Andy Serkis",
    side: "Apes",
    firstFilm: "Rise",
    filmsCount: 3,
    description: "Raised by humans, leader of the apes. He wants peace for his colony and pays a heavy price in every film."
  },
  {
    name: "Koba",
    actor: "Toby Kebbell",
    side: "Apes",
    firstFilm: "Rise",
    filmsCount: 2,
    description: "A scarred bonobo survivor of lab experiments. His hatred of humans sparks open war in Dawn."
  },
  {
    name: "Maurice",
    actor: "Karin Konoval",
    side: "Apes",
    firstFilm: "Rise",
    filmsCount: 3,
    description: "A wise circus orangutan who speaks in sign language, teaches young apes, and acts as Caesar's conscience."
  },
  {
    name: "Rocket",
    actor: "Terry Notary",
    side: "Apes",
    firstFilm: "Rise",
    filmsCount: 3,
    description: "A shelter chimpanzee who starts as Caesar's rival and becomes his most loyal lieutenant."
  },
  {
    name: "Bad Ape",
    actor: "Steve Zahn",
    side: "Apes",
    firstFilm: "War",
    filmsCount: 1,
    description: "A lonely zoo chimpanzee from Sierra Nevada who learned human speech and guides Caesar to the border fortress."
  },
  {
    name: "Cornelius",
    actor: "Devyn Dalton",
    side: "Apes",
    firstFilm: "Dawn",
    filmsCount: 2,
    description: "Caesar's younger son, whose survival represents the future of the ape nation after the war."
  },
  {
    name: "Will Rodman",
    actor: "James Franco",
    side: "Humans",
    firstFilm: "Rise",
    filmsCount: 1,
    description: "The San Francisco chemist who creates the ALZ-112 cure for his father and raises young Caesar at home."
  },
  {
    name: "Malcolm",
    actor: "Jason Clarke",
    side: "Humans",
    firstFilm: "Dawn",
    filmsCount: 1,
    description: "An engineer trying to repair a forest dam peacefully, proving to Caesar that some humans can be trusted."
  },
  {
    name: "The Colonel",
    actor: "Woody Harrelson",
    side: "Humans",
    firstFilm: "War",
    filmsCount: 1,
    description: "Ruthless commander of Alpha-Omega who fights a mutated virus and becomes Caesar's final mirror enemy."
  }
];

const castList = document.querySelector("#cast-list");
const searchInput = document.querySelector("#char-search");
const sideSelect = document.querySelector("#char-side");
const filmSelect = document.querySelector("#char-film");
const sortSelect = document.querySelector("#char-sort");
const resetBtn = document.querySelector("#char-reset");
const emptyResetBtn = document.querySelector("#empty-reset");
const statsText = document.querySelector("#char-stats");
const emptyBox = document.querySelector("#char-empty");

function renderCharacters() {
  const query = searchInput.value.trim().toLowerCase();
  const selectedSide = sideSelect.value;
  const selectedFilm = filmSelect.value;
  const selectedSort = sortSelect.value;

  const filtered = [];

  for (const person of characters) {
    const matchesSearch =
      query === "" ||
      person.name.toLowerCase().includes(query) ||
      person.actor.toLowerCase().includes(query) ||
      person.description.toLowerCase().includes(query);

    const matchesSide = selectedSide === "all" || person.side === selectedSide;
    const matchesFilm = selectedFilm === "all" || person.firstFilm === selectedFilm;

    if (matchesSearch && matchesSide && matchesFilm) {
      filtered.push(person);
    }
  }

  if (selectedSort === "az") {
    filtered.sort(function (a, b) {
      return a.name.localeCompare(b.name);
    });
  } else if (selectedSort === "films") {
    filtered.sort(function (a, b) {
      return b.filmsCount - a.filmsCount;
    });
  }

  // Calculate counts for Apes and Humans
  let apesCount = 0;
  let humansCount = 0;
  for (const item of filtered) {
    if (item.side === "Apes") {
      apesCount = apesCount + 1;
    } else {
      humansCount = humansCount + 1;
    }
  }

  statsText.textContent =
    "Showing " +
    filtered.length +
    " of " +
    characters.length +
    " characters (" +
    apesCount +
    " Apes, " +
    humansCount +
    " Humans)";

  castList.textContent = "";

  // Handle empty result ("nothing found")
  if (filtered.length === 0) {
    emptyBox.classList.remove("hidden");
    return;
  }

  emptyBox.classList.add("hidden");

  // Create cards using DOM manipulation
  for (const person of filtered) {
    const article = document.createElement("article");
    article.classList.add("cast-item");
    if (person.side === "Humans") {
      article.classList.add("side-humans");
    }

    const bodyWrap = document.createElement("div");

    const topRow = document.createElement("div");
    topRow.classList.add("cast-top");

    const nameHeading = document.createElement("h3");
    nameHeading.classList.add("cast-name");
    nameHeading.textContent = person.name;

    const badge = document.createElement("span");
    badge.classList.add("side-badge");
    if (person.side === "Humans") {
      badge.classList.add("humans");
    }
    badge.textContent = person.side;

    topRow.appendChild(nameHeading);
    topRow.appendChild(badge);

    const actorLine = document.createElement("p");
    actorLine.classList.add("cast-actor");
    actorLine.textContent = "Played by " + person.actor;

    const descLine = document.createElement("p");
    descLine.classList.add("cast-text");
    descLine.textContent = person.description;

    bodyWrap.appendChild(topRow);
    bodyWrap.appendChild(actorLine);
    bodyWrap.appendChild(descLine);

    const metaLine = document.createElement("p");
    metaLine.classList.add("cast-meta");
    const word = person.filmsCount === 1 ? "film" : "films";
    metaLine.textContent =
      "First appears in: " + person.firstFilm + " · In " + person.filmsCount + " " + word;

    article.appendChild(bodyWrap);
    article.appendChild(metaLine);
    castList.appendChild(article);
  }
}

function resetFilters() {
  searchInput.value = "";
  sideSelect.value = "all";
  filmSelect.value = "all";
  sortSelect.value = "default";
  renderCharacters();
}

searchInput.addEventListener("input", renderCharacters);
sideSelect.addEventListener("change", renderCharacters);
filmSelect.addEventListener("change", renderCharacters);
sortSelect.addEventListener("change", renderCharacters);
resetBtn.addEventListener("click", resetFilters);
emptyResetBtn.addEventListener("click", resetFilters);

renderCharacters();
