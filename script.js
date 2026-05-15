let goats =
    JSON.parse(localStorage.getItem("goats")) || [];

let expenses =
    JSON.parse(localStorage.getItem("expenses")) || [];

let incomes =
    JSON.parse(localStorage.getItem("incomes")) || [];

let editIndex = -1;

function saveData() {

    localStorage.setItem(
        "goats",
        JSON.stringify(goats)
    );

    localStorage.setItem(
        "expenses",
        JSON.stringify(expenses)
    );

    localStorage.setItem(
        "incomes",
        JSON.stringify(incomes)
    );
}

function renderGoats(filteredGoats = goats) {

    const goatList =
        document.getElementById("goatList");

    const totalGoats =
        document.getElementById("totalGoats");

    goatList.innerHTML = "";

    totalGoats.innerText =
        `Total Goats: ${filteredGoats.length}`;

    filteredGoats.forEach((goat, index) => {

        if (!goat.vaccinations) {
            goat.vaccinations = [];
        }

        if (!goat.weights) {
            goat.weights = [];
        }

        let vaccineHTML = "";

        if (goat.vaccinations.length > 0) {

            vaccineHTML += "<h4>Vaccinations:</h4>";

            goat.vaccinations.forEach(vaccine => {

                vaccineHTML += `
                    • ${vaccine.name}
                    (${vaccine.date})<br>
                `;
            });
        }

        let weightHTML = "";

        if (goat.weights.length > 0) {

            weightHTML += "<h4>Weight History:</h4>";

            goat.weights.forEach(weight => {

                weightHTML += `
                    • ${weight.weight} KG
                    (${weight.date})<br>
                `;
            });
        }

        goatList.innerHTML += `
            <div class="goat-card">

                <strong>Tag:</strong> ${goat.tag}<br>

                <strong>Breed:</strong> ${goat.breed}<br>

                <strong>Gender:</strong> ${goat.gender}<br>

                <strong>Age:</strong> ${goat.age}<br><br>

                ${goat.image
                    ? `<img src="${goat.image}" class="goat-image">`
                    : ""
                }

                ${vaccineHTML}

                ${weightHTML}

                <button onclick="editGoat(${index})">
                    Edit
                </button>

                <button onclick="deleteGoat(${index})">
                    Delete
                </button>

                <button onclick="addVaccination(${index})">
                    Add Vaccine
                </button>

                <button onclick="addWeight(${index})">
                    Add Weight
                </button>

            </div>
        `;
    });
}

function renderExpenses() {

    const expenseList =
        document.getElementById("expenseList");

    const totalExpense =
        document.getElementById("totalExpense");

    expenseList.innerHTML = "";

    let total = 0;

    expenses.forEach((expense, index) => {

        total += Number(expense.amount);

        expenseList.innerHTML += `
            <div class="expense-card">

                <strong>${expense.title}</strong><br>

                ₹${expense.amount}<br><br>

                <button onclick="deleteExpense(${index})">
                    Delete
                </button>

            </div>
        `;
    });

    totalExpense.innerText =
        `Total Expense: ₹${total}`;

    renderIncome();
}

function renderIncome() {

    const incomeList =
        document.getElementById("incomeList");

    const totalIncome =
        document.getElementById("totalIncome");

    const netProfit =
        document.getElementById("netProfit");

    incomeList.innerHTML = "";

    let total = 0;

    incomes.forEach((income, index) => {

        total += Number(income.amount);

        incomeList.innerHTML += `
            <div class="income-card">

                <strong>${income.title}</strong><br>

                ₹${income.amount}<br><br>

                <button onclick="deleteIncome(${index})">
                    Delete
                </button>

            </div>
        `;
    });

    totalIncome.innerText =
        `Total Income: ₹${total}`;

    let expenseTotal = 0;

    expenses.forEach(expense => {
        expenseTotal += Number(expense.amount);
    });

    const profit = total - expenseTotal;

    netProfit.innerText =
        `Net Profit: ₹${profit}`;
}

function addExpense() {

    const title =
        document.getElementById("expenseTitle").value;

    const amount =
        document.getElementById("expenseAmount").value;

    if (!title || !amount) {

        alert("Fill all expense fields");

        return;
    }

    expenses.push({
        title,
        amount
    });

    saveData();

    renderExpenses();

    document.getElementById("expenseTitle").value = "";

    document.getElementById("expenseAmount").value = "";
}

function deleteExpense(index) {

    expenses.splice(index, 1);

    saveData();

    renderExpenses();
}

function addIncome() {

    const title =
        document.getElementById("incomeTitle").value;

    const amount =
        document.getElementById("incomeAmount").value;

    if (!title || !amount) {

        alert("Fill all income fields");

        return;
    }

    incomes.push({
        title,
        amount
    });

    saveData();

    renderIncome();

    document.getElementById("incomeTitle").value = "";

    document.getElementById("incomeAmount").value = "";
}

function deleteIncome(index) {

    incomes.splice(index, 1);

    saveData();

    renderIncome();
}

