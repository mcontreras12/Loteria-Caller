/* JavaScript by Mariluz Contreras */

/* resetting when page is refreshed */
const navigation = performance.getEntriesByType("navigation")[0];

if (navigation && navigation.type === "reload") {
    localStorage.removeItem("loteriaPlayers");
    localStorage.removeItem("loteriaContribution");
}

/*Players Page */

/* local storage for players to be added and saved */

let players = JSON.parse (
    localStorage.getItem("loteriaPlayers")
) || [];

/* save players */
function savePlayers () {
    localStorage.setItem(
        "loteriaPlayers",
        JSON.stringify(players)
    );
}

/* create constants for players page */
const addPlayerForm = document.querySelector("#add-player-form");
const playersTableBody = document.querySelector("#players-table-body");
const totalPlayers = document.querySelector("#total-players");
const totalWinnings = document.querySelector("#total-winnings");

/* function to display players on screen */
function displayPlayers () {
    if (!playersTableBody) {
        return;
    }

    playersTableBody.innerHTML = "";

    players.forEach(function(player) {
        
        const row = document.createElement("tr");

        const nameCell = document.createElement("td");
        nameCell.textContent = player.name;

        const winningsCell = document.createElement("td");
        winningsCell.textContent = "$" + player.winnings.toFixed(2);

        const actionCell = document.createElement("td");

        const removeButton = document.createElement("button");
        removeButton.textContent = "Remove";
        removeButton.type = "button";

        removeButton.addEventListener("click", function() {
            removePlayer(player.id);
        });

        actionCell.appendChild(removeButton);

        row.appendChild(nameCell);
        row.appendChild(winningsCell);
        row.appendChild(actionCell);

        playersTableBody.appendChild(row);
    });

    updatePlayerSummary();
    updateRoundPot();
}

/* adding players via the form */
if (addPlayerForm) {
    addPlayerForm.addEventListener("submit", function(event) {

        event.preventDefault();

        const playerNameInput = document.querySelector("#player-name");

        const playerName = playerNameInput.value.trim();

        if (playerName === "") {
            alert("Enter player name.");
            return;
        }

        const newPlayer = {
            id: crypto.randomUUID(), name: playerName, winnings: 0
        };

        players.push(newPlayer);

        savePlayers();
        displayPlayers();

        addPlayerForm.reset();

    });
}

/* remove players */
function removePlayer(playerId) {

    players = players.filter(function(player) {
        return player.id !== playerId;
    });

    savePlayers();
    displayPlayers();
}

/* summary of players */
function updatePlayerSummary() {
    if (totalPlayers) {
        totalPlayers.textContent = players.length;
    }

    if (totalWinnings) {
        let total = 0;

        players.forEach(function(player) {
            total += player.winnings;
        });

        totalWinnings.textContent = "$" + total.toFixed(2);
    }
}


/* Displaying players on Home page */

/* constant for list of players on home page */
const homePlayerList = document.querySelector("#home-player-list");

/* display players on home page */
function displayHomePlayers() {

    if (!homePlayerList) {
        return;
    }

    homePlayerList.innerHTML = "";

    if (players.length === 0) {
        const message = document.createElement("li");
        message.textContent = "No players added yet.";
        homePlayerList.appendChild(message);
        return;
    }

    players.forEach(function(player) {
        
        const listItem = document.createElement("li");

        listItem.textContent = player.name;

        homePlayerList.appendChild(listItem);
    });
}

/* initializing home player list */
displayHomePlayers();

/* Round Contributions */

/* load the contribution */
let contributionAmount = Number(
    localStorage.getItem("loteriaContribution")
) || 0;

/* create constants for the round contributions */
const contributionForm = document.querySelector("#contribution-form");
const contributionInput = document.querySelector("#contribution-amount");
const roundPot = document.querySelector("#round-pot");

/* calculate the round pot */
function updateRoundPot() {
    if (!roundPot) {
        return;
    }

    const totalPot = players.length * contributionAmount;

    roundPot.textContent = "$" + totalPot.toFixed(2);
}

/* event listener for the contribution form */
if (contributionForm) {
    
    contributionForm.addEventListener("submit", function(event) {

        event.preventDefault();

        const amount = Number(contributionInput.value);

        if (!Number.isFinite(amount) || amount <= 0) {
            alert("Enter a valid contribution amount.");
            return;
        }

        contributionAmount = amount;

        localStorage.setItem(
            "loteriaContribution", contributionAmount
        );

        updateRoundPot();
    });
}

/* display the new round contribution and pot */
if (contributionInput) {
    contributionInput.value = contributionAmount || "";
}

updateRoundPot();

/* Card Caller */

/* create the constants for the page */

const currentCardImage = document.querySelector("#current-card-image");
const previousCardImage = document.querySelector("#previous-card-image");

const currentCardName = document.querySelector("#current-card-name");
const previousCardName = document.querySelector("#previous-card-name");
const calledCardName = document.querySelector("#called-card-name");

const nextCardButton = document.querySelector("#next-card");
const newGameButton = document.querySelector("#new-game");

