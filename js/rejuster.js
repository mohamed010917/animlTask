import { allStudents } from "./main.js";
import Student from "./student.js";

const rejuster = function(name , password ,mobile , imgurl , grade ){

    // if the uesr loged in as student or teacher redirect him to his page
    if(localStorage.getItem("student") != null){
        location.href = "student.html";
    }
    if(localStorage.getItem("teacher") != null){
        location.href = "teacher.html";
    }
    // if is a user
    if( allStudents.find(s => s.name === name &&  s.password === password) ){

    }else{
        const student = new Student(name , password ,mobile , imgurl , grade , Date.now());

    }
    
}

