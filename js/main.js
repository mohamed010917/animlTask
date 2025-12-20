  tailwind.config = {
    darkMode: 'class'
  }

const allStudents = async function () {
    let res = await fetch("http://localhost:3000/students");
    let data = await res.json();

    return data;
}

const allTeachers = async function () {
    let res = await fetch("http://localhost:3000/teachers");
    let data = await res.json();
 
    return data;
}



const allExams = async function () {
    let res = await fetch("http://localhost:3000/exams");
    let data = await res.json();
    console.log(data);
    return data;
}

 const darkModeToggle = document.getElementById("darkModeToggle");

function applyTheme(theme) {
    if (theme === "dark") {
        document.documentElement.classList.add("dark"); // html
    } else {
        document.documentElement.classList.remove("dark");
    }
}


// تحميل الثيم المحفوظ
const savedTheme = localStorage.getItem("theme") || "light";
applyTheme(savedTheme);

function toggleTheme() {
    console.log("Toggle theme called");
    const current = localStorage.getItem("theme");
    const newTheme = current === "light" ? "dark" : "light";
    localStorage.setItem("theme", newTheme);
    applyTheme(newTheme);
}
    
if(darkModeToggle){

    darkModeToggle.addEventListener("click", toggleTheme);
}



const Logout = document.getElementById("Logout");

if(Logout){

    Logout.addEventListener("click", function() {
       localStorage.removeItem("student");
       localStorage.removeItem("teacher");
       localStorage.removeItem("isLogedIn")
        window.location.href = "index.html";
    });
}


export {allStudents , allTeachers , allExams};