const cardsCalledDisplay = document.querySelector("#cards-called");
const gamePlayerCount = document.querySelector("#game-player-count");

/* all loteria cards */
const cardNames = [
    "el_gallo",
    "el_diablito",
    "la_dama",
    "el_catrin",
    "el_paraguas",
    "la_sirena",
    "la_escalera",
    "la_botella",
    "el_barril",
    "el_arbol",
    "el_melon",
    "el_valiente",
    "el_gorrito",
    "la_muerte",
    "la_pera",
    "la_bandera",
    "el_bandolon",
    "el_violoncello",
    "la_garza",
    "el_pajaro",
    "la_mano",
    "la_bota",
    "la_luna",
    "el_cotorro",
    "el_borracho",
    "el_negrito",
    "el_corazon",
    "la_sandia",
    "el_tambor",
    "el_camaron",
    "las_jaras",
    "el_musico",
    "la_arana",
    "el_soldado",
    "la_estrella",
    "el_cazo",
    "el_mundo",
    "el_apache",
    "el_nopal",
    "el_alacran",
    "la_rosa",
    "la_calavera",
    "la_campana",
    "el_cantarito",
    "el_venado",
    "el_sol",
    "la_corona",
    "la_chalupa",
    "el_pino",
    "el_pescado",
    "la_palma",
    "la_maceta",
    "el_arpa",
    "la_rana"
];

function getCardImage(cardNumber) {

    const number = String(cardNumber).padStart(2, "0");

    const name = cardNames[cardNumber - 1];

    return "images/cards/" + number + "_" + name + ".jpg";
}

function getCardName(cardNumber) {

    const name = cardNames[cardNumber -1];

    return name.replaceAll("_", " ").replace(
        /\b\w/g,
        function(letter) {
            return letter.toUpperCase();
        }
    );
}

/* game variables */
let deck = [];
let calledCards = [];
let currentCard = null;
let previousCard = null;

/* function to create the deck */
function createDeck() {
    deck = [];
    
    for (let i = 1; i <= 54; i++) {
        deck.push(i);
    }
}

/* function to shuffle the deck */
function shuffleDeck() {

    for (let i = deck.length - 1; i > 0; i--) {

        const randomIndex = Math.floor(
            Math.random() * (i + 1)
        );

        const temp = deck[i];

        deck[i] = deck[randomIndex];

        deck[randomIndex] = temp;
    }
}

/* displays current card in game */
function displayCurrentCard() {

    if (!currentCardImage || currentCard === null) {
        return;
    }

    const name = getCardName(currentCard);

    currentCardImage.src = getCardImage(currentCard);

    currentCardImage.alt = name;

    if (currentCardName) {
        currentCardName.textContent = name;
    }

    if (calledCardName) {
        calledCardName.textContent = name;
    }
}

/* display previous card in game */
function displayPreviousCard() {

    if (!previousCardImage || previousCard === null) {
        return;
    }

    const name = getCardName(previousCard);

    previousCardImage.src = getCardImage(previousCard);

    previousCardImage.alt = name;

    if (previousCardName) {
        previousCardName.textContent = name;
    }
}

/* function to call the next card */
function callNextCard() {

    if (deck.length === 0) {
        alert("All cards have been called");
        return;
    }

    previousCard = currentCard;

    currentCard = deck.pop();

    calledCards.push(currentCard);

    displayCurrentCard();
    displayPreviousCard();

    if (cardsCalledDisplay) {
        cardsCalledDisplay.textContent = calledCards.length;
    }
}

/* function to start new game */
function startGame() {

    resetGame();

    createDeck();

    shuffleDeck();

    callNextCard();
}

/* function to reset the game */
function resetGame() {

    deck = [];
    calledCards = [];

    currentCard = null;
    previousCard = null;

    if (currentCardImage) {
        currentCardImage.removeAttribute("src");
        currentCardImage.alt = "No card called";
    }

    if (previousCardImage) {
        previousCardImage.removeAttribute("src");
        previousCardImage.alt = "No previous card";
    }

    if (currentCardName) {
        currentCardName.textContent = "Ready to Play";
    }

    if (previousCardName) {
        previousCardName.textContent = "None";
    }

    if (calledCardName) {
        calledCardName.textContent = "None";
    }

    if (cardsCalledDisplay) {
        cardsCalledDisplay.textContent = "0";
    }
}

/* next card button */
if (nextCardButton) {

    nextCardButton.addEventListener("click", function() {

        if (calledCards.length === 0) {
            startGame();
        } else {
            callNextCard();
        }
    });
}

/* new game button */
if (newGameButton) {

    newGameButton.addEventListener("click", function() {

        startGame();

        document.querySelector("#game-results").hidden = true;

        document.querySelector("#active-game").hidden = false;
    });
}

/* display the number of players on game page */
if (gamePlayerCount) {
    gamePlayerCount.textContent = players.length;
}

/* initialize the pages */
displayPlayers();
displayHomePlayers();
updateRoundPot();