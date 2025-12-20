//dom
let QuestionNumber=document.querySelector("h2");
let QuestionText=document.querySelector("h1");
let ButtonChoice1=document.querySelectorAll("button")[0];
let ButtonChoice2=document.querySelectorAll("button")[1];
let ButtonChoice3=document.querySelectorAll("button")[2];
let ButtonChoice4=document.querySelectorAll("button")[3];
let ButtonNext=document.querySelectorAll("button")[4];
let ButtonSubmit=document.querySelectorAll("button")[5];
let ImgOfQuestion=document.querySelector("img");
let Btns=[ButtonChoice1,ButtonChoice2,ButtonChoice3,ButtonChoice4];

const UrlPage=new URLSearchParams(window.location.search);
const idExam=UrlPage.get("id");
const idStudent=UrlPage.get("studentId");
let currentExam;
let currentIndex=parseInt(localStorage.getItem('currentItem')||0);
let score=parseInt(localStorage.getItem('score')||0);;
let questions=[];
let answers=JSON.parse(localStorage.getItem('studentAnswers'))||[];
let flag=true;
console.log(questions);
let newArrayOfQuestions=[];
if(!idExam)
    {
        window.location.href="studentProfile.html";
    }

//get the exam from json server
async function getExam(Id)
{
try{
let responseExam=await fetch(`http://localhost:3000/exams/${Id}`);
if(responseExam.ok)
    {
currentExam=await responseExam.json();
timer.innerText =`${currentExam.duration}:00`;
startTimer(currentExam.duration);
    }
    else
        {
            return;
        }
}
catch(e)
{
console.log("there is no exam",e);
}
}




//بستدعي الامتحان نفسه واتاكد انه موجود ولا لا
async function loadQuestionsOfExam()
{
    try
    {
    let QuestionsOfExam=localStorage.getItem('savedQuestions');
    if(QuestionsOfExam)
        {
        newArrayOfQuestions=JSON.parse(QuestionsOfExam);
        displayQuestions(newArrayOfQuestions);
        }else
            {
            const response1=await fetch(`http://localhost:3000/questions?examId=${idExam}`);
            if (!response1.ok)
            throw new Error("there is no exam with this id");
            questions=await response1.json();
            if(questions.length===0)
                {
                    console.log("there is no questions in exam");
                    return;
                }
            newArrayOfQuestions=randomQuestions(questions);
            localStorage.setItem('savedQuestions',JSON.stringify(newArrayOfQuestions));
            displayQuestions(newArrayOfQuestions);//بستدعي فانكيشن 
            }
    }catch(e)
{
console.log("the error is:",e);
}
}


//random of array
function randomQuestions(array)
{
    let newArray=[...array];
    for(let i=array.length-1;i>0;i--)
        {
            const j=Math.floor(Math.random()*(i+1));
            let temp=newArray[i];
            newArray[i]=newArray[j];
            newArray[j]=temp;
        }
        return newArray;
}


//show of questions
function displayQuestions(array)
{
    let currentQuestion=array[currentIndex];
    QuestionText.innerText=`${currentIndex+1}. ${currentQuestion.text}`;
    ImgOfQuestion.src=currentQuestion.imgUrl;

    if (currentIndex === array.length - 1) {
        ButtonNext.classList.add("hidden");
        ButtonSubmit.classList.remove("hidden");
    } else {
        ButtonNext.classList.remove("hidden");
        ButtonSubmit.classList.add("hidden");
    }
    
    let AnswersOfQuestion=randomAnswers(currentQuestion);
    
    Btns.forEach((Btn,index)=> {
        Btns.forEach(b=>b.disabled=false);
        Btn.style.background="";
        Btn.innerText=AnswersOfQuestion[index].text;
        Btn.onclick=function()
        {
            let rightAnswer=checkAnswer(AnswersOfQuestion[index].key,currentQuestion);
            if(rightAnswer)
                {
                    score=score+currentQuestion.score;
                    localStorage.setItem('score',score);
                    flag=false;
                    Btn.style.background ="green";
                }
            else
                {
                    Btn.style.background ="red";
                    flag=false;
                }
              answers.push(AnswersOfQuestion[index].key);
              localStorage.setItem('studentAnswers',JSON.stringify(answers));
              Btns.forEach(b=>b.disabled=true);  
        }
    });
}

function checkAnswer(answer,question)
{
    return answer===question.correctAnswer;
}

//random of answers
function randomAnswers(answers)
{
let newArrangeOfAnswers=
[
    {key:'a' , text:answers.choices.a},
    {key:'b' , text:answers.choices.b},
    {key:'c' , text:answers.choices.c},
    {key:'d' , text:answers.choices.d}
]
for(let i=newArrangeOfAnswers.length-1;i>0;i--)
    {
        const j=Math.floor(Math.random()*(i+1))
        let temp=newArrangeOfAnswers[i];
        newArrangeOfAnswers[i]=newArrangeOfAnswers[j];
        newArrangeOfAnswers[j]=temp;
    }
    return newArrangeOfAnswers;
}



ButtonNext.addEventListener('click',function()
{
    if(flag===true)
        {
            return;
        }
    currentIndex++;
    localStorage.setItem('currentItem',currentIndex);
    localStorage.setItem('score',score);
    if(currentIndex<newArrayOfQuestions.length)
    {
        flag=true;
        displayQuestions(newArrayOfQuestions);
    }
});

getExam(idExam);
loadQuestionsOfExam();

let timeOut;
function startTimer(minutes)
{
   let seconds=minutes*60;
   let timer=document.getElementById("timer"); 
   timeOut=setInterval(()=>
    {
        timer.innerText=Math.floor(seconds/60)+ ":" +(seconds%60);
        if(seconds<=0)
            {
                submitExam();
            }
            seconds--;
    },1000)
}


async function submitExam()
{
    ButtonNext.classList.add("hidden");
    ButtonSubmit.classList.remove("hidden");
    ButtonSubmit.onclick=function()
    {
        window.location.href="studentProfile.html";
    }
    Btns.forEach((b)=>
        {
            b.disabled=true;
        })
        submitData();
}

ButtonSubmit.addEventListener('click', submitData);
async function submitData()
{
const now=new Date();
try{
let response=await fetch('http://localhost:3000/result',
                {
                method:'POST',
                headers:{'content-type':'application/json'},
                body:JSON.stringify(
                    {
                        "examId":idExam,
                        "studentId":idStudent,
                        "score":JSON.parse(localStorage.getItem('score')),
                        "answers":JSON.parse(localStorage.getItem('studentAnswers')),
                        "finishedAt":now.toISOString()
                    }
                )
                })
             localStorage.clear();
            window.location.href="studentProfile.html";
            if (response.ok) {
            // تنظيف بيانات الامتحان فقط وليس كل الـ LocalStorage
            localStorage.removeItem('savedQuestions');
            localStorage.removeItem('currentItem');
            localStorage.removeItem('score');
            localStorage.removeItem('studentAnswers');
            window.location.href = "studentProfile.html";
        }
}catch(e)
{
console.log("the error is:",e);
}
            
}