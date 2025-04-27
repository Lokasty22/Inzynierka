const mongoose = require('mongoose');
const {
  Question,
  validateQuestion,
  validateAnswer,
  validateAnswerEdit,
} = require("../models/questions");
const { User } = require("../models/user");
exports.createQuestion = async (req, res) => {
  try {
    const { error } = validateQuestion(req.body);

    const userID = await User.findById(req.user._id);

    if(userID.role !== 'Uczeń'){
      return res.status(403).json({message: 'Nie masz uprawnień do dodania pytania.'});
    }
    
    if (error) {
      return res.status(400).send({ message: error.details[0].message });
    }

    const newQuestion = new Question({
      ...req.body,
      student: req.user._id,
    });

    await newQuestion.save();

    res.status(201).json(newQuestion);
  } catch (error) {
    console.error("Błąd podczas tworzenia pytania.", error);
    res.status(500).json({ message: "Błąd serwera" });
  }
};

exports.editQuestion = async (req, res) => {
  try {
    const { error } = validateQuestion(req.body);
    const foundQuestion = await Question.findById(req.params.id);

    if (error) {
      return res.status(400).send({ error: error.details[0].message });
    }
    

    if (foundQuestion.student.toString() != req.user._id) {
      return res
        .status(403)
        .send({ message: "Nie masz uprawnień do edycji pytania." });
    }

    const updatedQuestion = {
      ...req.body,
      student: req.user._id,
    };

    Object.assign(foundQuestion, updatedQuestion);

    await foundQuestion.save(updatedQuestion);

    res.status(201).json(foundQuestion);
  } catch (error) {
    console.error("Błąd podczas edycji pytania.", error);
    res.status(500).json({ message: "Błąd serwera" });
  }
};

exports.deleteQuestion = async (req, res) => {
  try {
    const foundQuestion = await Question.findByIdAndDelete(
      req.params.id
    );

    if (!foundQuestion) {
      return res
        .status(404)
        .json({ message: "Pytanie nie zostało znalezione" });
    }

    if(foundQuestion.student.toString() != req.user._id){
        return res.status(403).json({message: 'Nie masz uprawnień do usunięcia pytania.'});
    }
    res.status(201).json({ message: "Pytanie zostało usunięte" });
  } catch (error) {
    console.error("Błąd podczas usuwania pytania.", error);
    res.status(500).json({ message: "Błąd serwera" });
  }
};

exports.getQuestions = async (req, res) => {
  try {
    const questions = await Question.find().populate("student", 'firstName lastName profilePicture state city');

    res.status(200).json({ questions, message: "Pobrano wszystkie pytania" });
  } catch (error) {
    console.error("Błąd podczas pobierania pytań.", error);
    res.status(500).json({ message: "Błąd serwera." });
  }
};

exports.getUserQuestionById = async (req, res) => {
    try{

      const question = await Question.findById(req.params.id).populate('comment.teacher', 'firstName lastName profilePicture')
      .populate('student', 'firstName lastName profilePicture');


      if(!question){
        return res.status(404).json({message: 'Nie znaleziono pytania'});
      }


      res.json({question});
    } catch (error){
      console.error('Błąd podczas pobierania pytania', error);
      res.status(500).json({message: 'Błąd serwera.'});
    }

};

exports.getAnswers = async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);
    const answers = question.comment;
    if (!question) {
      return res
        .status(404)
        .json({ message: "Pytanie nie zostało znalezione." });
    }


    if (!answers) {
      return res
        .status(404)
        .json({ message: "Odpowiedzi nie zostały znalezione" });
    }

    res.status(200).json({ answers, message: "Pobrano wszystkie odpowiedzi" });
  } catch (error) {
    console.error("Błąd podczas pobierania odpowiedzi");
    res.status(500).json({ message: "Błąd serwera" });
  }
};

exports.addAnswer = async (req, res) => {
  try {
    const { comment } = req.body;

    const { error } = validateAnswerEdit(req.body); 
    if (error) {
      return res.status(400).send({ error: error.details[0].message });
    }

    const foundQuestion = await Question.findById(req.params.id);
    if (!foundQuestion) {
      return res.status(404).send({ message: "Pytanie nie zostało znalezione." });
    }

    const teacherId = req.user._id;
    const teacherData = await User.findById(teacherId);
    if (!teacherData) {
      return res.status(404).json({ message: "Nie istnieje taka osoba!" });
    }

    if (teacherData.role !== "Nauczyciel") {
      return res.status(403).send({ message: "Nie masz odpowiednich uprawnień." });
    }

    const savedAnswer = {
      teacher: teacherData._id,
      comment: comment,
    };

    foundQuestion.comment.push(savedAnswer);

    await foundQuestion.save();

    res.status(201).send({ message: "Odpowiedź dodana", answer: savedAnswer });
  } catch (error) {
    console.error("Błąd podczas dodawania odpowiedzi", error);
    res.status(500).json({ message: "Błąd serwera" });
  }
};


