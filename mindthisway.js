let username = "";

window.onload = function () {
    // Auto-login if user is saved
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
        username = savedUser;
        document.getElementById("login-section").classList.add("hidden");
        document.getElementById("dashboard").classList.remove("hidden");
        document.getElementById("displayName").innerText = savedUser;
    }
};

function login() {
    const name = document.getElementById("username").value.trim();
    if (name) {
        username = name;
        localStorage.setItem("user", name);
        fadeOutIn("login-section", "dashboard");
        document.getElementById("displayName").innerText = name;
    }
}

function logout() {
    localStorage.removeItem("user");
    location.reload();
}

function checkMood() {
    const mood = prompt("How are you feeling today?");
    if (mood) {
        const moods = JSON.parse(localStorage.getItem("moods") || "[]");
        moods.push({ mood, date: new Date().toLocaleString() });
        localStorage.setItem("moods", JSON.stringify(moods));
        alert("📝 Mood saved: " + mood + ". Keep taking care of yourself.");
    }
}

function viewMoodHistory() {
    const moodList = document.getElementById("moodList");
    moodList.innerHTML = "";
    const moods = JSON.parse(localStorage.getItem("moods") || "[]");
    moods.forEach(entry => {
        const li = document.createElement("li");
        li.textContent = `🕒 ${entry.date}: 😌 ${entry.mood}`;
        moodList.appendChild(li);
    });
    document.getElementById("moodHistory").classList.toggle("hidden");
}

function openJournal() {
    document.getElementById("journal").classList.toggle("hidden");
    loadJournal();
}

function saveJournal() {
    const entry = document.getElementById("journalEntry").value.trim();
    if (entry) {
        const journals = JSON.parse(localStorage.getItem("journals") || "[]");
        journals.push({ entry, date: new Date().toLocaleString() });
        localStorage.setItem("journals", JSON.stringify(journals));
        document.getElementById("journalEntry").value = "";
        loadJournal();
    }
}

function loadJournal() {
    const list = document.getElementById("journalList");
    list.innerHTML = "";
    const journals = JSON.parse(localStorage.getItem("journals") || "[]");
    journals.forEach(j => {
        const p = document.createElement("p");
        p.innerHTML = `📔 <strong>${j.date}</strong>: ${j.entry}`;
        list.appendChild(p);
    });
}

function openChatbot() {
    const chatbot = document.getElementById("chatbot");
    chatbot.classList.toggle("hidden");
    if (!chatbot.classList.contains("hidden")) {
        document.getElementById("chatOutput").innerHTML = ""; // clear chat on open
    }
}

function chatResponse(feeling) {
    const output = document.getElementById("chatOutput");
    let response = "";
    if (feeling === "stressed") {
        response = "🧘‍♀️ Try taking 3 deep breaths. You're doing your best.";
    } else if (feeling === "anxious") {
        response = "🪴 Let’s ground ourselves. Look around and name 5 things you can see.";
    } else {
        response = "🌟 Glad to hear that. Keep taking care of your mind!";
    }
    const p = document.createElement("p");
    p.textContent = response;
    output.appendChild(p);
    output.scrollTop = output.scrollHeight; // Scroll to latest response
}

// Fade transition helper
function fadeOutIn(hideId, showId) {
    const hide = document.getElementById(hideId);
    const show = document.getElementById(showId);
    hide.style.opacity = 1;
    const fade = setInterval(() => {
        if (hide.style.opacity > 0) {
            hide.style.opacity -= 0.1;
        } else {
            clearInterval(fade);
            hide.classList.add("hidden");
            hide.style.opacity = 1;
            show.classList.remove("hidden");
            show.style.opacity = 0;
            let fadeIn = setInterval(() => {
                if (show.style.opacity < 1) {
                    show.style.opacity = parseFloat(show.style.opacity) + 0.1;
                } else {
                    clearInterval(fadeIn);
                }
            }, 30);
        }
    }, 30);
}
