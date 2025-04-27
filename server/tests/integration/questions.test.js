const app = require("../../app");
const mongoose = require("mongoose");
const request = require("supertest");
const { User } = require("../../models/user");
const { Question } = require("../../models/questions");
const { MongoMemoryServer } = require("mongodb-memory-server");
const { describe, beforeAll, afterAll, beforeEach, afterEach, it, expect } = require("@jest/globals");

let mongoServer;

let studentId;
let teacherId;
let answerId;
let questionId;

let mockUser = { _id: new mongoose.Types.ObjectId(), role: "Uczeń" };

jest.mock("../../middleware/tokenVerification", () => {
    return (req, res, next) => {
        req.user = mockUser;
        next();
    };
});

beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();

    await mongoose.connect(uri);

    const newStudent = new User({
        firstName: "Jan",
        lastName: "Kowalski",
        role: "Uczeń",
        phoneNumber: "123123123",
        email: "student@gmail.com",
        password: "Student!123",
    });

    const savedStudent = await newStudent.save();
    studentId = savedStudent._id;

    const newTeacher = new User({
        firstName: "Anna",
        lastName: "Nowak",
        role: "Nauczyciel",
        phoneNumber: "321321321",
        email: "teacher@gmail.com",
        password: "Teacher!123",
    });

    const savedTeacher = await newTeacher.save();
    teacherId = savedTeacher._id;
    mockUser = { _id: studentId.toString(), role: "Uczeń" };
});

afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    await mongoServer.stop();
});

beforeEach(async () => {
});

afterEach(async () => {
    const collections = mongoose.connection.collections;
    for (const key in collections) {
        const collection = collections[key];
        await collection.deleteMany({});
    }

    const newStudent = new User({
        _id: studentId,
        firstName: "Jan",
        lastName: "Kowalski",
        role: "Uczeń",
        phoneNumber: "123123123",
        email: "student@gmail.com",
        password: "Student!123",
    });
    await newStudent.save();

    const newTeacher = new User({
        _id: teacherId,
        firstName: "Anna",
        lastName: "Nowak",
        role: "Nauczyciel",
        phoneNumber: "321321321",
        email: "teacher@gmail.com",
        password: "Teacher!123",
    });
    await newTeacher.save();

    mockUser = { _id: studentId.toString(), role: "Uczeń" };
});

describe("POST /api/questions", () => {
    it("Powinno dodać pytanie", async () => {
        const res = await request(app).post(`/api/questions/`).send({
            title: "Tytul matematyka",
            subject: "Matematyka",
            description: "Test matematyki opis",
        });

        expect(res.status).toBe(201);
        expect(res.body.title).toBe("Tytul matematyka");
        expect(res.body.description).toBe("Test matematyki opis");
        expect(res.body.subject).toBe("Matematyka");
        expect(res.body.student).toBe(studentId.toString());
        questionId = res.body._id;
        expect(questionId).toBeDefined();
    });

    it("Powinno dodać odpowiedź do pytania", async () => {
        const questionRes = await request(app).post(`/api/questions/`).send({
            title: "Tytul matematyka",
            subject: "Matematyka",
            description: "Test matematyki opis",
        });
        expect(questionRes.status).toBe(201);
        questionId = questionRes.body._id;

        mockUser = { _id: teacherId.toString(), role: "Nauczyciel" };

        const res = await request(app)
            .post(`/api/questions/${questionId}/answers`)
            .send({
                comment: "Test komentarza",
            });

        expect(res.status).toBe(201);
        expect(res.body.answer).toBeDefined();
        expect(res.body.answer.comment).toBe("Test komentarza");
        expect(res.body.answer.teacher).toBe(teacherId.toString());

        const rs = await request(app).get(`/api/questions/${questionId}/answers`);

        expect(rs.status).toBe(200);
        expect(rs.body.answers).toBeDefined();
        expect(Array.isArray(rs.body.answers)).toBe(true);
        expect(rs.body.answers.length).toBeGreaterThan(0);

        answerId = rs.body.answers[0]._id;
        expect(answerId).toBeDefined();
    });
});

describe("GET /api/questions", () => {
    it("Powinno zwrócić wszystkie pytania", async () => {
        const questionRes = await request(app).post(`/api/questions/`).send({
            title: "Tytul matematyka",
            subject: "Matematyka",
            description: "Test matematyki opis",
        });
        expect(questionRes.status).toBe(201);

        const res = await request(app).get("/api/questions");

        console.log(res.body.questions);
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body.questions)).toBe(true);
        expect(res.body.questions.length).toBe(1);
    });

    it("Powinno zwrócić wszystkie odpowiedzi do pytania", async () => {
        const questionRes = await request(app).post(`/api/questions/`).send({
            title: "Tytul matematyka",
            subject: "Matematyka",
            description: "Test matematyki opis",
        });
        expect(questionRes.status).toBe(201);
        questionId = questionRes.body._id;

        mockUser = { _id: teacherId.toString(), role: "Nauczyciel" };

        const answerRes = await request(app)
            .post(`/api/questions/${questionId}/answers`)
            .send({
                comment: "Test komentarza",
            });
        expect(answerRes.status).toBe(201);

        const res = await request(app).get(`/api/questions/${questionId}/answers`);
        expect(res.status).toBe(200);
        expect(res.body.answers).toBeDefined();
        expect(Array.isArray(res.body.answers)).toBe(true);
        expect(res.body.answers.length).toBe(1);
    });
});

