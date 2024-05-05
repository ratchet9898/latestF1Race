// Function to populate the year dropdown from 1946 to the current year
function populateYearDropdown() {
    const yearSelect = document.getElementById('yearSelect');
    const currentYear = new Date().getFullYear();

    for (let year = 1946; year <= currentYear; year++) {
        const option = document.createElement('option');
        option.value = year;
        option.textContent = year;
        yearSelect.appendChild(option);
    }
}

// Function to populate the race dropdown
function populateRaceDropdown(selectedYear) {
    const raceSelect = document.getElementById('raceSelect');
    raceSelect.innerHTML = ''; 

    // Fetch the list of races for the selected year
    fetch(`https://ergast.com/api/f1/${selectedYear}.json`)
        .then((response) => {
            if (!response.ok) {
                throw new Error('Not ok');
            }
            return response.json();
        })
        .then((data) => {
            const races = data.MRData.RaceTable.Races;
            races.forEach((race) => {
                const option = document.createElement('option');
                option.value = race.round;
                option.textContent = `${race.raceName} (Round ${race.round})`;
                raceSelect.appendChild(option);
            });
        })
        .catch((error) => {
            console.error('Error:', error);
        });
}

// Fetch and display race results
function fetchRaceResults(year, round) {
    const apiUrl = `https://ergast.com/api/f1/${year}/${round}/results.json`;

    fetch(apiUrl, {
        mode: 'cors',
        credentials: 'include',
        method: 'POST',
        headers: headers
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then((data) => {
            // Extract race results
            const raceResults = data.MRData.RaceTable.Races[0].Results;

            // Create a table to display the results
            const table = document.createElement('table');
            table.className = 'table table-bordered mt-4';

            // Create table headers, just add a new element to tableHeaders to display a new one
            const tableHeaders = ['Driver', 'Team', 'Points', 'Race Time'];
            const thead = document.createElement('thead');
            const trHeader = document.createElement('tr');
            tableHeaders.forEach((headerText) => {
                const th = document.createElement('th');
                th.textContent = headerText;
                trHeader.appendChild(th);
            });
            thead.appendChild(trHeader);
            table.appendChild(thead);

            // Create table rows for race results
            const tbody = document.createElement('tbody');
            raceResults.forEach((result) => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${result.Driver.givenName} ${result.Driver.familyName}</td>
                    <td>${result.Constructor.name}</td>
                    <td>${result.points}</td>
                    <td>${result.Time ? result.Time.time : 'N/A'}</td>
                `;
                tbody.appendChild(tr);
            });
            table.appendChild(tbody);

            // Display
            const raceResultsDiv = document.getElementById('raceResults');
            raceResultsDiv.innerHTML = '';
            raceResultsDiv.appendChild(table);
        })
        .catch((error) => {
            console.error('Error:', error);
        });
}

// Event listener for year selection
const yearSelect = document.getElementById('yearSelect');
yearSelect.addEventListener('change', () => {
    const selectedYear = yearSelect.value;
    const raceSelect = document.getElementById('raceSelect');
    const selectedRound = raceSelect.value;

    populateRaceDropdown(selectedYear);
    fetchRaceResults(selectedYear, selectedRound);
});

// Event listener for race selection
const raceSelect = document.getElementById('raceSelect');
raceSelect.addEventListener('change', () => {
    const selectedYear = yearSelect.value;
    const selectedRound = raceSelect.value;

    fetchRaceResults(selectedYear, selectedRound);
});

// Function to toggle dark mode
function toggleDarkMode() {
    const darkModeToggle = document.getElementById('darkModeToggle');
    const body = document.body;

    if (darkModeToggle.checked) {
        // Enable Dark Mode
        body.classList.remove('body-light');
        body.classList.add('body-dark');
        darkModeIcon.classList.remove('bi-moon');
        darkModeIcon.classList.add('bi-sun');
    } else {
        // Disable Dark Mode
        body.classList.remove('body-dark');
        body.classList.add('body-light');
        darkModeIcon.classList.remove('bi-sun');
        darkModeIcon.classList.add('bi-moon');
    }
}

// Event listener for dark mode toggle
const darkModeToggle = document.getElementById('darkModeToggle');
darkModeToggle.addEventListener('change', toggleDarkMode);

// Function to set the initial mode 
function setInitialMode() {
    const darkModeToggle = document.getElementById('darkModeToggle');
    const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;

    //FOR THE FUTURE: use a localstorage to remember the choice
    if (prefersDarkMode) {
        darkModeToggle.checked = false;
        toggleDarkMode();
    }
}

setInitialMode();

// Set the default state of the dropdown menus based on the latest race
async function setDefaultDropdownState() {
    try {
        const response = await fetch('https://ergast.com/api/f1/current/last/results.json');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();

        const year = data.MRData.RaceTable.Races[0].season;
        const round = data.MRData.RaceTable.Races[0].round;

        const yearSelect = document.getElementById('yearSelect');
        yearSelect.value = year;

        populateRaceDropdown(year);

        await new Promise((resolve) => setTimeout(resolve, 100));

        const raceSelect = document.getElementById('raceSelect');
        raceSelect.value = round;

        fetchRaceResults(year, round);
    } catch (error) {
        console.error('Error:', error);
    }
}

setDefaultDropdownState();
populateYearDropdown();


// Function to toggle fan mode (change background color)
function toggleFanMode() {
    const fanModeSelect = document.getElementById('fanModeSelect');
    const selectedTeamColor = fanModeSelect.value;

    document.body.style.backgroundColor = selectedTeamColor;
}

const fanModeSelect = document.getElementById('fanModeSelect');
fanModeSelect.addEventListener('change', toggleFanMode);

