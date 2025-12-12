import { allStudents } from './main.js';
import {allTeachers} from './main.js';

let buttonLogin=document.querySelector('button');
const form = document.querySelector('form');
form.onsubmit = function(e)
{
 e.preventDefault();
let userNameInput=document.getElementById('inputName').value;
let passwordInput=document.getElementById('inputPassword').value;

let studentFound= allStudents.find((e)=>e.name==userNameInput && e.password==passwordInput)
console.log(studentFound);
    if(studentFound)
        {
            localStorage.setItem("currentUser",JSON.stringify(studentFound));
            window.location.href="studentProfile.html";
            return;
        }

let teacherFound=allTeachers.find((t)=>t.name==userNameInput && t.password==passwordInput)
if(teacherFound)
    {
        localStorage.setItem("currentUser", JSON.stringify(teacherFound));
        window.location.href="teacher.html";
        return;
    }
alert("Invalid username or password");
}