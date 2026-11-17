const initialStudents = [
    { surname: "Abellonar", birthday: "2008-07-28" },
    { surname: "Cecillano", birthday: "2008-01-03" },
    { surname: "Cuntapay", birthday: "2008-06-17" },
    { surname: "Agravante", birthday: "2008-08-27" },
    { surname: "Apalacio", birthday: "" },
    { surname: "Arguil", birthday: "2008-09-08" },
    { surname: "Baluya", birthday: "2008-09-01" },
    { surname: "Bermudez", birthday: "2004-08-08" },
    { surname: "Bulala", birthday: "2008-08-30" },
    { surname: "Camacho", birthday: "2007-10-17" },
    { surname: "Campos", birthday: "2008-02-24" },
    { surname: "Cantero", birthday: "2008-08-29" },
    { surname: "Capistrano", birthday: "2008-04-19" },
    { surname: "Castillo", birthday: "2008-03-17" },
    { surname: "Castro", birthday: "2004-01-07" },
    { surname: "Coquilla", birthday: "2008-09-27" },
    { surname: "Cortez", birthday: "" },
    { surname: "Cruz", birthday: "" },
    { surname: "Dagdag", birthday: "2008-02-18" },
    { surname: "Dauba", birthday: "2008-10-27" },
    { surname: "De Guzman", birthday: "2007-02-12" },
    { surname: "Delos Santos", birthday: "2008-08-09" },
    { surname: "Dezalisa", birthday: "" },
    { surname: "Digas", birthday: "" },
    { surname: "Gabay", birthday: "2009-10-25" },
    { surname: "Garbin", birthday: "" },
    { surname: "Gepulle", birthday: "2007-11-08" },
    { surname: "Hernandez", birthday: "2009-04-29" },
    { surname: "Ignacio", birthday: "2009-10-25" },
    { surname: "Lapag", birthday: "2007-07-21" },
    { surname: "Lazares", birthday: "2008-07-10" },
    { surname: "Mangente", birthday: "2007-05-28" },
    { surname: "Marasigan", birthday: "2007-11-14" },
    { surname: "Mejia", birthday: "2008-09-13" },
    { surname: "Miano", birthday: "" },
    { surname: "Mirador", birthday: "2008-01-28" },
    { surname: "Ojas", birthday: "2007-12-12" },
    { surname: "Otrera", birthday: "2007-11-14" },
    { surname: "Palmaria", birthday: "2008-04-28" },
    { surname: "Parallag", birthday: "2008-07-19" },
    { surname: "Parungo", birthday: "2008-01-05" },
    { surname: "Pastorite", birthday: "" },
    { surname: "Patriaca", birthday: "2006-11-29" },
    { surname: "Pe Benito", birthday: "" },
    { surname: "Soro", birthday: "" },
    { surname: "Tuason", birthday: "2008-10-19" },
    { surname: "Umbay", birthday: "2006-10-27" },
    { surname: "Valdez", birthday: "" },
    { surname: "Victor", birthday: "" },
    { surname: "Villamor", birthday: "2008-01-03" }
];

// LOAD SAVED DATA OR INITIAL RECORDS

let students = JSON.parse(
    localStorage.getItem("birthdayStudents")
) || initialStudents;

function saveData() {
    localStorage.setItem(
        "birthdayStudents",
        JSON.stringify(students)
    );
}

// FORMAT BIRTHDAY

function formatBirthday(date) {
    if (!date) return "Not provided";

    const [year, month, day] = date.split("-");

    return `${month}/${day}/${year}`;
}

// GET NEXT BIRTHDAY

function getUpcomingBirthday(date) {
    if (!date) return "Not provided";

    const [year, month, day] = date.split("-").map(Number);

    const today = new Date();

    let nextDate = new Date(
        today.getFullYear(),
        month - 1,
        day
    );

    if (
        nextDate.getFullYear() < today.getFullYear() ||
        nextDate < new Date(
            today.getFullYear(),
            today.getMonth(),
            today.getDate()
        )
    ) {
        nextDate.setFullYear(today.getFullYear() + 1);
    }

    const todayUTC = Date.UTC(
        today.getFullYear(),
        today.getMonth(),
        today.getDate()
    );

    const birthdayUTC = Date.UTC(
        nextDate.getFullYear(),
        nextDate.getMonth(),
        nextDate.getDate()
    );

    const daysLeft = Math.round(
        (birthdayUTC - todayUTC) / 86400000
    );

    if (daysLeft === 0) return "Today!";

    return `In ${daysLeft} days`;
}

// UPDATE DASHBOARD

function updateDashboard() {
    document.getElementById("totalStudents").textContent =
        students.length;

    document.getElementById("withBirthday").textContent =
        students.filter(s => s.birthday !== "").length;

    document.getElementById("missingBirthday").textContent =
        students.filter(s => s.birthday === "").length;
}

// DISPLAY STUDENTS

function displayStudents() {
    const table = document.getElementById("studentTable");

    const search = document
        .getElementById("searchInput")
        .value.toLowerCase();

    const filter = document
        .getElementById("filterSelect")
        .value;

    table.replaceChildren();

    const filteredStudents = students
        .map((student, index) => ({ ...student, index }))
        .filter(student => {
            const matchesSearch = student.surname
                .toLowerCase()
                .includes(search);

            const matchesFilter =
                filter === "all" ||
                (filter === "with" && student.birthday !== "") ||
                (filter === "missing" && student.birthday === "");

            return matchesSearch && matchesFilter;
        });

    if (filteredStudents.length === 0) {
        const row = table.insertRow();
        const cell = row.insertCell();

        cell.colSpan = 5;
        cell.className = "no-data";
        cell.textContent = "No students found.";

        updateDashboard();
        return;
    }

    filteredStudents.forEach((student, index) => {
        const row = table.insertRow();

        const values = [
            index + 1,
            student.surname,
            formatBirthday(student.birthday),
            getUpcomingBirthday(student.birthday)
        ];

        values.forEach(value => {
            const cell = row.insertCell();
            cell.textContent = value;
        });

        const actionCell = row.insertCell();

        const deleteButton = document.createElement("button");

        deleteButton.textContent = "Delete";
        deleteButton.className = "delete-btn";

        deleteButton.addEventListener("click", () => {
            deleteStudent(student.index);
        });

        actionCell.appendChild(deleteButton);
    });

    updateDashboard();
}

// ADD STUDENT

document.getElementById("studentForm")
    .addEventListener("submit", function(event) {

        event.preventDefault();

        const surname = document
            .getElementById("surname")
            .value.trim();

        const birthday = document
            .getElementById("birthday")
            .value;

        if (!surname) return;

        students.push({
            surname: surname,
            birthday: birthday
        });

        saveData();

        this.reset();

        displayStudents();
    });

// DELETE STUDENT

function deleteStudent(index) {
    const confirmed = confirm(
        "Are you sure you want to delete this student?"
    );

    if (!confirmed) return;

    students.splice(index, 1);

    saveData();

    displayStudents();
}

// SEARCH

document.getElementById("searchInput")
    .addEventListener("input", displayStudents);

// FILTER

document.getElementById("filterSelect")
    .addEventListener("change", displayStudents);

// INITIAL // SORT STUDENTS ALPHABETICALLY

students.sort((a, b) => {
    return a.surname.localeCompare(b.surname);
});

// REFRESH DISPLAY

displayStudents(); 
