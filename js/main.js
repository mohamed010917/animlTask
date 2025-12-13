  tailwind.config = {
    darkMode: 'class'
  }


const allStudents = localStorage.getItem("allStudents") ? 
JSON.parse(localStorage.getItem("allStudents")) : [];


const allTeachers = localStorage.getItem("allTeachers") ? 
JSON.parse(localStorage.getItem("allTeachers")) : [];


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
       localStorage.removeItem("isLogedIn")
        window.location.href = "index.html";
    });
}


export {allStudents , allTeachers};

