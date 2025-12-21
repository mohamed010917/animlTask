class Exam{
    constructor(name="", duration=60 ,techer=null){
        this.name = name;
        this.duration = duration;
        this.questions = [];
        this.students = [];
        this.teacherId = JSON.parse( localStorage.getItem("teacher")).id;
        this.id = Date.now().toString(36).slice(-4) +
                Math.random().toString(36).slice(2, 4);

    }
}

class Question{
    constructor(text, choices, correctAnswer , score , img , difficulty , examId){
        this.text = text;
        this.choices = choices;
        this.correctAnswer = correctAnswer;
        this.score = score;
        this.imgUrl = img ;
        this.difficulty = difficulty ;
        this.examId = examId ;
         this.id = Date.now().toString(36).slice(-4) +
                Math.random().toString(36).slice(2, 4);
    }
}


export {Exam , Question}