exports.editAnswer = async (req, res) => {
  try {
    const { id, answerId } = req.params;
    const { comment } = req.body;

    const { error } = validateAnswerEdit({ comment });
    if (error) {
      console.log("Validation Error:", error.details[0].message);
      return res.status(400).send({ message: error.details[0].message });
    }

    const foundQuestion = await Question.findById(id).populate('comment.teacher');
    if (!foundQuestion) {
      console.log("Nie znaleziono pytania o podanym ID.");
      return res.status(404).send({ message: "Nie znaleziono pytania" });
    }

    console.log(`Znaleziono pytanie: ${foundQuestion._id}`);
    console.log(`Odpowiedzi w pytaniu: ${foundQuestion.comment.map(a => a._id.toString())}`);

    const answer = foundQuestion.comment.id(answerId);
    if (!answer) {
      console.log("Nie znaleziono odpowiedzi o podanym ID.");
      return res.status(404).send({ message: "Nie znaleziono odpowiedzi" });
    }

    console.log(`Znaleziono odpowiedź: ${answer._id}`);
    console.log(`Odpowiedź należy do nauczyciela: ${answer.teacher._id.toString()}`);

    console.log(`ID użytkownika próbującego edytować odpowiedź: ${req.user._id}`);
    console.log(`ID właściciela odpowiedzi: ${answer.teacher._id.toString()}`);

    if (answer.teacher._id.toString() !== req.user._id.toString()) {
      console.log("Użytkownik nie ma uprawnień do edycji tej odpowiedzi.");
      return res.status(403).send({ message: "Brak uprawnień do edycji odpowiedzi" });
    }

    answer.comment = comment;
    answer.updatedAt = Date.now();

    await foundQuestion.save();

    console.log("Odpowiedź została zaktualizowana.");
    return res.status(200).send({ answer: answer, message: "Odpowiedź zaktualizowana." });
  } catch (error) {
    console.error("Błąd podczas edycji odpowiedzi.", error);

    if (res.headersSent) {
      return;
    }

    return res.status(500).json({ message: "Błąd serwera" });
  }
};




exports.deleteAnswer = async (req, res) => {
  try {
    const { id, answerId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).send({ message: "Nieprawidłowe ID pytania" });
    }

    if (!mongoose.Types.ObjectId.isValid(answerId)) {
      return res.status(400).send({ message: "Nieprawidłowe ID odpowiedzi" });
    }

    console.log(`Usuwanie odpowiedzi. ID pytania: ${id}, ID odpowiedzi: ${answerId}`);

    const foundQuestion = await Question.findById(id).populate('comment.teacher');
    if (!foundQuestion) {
      console.log("Nie znaleziono pytania o podanym ID.");
      return res.status(404).send({ message: "Nie znaleziono pytania" });
    }

    console.log(`Znaleziono pytanie: ${foundQuestion._id}`);
    console.log(`Odpowiedzi w pytaniu: ${foundQuestion.comment.map(a => a._id.toString())}`);

    const answer = foundQuestion.comment.id(answerId);
    if (!answer) {
      console.log("Nie znaleziono odpowiedzi o podanym ID.");
      return res.status(404).send({ message: "Nie znaleziono odpowiedzi" });
    }

    console.log(`Znaleziono odpowiedź: ${answer._id}`);
    console.log(`Odpowiedź należy do nauczyciela: ${answer.teacher._id.toString()}`);

    console.log(`ID użytkownika próbującego usunąć odpowiedź: ${req.user._id}`);
    console.log(`ID właściciela odpowiedzi: ${answer.teacher._id.toString()}`);

    if (answer.teacher._id.toString() !== req.user._id.toString()) {
      console.log("Użytkownik nie ma uprawnień do usunięcia tej odpowiedzi.");
      return res.status(403).send({ message: "Brak uprawnień do usunięcia odpowiedzi" });
    }

    foundQuestion.comment.pull(answer);

    await foundQuestion.save();

    console.log("Odpowiedź została usunięta.");
    return res.status(200).send({ message: "Odpowiedź została usunięta" });
  } catch (error) {
    console.error("Błąd podczas usuwania odpowiedzi:", error);

    if (res.headersSent) {
      return;
    }

    return res.status(500).json({ message: "Błąd serwera" });
  }
};