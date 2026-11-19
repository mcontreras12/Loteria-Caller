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

/* initialing the players page */
displayPlayers();