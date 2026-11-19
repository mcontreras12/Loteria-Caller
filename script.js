/* JavaScript by Mariluz Contreras */

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

