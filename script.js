let students = [];

/* TOAST FUNCTION */
function showToast(message, type="info") {
    const container = document.getElementById("toastContainer");
    const toast = document.createElement("div");
    toast.className = `toast ${type}`;
    toast.textContent = message;
    container.appendChild(toast);

    setTimeout(() => {
        container.removeChild(toast);
    }, 3000);
}

/* LANDING → LOGIN */
function goToLogin() {
    document.getElementById("landingPage").style.display = "none";
    document.getElementById("loginBox").style.display = "block";
}

/* LOGIN */
const loginUserInput = document.getElementById("loginUser");
const loginPassInput = document.getElementById("loginPass");
const loginBtn = document.getElementById("loginBtn");

function handleLogin() {

    let username = loginUserInput.value.trim();
    let pass = loginPassInput.value.trim();

    if (username === "admin" && pass === "admin890") {

        showToast("Login successful!", "success");

        document.getElementById("loginBox").style.display = "none";
        document.getElementById("mainApp").style.display = "block";

    } else {

        showToast("Wrong username or password!", "error");
    }

    loginUserInput.value = "";
    loginPassInput.value = "";
}
function togglePassword(){

    const passInput =
        document.getElementById("loginPass");

    if(passInput.type === "password"){

        passInput.type = "text";

    } else {

        passInput.type = "password";
    }
}
/* ENTER PRESS IN LOGIN */
[loginUserInput, loginPassInput].forEach(input => {

    input.addEventListener("keypress", function(e) {

        if (e.key === "Enter") {
            handleLogin();
        }
    });
});

/* LOGIN BUTTON */
loginBtn.addEventListener("click", handleLogin);

/* MODALS */
function openAddModal() {
    document.getElementById("addModal").style.display = "flex";
}

function closeAddModal() {
    document.getElementById("addModal").style.display = "none";
}

function openSearchModal() {
    document.getElementById("searchModal").style.display = "flex";
}

function closeSearchModal() {
    document.getElementById("searchModal").style.display = "none";
}

/* ADD STUDENT */
const nameInput = document.getElementById("name");
const idInput = document.getElementById("id");
const cgpaInput = document.getElementById("cgpa");

[nameInput, idInput, cgpaInput].forEach(input => {

    input.addEventListener("keypress", function(e) {

        if (e.key === "Enter") {
            addStudent();
        }
    });
});

function addStudent() {

    let name = nameInput.value.trim();
    let id = idInput.value.trim();
    let cgpa = cgpaInput.value.trim();

    /* VALIDATION */
    const cgpaPattern = /^(?:[1-4]\.\d{2}|5\.00)$/;

    if (!name || !id || !cgpa) {

        showToast("Fill all fields!", "error");
        return;
    }

    if (!cgpaPattern.test(cgpa)) {

        showToast("CGPA must be like 1.00 - 5.00", "error");
        return;
    }

    students.push({
        name,
        id,
        cgpa
    });

    showToast("Student added!", "success");

    closeAddModal();

    nameInput.value = "";
    idInput.value = "";
    cgpaInput.value = "";
}

/* SHOW STUDENTS */
function showStudents() {

    if (students.length === 0) {

        showToast("No students found!", "info");

        document.getElementById("output").innerHTML =
            "<p>No data found.</p>";

        return;
    }

    let html =
        "<table><tr><th>Name</th><th>ID</th><th>CGPA</th></tr>";

    students.forEach(s => {

        html += `
        <tr>
            <td>${s.name}</td>
            <td>${s.id}</td>
            <td>${s.cgpa}</td>
        </tr>
        `;
    });

    html += "</table>";

    document.getElementById("output").innerHTML = html;

    showToast("Students displayed!", "info");
}

/* SEARCH STUDENT */
const searchIDInput = document.getElementById("searchID");

searchIDInput.addEventListener("keypress", function(e) {

    if (e.key === "Enter") {
        searchStudent();
    }
});