describe("PUT /api/questions", () => {
    it("Powinno edytować odpowiedź do pytania", async () => {
        const questionRes = await request(app).post(`/api/questions/`).send({
            title: "Tytul matematyka",
            subject: "Matematyka",
            description: "Test matematyki opis",
        });
        expect(questionRes.status).toBe(201);
        questionId = questionRes.body._id;

        mockUser = { _id: teacherId.toString(), role: "Nauczyciel" };

        const answerRes = await request(app)
            .post(`/api/questions/${questionId}/answers`)
            .send({
                comment: "Test komentarza",
            });

        expect(answerRes.status).toBe(201);

        const getAnswersRes = await request(app).get(`/api/questions/${questionId}/answers`);
        expect(getAnswersRes.status).toBe(200);
        expect(getAnswersRes.body.answers).toBeDefined();
        expect(Array.isArray(getAnswersRes.body.answers)).toBe(true);
        expect(getAnswersRes.body.answers.length).toBe(1);
        answerId = getAnswersRes.body.answers[0]._id;
        expect(answerId).toBeDefined();

        console.log("Answer ID for update:", answerId);

        const res = await request(app)
            .put(`/api/questions/${questionId}/answers/${answerId}`)
            .send({
                comment: "Edytowana odpowiedź",
            });

        expect(res.status).toBe(200);
        expect(res.body.answer).toBeDefined();
        expect(res.body.answer.comment).toBe("Edytowana odpowiedź");
    });

    it("Powinno edytować pytanie", async () => {
        const questionRes = await request(app).post(`/api/questions/`).send({
            title: "Tytul matematyka",
            subject: "Matematyka",
            description: "Test matematyki opis",
        });
        expect(questionRes.status).toBe(201);
        questionId = questionRes.body._id;

        mockUser = { _id: studentId.toString(), role: "Uczeń" };

        const res = await request(app).put(`/api/questions/${questionId}`).send({
            title: "Matematyka",
            subject: "Matematyka",
            description: "Test matematyki opis 2",
        });

        console.log(res.body);
        expect(res.status).toBe(201);
        expect(res.body.title).toBe("Matematyka");
        expect(res.body.description).toBe("Test matematyki opis 2");
    });
});

describe("DELETE /api/questions", () => {
    it("Powinno usunąć odpowiedź do pytania", async () => {
        const questionRes = await request(app).post(`/api/questions/`).send({
            title: "Tytul matematyka",
            subject: "Matematyka",
            description: "Test matematyki opis",
        });
        expect(questionRes.status).toBe(201);
        questionId = questionRes.body._id;

        mockUser = { _id: teacherId.toString(), role: "Nauczyciel" };

        const answerRes = await request(app)
            .post(`/api/questions/${questionId}/answers`)
            .send({
                comment: "Test komentarza",
            });
        expect(answerRes.status).toBe(201);

        const getAnswersRes = await request(app).get(`/api/questions/${questionId}/answers`);
        expect(getAnswersRes.status).toBe(200);
        expect(getAnswersRes.body.answers).toBeDefined();
        expect(Array.isArray(getAnswersRes.body.answers)).toBe(true);
        expect(getAnswersRes.body.answers.length).toBe(1);
        answerId = getAnswersRes.body.answers[0]._id;
        expect(answerId).toBeDefined();

        console.log("Answer ID for deletion:", answerId);

        const res = await request(app).delete(
            `/api/questions/${questionId}/answers/${answerId}`
        );
        expect(res.status).toBe(200);
        expect(res.body.message).toBe("Odpowiedź została usunięta");
    });

    it("Powinno usunąć pytanie", async () => {
        const questionRes = await request(app).post(`/api/questions/`).send({
            title: "Tytul matematyka",
            subject: "Matematyka",
            description: "Test matematyki opis",
        });
        expect(questionRes.status).toBe(201);
        questionId = questionRes.body._id;

        mockUser = { _id: studentId.toString(), role: "Uczeń" };

        const res = await request(app).delete(`/api/questions/${questionId}`);
        expect(res.status).toBe(201);
        expect(res.body.message).toBe("Pytanie zostało usunięte");
    });
});