function addGoat() {

    const tag =
        document.getElementById("tag").value;

    const breed =
        document.getElementById("breed").value;

    const gender =
        document.getElementById("gender").value;

    const age =
        document.getElementById("age").value;

    const imageInput =
        document.getElementById("goatImage");

    if (!tag || !breed || !gender || !age) {

        alert("Please fill all fields");

        return;
    }

    const file = imageInput.files[0];

    if (file) {

        const reader = new FileReader();

        reader.onload = function(e) {

            saveGoat(
                tag,
                breed,
                gender,
                age,
                e.target.result
            );
        };

        reader.readAsDataURL(file);

    } else {

        saveGoat(
            tag,
            breed,
            gender,
            age,
            ""
        );
    }
}

function saveGoat(
    tag,
    breed,
    gender,
    age,
    image
) {

    const goat = {
        tag,
        breed,
        gender,
        age,
        image,
        vaccinations: [],
        weights: []
    };

    if (editIndex === -1) {

        goats.push(goat);

    } else {

        goat.vaccinations =
            goats[editIndex].vaccinations || [];

        goat.weights =
            goats[editIndex].weights || [];

        if (!image) {
            goat.image =
                goats[editIndex].image || "";
        }

        goats[editIndex] = goat;

        editIndex = -1;
    }

    saveData();

    renderGoats();

    clearForm();
}

function editGoat(index) {

    const goat = goats[index];

    document.getElementById("tag").value = goat.tag;

    document.getElementById("breed").value =
        goat.breed;

    document.getElementById("gender").value =
        goat.gender;

    document.getElementById("age").value =
        goat.age;

    editIndex = index;
}

function deleteGoat(index) {

    goats.splice(index, 1);

    saveData();

    renderGoats();
}

function addVaccination(index) {

    if (!goats[index].vaccinations) {
        goats[index].vaccinations = [];
    }

    const vaccineName =
        prompt("Enter Vaccine Name");

    if (!vaccineName) return;

    const vaccineDate =
        prompt("Enter Vaccination Date");

    if (!vaccineDate) return;

    goats[index].vaccinations.push({
        name: vaccineName,
        date: vaccineDate
    });

    saveData();

    renderGoats();
}

function addWeight(index) {

    if (!goats[index].weights) {
        goats[index].weights = [];
    }

    const weight =
        prompt("Enter Weight in KG");

    if (!weight) return;

    const date =
        prompt("Enter Weight Date");

    if (!date) return;

    goats[index].weights.push({
        weight,
        date
    });

    saveData();

    renderGoats();
}

function searchGoats() {

    const searchText =
        document.getElementById("searchBox")
        .value
        .toLowerCase();

    const filtered = goats.filter(goat =>

        goat.tag.toLowerCase().includes(searchText) ||

        goat.breed.toLowerCase().includes(searchText)
    );

    renderGoats(filtered);
}

function clearForm() {

    document.getElementById("tag").value = "";

    document.getElementById("breed").value = "";

    document.getElementById("gender").value = "";

    document.getElementById("age").value = "";

    document.getElementById("goatImage").value = "";
}

async function downloadPDF() {

    const { jsPDF } = window.jspdf;

    const doc = new jsPDF();

    let y = 20;

    doc.setFontSize(20);

    doc.text("Goat Farm Report", 20, y);

    y += 20;

    doc.setFontSize(14);

    doc.text(`Total Goats: ${goats.length}`, 20, y);

    y += 10;

    let totalExpense = 0;

    expenses.forEach(expense => {
        totalExpense += Number(expense.amount);
    });

    let totalIncome = 0;

    incomes.forEach(income => {
        totalIncome += Number(income.amount);
    });

    const profit = totalIncome - totalExpense;

    doc.text(`Total Expense: ₹${totalExpense}`, 20, y);

    y += 10;

    doc.text(`Total Income: ₹${totalIncome}`, 20, y);

    y += 10;

    doc.text(`Net Profit: ₹${profit}`, 20, y);

    y += 20;

    doc.setFontSize(16);

    doc.text("Goat Records", 20, y);

    y += 15;

    goats.forEach((goat, index) => {

        doc.setFontSize(12);

        doc.text(
            `${index + 1}. ${goat.tag} | ${goat.breed} | ${goat.gender} | Age: ${goat.age}`,
            20,
            y
        );

        y += 10;

        if (y > 270) {

            doc.addPage();

            y = 20;
        }
    });

    doc.save("GoatFarmReport.pdf");
}

function backupData() {

    const data = {
        goats,
        expenses,
        incomes
    };

    const jsonData =
        JSON.stringify(data);

    const blob = new Blob(
        [jsonData],
        { type: "application/json" }
    );

    const url =
        URL.createObjectURL(blob);

    const a =
        document.createElement("a");

    a.href = url;

    a.download =
        "GoatFarmBackup.json";

    a.click();

    URL.revokeObjectURL(url);
}

function restoreData(event) {

    const file =
        event.target.files[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = function(e) {

        const data =
            JSON.parse(e.target.result);

        goats = data.goats || [];

        expenses = data.expenses || [];

        incomes = data.incomes || [];

        saveData();

        renderGoats();

        renderExpenses();

        renderIncome();

        alert("Backup Restored!");
    };

    reader.readAsText(file);
}

renderGoats();

renderExpenses();

renderIncome();

if ("serviceWorker" in navigator) {

    navigator.serviceWorker
        .register("service-worker.js")

        .then(() => {
            console.log("Service Worker Registered");
        });
}