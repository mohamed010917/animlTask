import { allStudents } from "./main.js";
import Student from "./student.js";
import  ImgUplode from "./imgApi.js";
// if the uesr loged in as student or teacher redirect him to his page



if( ! localStorage.getItem("student") == 'null'){
    location.href = "studentProfile.html";
}
if( ! localStorage.getItem("teacher") == 'null'){
    location.href = "teacher.html";
}
if(localStorage.getItem("isLogedIn") === "true" ){
    localStorage.href = "index.html";
}




const faldtion = function(name , password , mobile , imgurl , grade ,students){
   
    const nameError = document.querySelector(".name");
    const passwordError = document.querySelector(".password");
    const mobileError = document.querySelector(".mobileError");
    const imgurlError = document.querySelector(".imgurl");
    const gradeError = document.querySelector(".grade");
    
    let isValid = true;
    if(name === ""){
        nameError.textContent = "Name is required";
        isValid = false;
        nameError.classList.remove("hidden") ;
    }else if(students.find(s => s.name === name)){
        nameError.textContent = "Name is already taken";
        isValid = false;
         nameError.classList.remove("hidden") ;
    }else if(name.length < 3 || name.length > 20){
        nameError.textContent = "Name must be at least 3 characters long and less than 20 characters";
        isValid = false;
        nameError.classList.remove("hidden") ;
    }

    if(password === ""){
        passwordError.textContent = "Password is required";
        isValid = false;
         passwordError.classList.remove("hidden") ;
    }else  if(password.length < 6){
        passwordError.textContent = "Password must be at least 6 characters long";
        isValid = false;
        passwordError.classList.remove("hidden") ;
    }
    const egyptMobilePattern = /^(010|011|012|015)\d{8}$/;
    if(mobile === ""){
        mobileError.textContent = "Mobile number is required";
        isValid = false;
        mobileError.classList.remove("hidden") ;
    } else if (!egyptMobilePattern.test(mobile)) {
        mobileError.textContent = "Invalid Egyptian mobile number";
        isValid = false;
        mobileError.classList.remove("hidden") ;
    }

    if(imgurl === ""){
        imgurlError.textContent = "Image URL is required";
        isValid = false;
        imgurlError.classList.remove("hidden") ;
    }

    if(grade === ""){
        gradeError.textContent = "Grade is required";
        isValid = false;
        grade.classList.remove("hidden") ;
    } else if (isNaN(grade) || grade < 1 || grade > 12) {
        gradeError.textContent = "Grade must be a number between 1 and 12";
        isValid = false;
         grade.classList.remove("hidden") ;
    }

    if(imgurl === undefined){
        imgurlError.textContent = "Image upload failed";
        isValid = false;
        imgurlError.classList.remove("hidden") ;
    }
    if(!isValid){
        console.log("i am from isvalid" , isValid) ;
        setTimeout(() => {
            nameError.classList.add("hidden") ;
            passwordError.classList.add("hidden") ;
            mobileError.classList.add("hidden") ;
            imgurlError.classList.add("hidden") ;
            gradeError.classList.add("hidden") ;  
            nameError.textContent = "";
            passwordError.textContent = "";
            mobileError.textContent = "";
            imgurlError.textContent = "";
            gradeError.textContent = "";
        }, 5000);
        return isValid ;
    }else{

        return isValid;
    }

}

const rejuster = async function(){
    const students = await allStudents() ;
    const name = document.getElementById("name").value;
    const password = document.getElementById("password").value;
    const mobile = document.getElementById("mobile").value;
    const img = document.getElementById("img");
    const grade = document.getElementById("grade").value;
    let imgUrl = await ImgUplode(img) ;
   


    // if is a user
    if(  faldtion(name , password , mobile , imgUrl , grade , students) ){
        console.log("i am from faldtion") ;
        const student = new Student(name , password ,mobile , imgUrl.display_url , grade , Date.now() );
        fetch("http://localhost:3000/students" , {
            method : "POST",
            headers : {
                "Content-Type" : "application/json"
            },
            body : JSON.stringify(student)
        })
        .then(res => res.json())
        .then(data =>{
            console.log("i am from featch " ,data) ;
            localStorage.setItem("student" , JSON.stringify(data));
            localStorage.setItem("isLogedIn" , "true");
            location.href = "studentProfile.html";
        })
        .catch(err => console.log(err)) ;
   
    }
}


 const Rejuster = document.querySelector("form") ;



 Rejuster.onsubmit = function(e){
    e.preventDefault();
    console.log("i am from onsubmit") ;
    rejuster();
 }
