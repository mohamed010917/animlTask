
import {allTeachers , allStudents} from './main.js';




if( ! localStorage.getItem("student") == 'null'){
    location.href = "studentProfile.html";
}
if( ! localStorage.getItem("teacher") == 'null'){
    location.href = "teacher.html";
}
if(localStorage.getItem("isLogedIn") === "true" ){
    localStorage.href = "index.html";
}

// let buttonLogin=document.querySelector('button');
const form = document.querySelector('form');
form.onsubmit =async function(e)
{
    e.preventDefault();
    let userNameInput=document.getElementById('inputName').value;
    let passwordInput=document.getElementById('inputPassword').value;
    const students = await allStudents() || [];
    const teachers = await allTeachers() || [];

    let studentFound= students.find((e)=>e.name==userNameInput && e.password==passwordInput)
    console.log(studentFound);
        if(studentFound)
            {
                localStorage.setItem("student",JSON.stringify(studentFound));
                localStorage.setItem("isLogedIn" , "true");
                window.location.href="studentProfile.html";
                return;
            }

    let teacherFound=teachers.find((t)=>t.name==userNameInput && t.password==passwordInput)
    if(teacherFound)
    {
        localStorage.setItem("teacher", JSON.stringify(teacherFound));
        window.location.href="TecherProfile.html";
        localStorage.setItem("isLogedIn" , "true");
        return;
    }
    let wrongUserName=document.getElementById('wrongUserName');
    let wrongPassword=document.getElementById('wrongPassword');
    if(e.name!==userNameInput||t.name!==userNameInput)
        {
        wrongUserName.classList.remove("hidden");
        setTimeout(()=>
            {
                wrongUserName.classList.add("hidden");
            },5000)
        }
    if(e.password!==passwordInput||t.password!==passwordInput)
        {
        
        wrongPassword.classList.remove("hidden");
         setTimeout(()=>
            {
                wrongPassword.classList.add("hidden");
            },5000)
        }
}