function searchStudent() {

    let search = searchIDInput.value.trim();

    if (!search) {

        showToast("Enter Name or ID!", "error");
        return;
    }

    let result = students.filter(s =>

        s.name.toLowerCase().includes(search.toLowerCase()) ||

        s.id.includes(search)
    );

    if (result.length === 0) {

        document.getElementById("output").innerHTML =
            "<p>No match found.</p>";

        showToast("No match found!", "info");

        return;
    }

    let html =
        "<table><tr><th>Name</th><th>ID</th><th>CGPA</th></tr>";

    result.forEach(s => {

        html += `
        <tr>
            <td>${s.name}</td>
            <td>${s.id}</td>
            <td>${s.cgpa}</td>
        </tr>
        `;
    });

    html += "</table>";

    document.getElementById("output").innerHTML = html;

    showToast(result.length + " student(s) found", "success");

    closeSearchModal();
}

/* SORT STUDENTS */
function sortStudents() {

    if (students.length === 0) {

        showToast("No students to sort!", "info");
        return;
    }

    students.sort((a, b) => parseFloat(b.cgpa) - parseFloat(a.cgpa));

    showStudents();

    showToast("Students sorted by CGPA!", "success");
}

/* SAVE / LOAD */
function saveToStorage() {

    if (students.length === 0) {

        showToast("No data to save!", "info");
        return;
    }

    localStorage.setItem(
        "studentsData",
        JSON.stringify(students)
    );

    showToast("Data saved to browser!", "success");
}

function loadFromStorage() {

    let data = localStorage.getItem("studentsData");

    if (data) {

        students = JSON.parse(data);

        showStudents();

        showToast("Data loaded from browser!", "success");

    } else {

        showToast("No saved data found!", "info");
    }
}

/* DELETE ALL */
function deleteAll() {

    if (students.length === 0) {

        showToast("No students to delete!", "info");
        return;
    }

    const confirm1 = document.createElement("div");

    confirm1.className = "modal";

    confirm1.innerHTML = `
        <div class="modal-content">
            <h3>Are you sure you want to DELETE ALL?</h3>

            <button id="delConfirm1">Yes</button>

            <button id="delCancel1">Cancel</button>
        </div>
    `;

    document.body.appendChild(confirm1);

    confirm1.style.display = "flex";

    confirm1.querySelector("#delConfirm1").onclick = function() {

        confirm1.remove();

        const confirm2 = document.createElement("div");

        confirm2.className = "modal";

        confirm2.innerHTML = `
            <div class="modal-content">
                <h3>This action cannot be undone. Continue?</h3>

                <button id="delConfirm2">Yes</button>

                <button id="delCancel2">Cancel</button>
            </div>
        `;

        document.body.appendChild(confirm2);

        confirm2.style.display = "flex";

        confirm2.querySelector("#delConfirm2").onclick = function() {

            confirm2.remove();

            const passModal = document.createElement("div");

            passModal.className = "modal";

            passModal.innerHTML = `
                <div class="modal-content">
                    <h3>Enter Delete Password:</h3>

                    <input type="password" id="deletePass" placeholder="Password">

                    <div class="modal-buttons">
                        <button id="delSubmit">Submit</button>
                        <button id="delCancel3">Cancel</button>
                    </div>
                </div>
            `;

            document.body.appendChild(passModal);

            passModal.style.display = "flex";

            const passInput =
                passModal.querySelector("#deletePass");

            passInput.focus();

            passInput.addEventListener("keypress", function(e) {

                if (e.key === "Enter") {

                    passModal.querySelector("#delSubmit").click();
                }
            });

            passModal.querySelector("#delSubmit").onclick = function() {

                const val = passInput.value;

                if (val === "0909") {

                    students = [];

                    localStorage.removeItem("studentsData");

                    document.getElementById("output").innerHTML = "";

                    showToast("All students deleted!", "success");

                } else {

                    showToast(
                        "Wrong password! Delete canceled.",
                        "error"
                    );
                }

                passModal.remove();
            }

            passModal.querySelector("#delCancel3").onclick = function() {

                passModal.remove();
            }
        }

        confirm2.querySelector("#delCancel2").onclick = function() {

            confirm2.remove();
        }
    }

    confirm1.querySelector("#delCancel1").onclick = function() {

        confirm1.remove();
    }
}
