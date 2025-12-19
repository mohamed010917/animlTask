class Exam{
    constructor(name="", duration=60 ,techer=null){
        this.name = name;
        this.duration = duration;
        this.questions = [];
        this.students = [];
        this.techer = techer;
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
    }
}


export {Exam , Question}


