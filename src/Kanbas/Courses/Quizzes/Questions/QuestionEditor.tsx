import { useEffect, useState } from "react";
import { FaPlus, FaTrash, FaPencilAlt } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import * as questionClient from "./client";
import { setQuestions } from "./reducer";

export default function QuestionEditor() {
    const { cid, qid } = useParams();
    const dispatch = useDispatch();
    const { questions } = useSelector((state: any) => state.questionReducer);

    const [editingQuestionId, setEditingQuestionId] = useState<string | null>(null);
    const [editingQuestion, setEditingQuestion] = useState<any>(null);

    const fetchQuestions = async () => {
        if (!qid) return;
        const fetchedQuestions = await questionClient.findQuestionsForQuiz(qid);
        dispatch(setQuestions(fetchedQuestions));
    };

    useEffect(() => {
        fetchQuestions();
    }, [qid, dispatch]);

    const handleEditClick = (question: any) => {
        setEditingQuestionId(question._id);
        setEditingQuestion({ ...question });
    };

    const handleCancelEdit = () => {
        setEditingQuestionId(null);
        setEditingQuestion(null);
    };

    const handleFieldChange = (field: string, value: any) => {
        setEditingQuestion((prev: any) => ({ ...prev, [field]: value }));
    };

    const handleChoiceChange = (index: number, value: string) => {
        const newChoices = [...(editingQuestion.choices || [])];
        newChoices[index] = value;

        let updatedQuestion = { ...editingQuestion, choices: newChoices };
        
        // If fill-in-the-blank, automatically set answer to first choice if present.
        if (editingQuestion.type === "fill-in-the-blank") {
            updatedQuestion.answer = newChoices[0] || "";
        }

        setEditingQuestion(updatedQuestion);
    };

    const handleAddChoice = () => {
        const newChoices = [...(editingQuestion.choices || [])];
        newChoices.push("");
        let updatedQuestion = { ...editingQuestion, choices: newChoices };

        if (editingQuestion.type === "fill-in-the-blank") {
            updatedQuestion.answer = newChoices[0] || "";
        }

        setEditingQuestion(updatedQuestion);
    };

    const handleRemoveChoice = (index: number) => {
        const newChoices = [...(editingQuestion.choices || [])];
        newChoices.splice(index, 1);
        let updatedQuestion = { ...editingQuestion, choices: newChoices };

        if (editingQuestion.type === "fill-in-the-blank") {
            updatedQuestion.answer = newChoices[0] || "";
        }

        setEditingQuestion(updatedQuestion);
    };

    const handleCorrectAnswerSelection = (answer: string) => {
        setEditingQuestion((prev: any) => ({ ...prev, answer }));
    };

    const handleTrueFalseSelection = (boolVal: boolean) => {
        setEditingQuestion((prev: any) => ({ ...prev, answer: boolVal.toString().toLowerCase() }));
    };

    const handleQuestionTypeChange = (newType: string) => {
        let updatedQuestion = { ...editingQuestion, type: newType };

        if (newType === "multiple-choice") {
            updatedQuestion.choices = updatedQuestion.choices || [""];
            if (!updatedQuestion.answer) updatedQuestion.answer = "";
        } else if (newType === "fill-in-the-blank") {
            updatedQuestion.choices = updatedQuestion.choices || [""];
            updatedQuestion.answer = updatedQuestion.choices[0] || "";
        } else if (newType === "true-false") {
            delete updatedQuestion.choices;
            updatedQuestion.answer = "true";
        }

        setEditingQuestion(updatedQuestion);
    };

    const handleUpdateQuestion = async () => {
        if (!editingQuestionId || !editingQuestion) return;

        if (editingQuestion.type === "multiple-choice" && !editingQuestion.answer) {
            alert("Please select a correct answer before updating.");
            return;
        }

        await questionClient.updateQuestion(editingQuestionId, editingQuestion);
        await fetchQuestions();
        handleCancelEdit();
    };

    const handleDeleteQuestion = async (questionId: string) => {
        if (!qid) return;
        if (window.confirm("Are you sure you want to delete this question?")) {
            await questionClient.deleteQuestion(qid, questionId);
            await fetchQuestions();
        }
    };

    const handleCreateNewQuestion = async () => {
        if (!qid) return;
        // Default new question is multiple-choice with one blank choice
        const newQuestion = {
            title: "New Question",
            type: "multiple-choice",
            points: 1,
            question: "",
            choices: [""],
            answer: "" 
        };
        await questionClient.createQuestion(qid, newQuestion);
        await fetchQuestions();
    };

    const handleSaveAll = async () => {
        // Implement if needed
    };

    return (
        <div className="wd-question-editor">
            <ul className="wd-question-list list-group mt-3">
                {questions.map((question: any) => {
                    const isEditing = editingQuestionId === question._id;
                    return (
                        <li key={question._id} className="list-group-item mb-3 border border-dark rounded-1">
                            <div className="d-flex justify-content-between align-items-center">
                                <b>{question.title}</b>
                                <div className="fs-5">
                                    <FaPencilAlt className="text-primary me-2"
                                        onClick={() => isEditing ? handleCancelEdit() : handleEditClick(question)} />
                                    <FaTrash className="text-danger"
                                        onClick={() => handleDeleteQuestion(question._id)} />
                                </div>
                            </div>
                            {isEditing && editingQuestion && (
                                <div className="mt-3">
                                    <div className="form-group mb-3">
                                        <label className="form-label" htmlFor="question-name"><b>Name</b></label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="question-name"
                                            value={editingQuestion.title || ""}
                                            onChange={(e) => handleFieldChange("title", e.target.value)}
                                        />
                                    </div>
                                    <div className="form-group mb-3 d-flex justify-content-between">
                                        <div className="w-50 me-3">
                                            <label className="form-label" htmlFor="question-type"><b>Question Type</b></label>
                                            <select
                                                className="form-control"
                                                id="question-type"
                                                value={editingQuestion.type || ""}
                                                onChange={(e) => handleQuestionTypeChange(e.target.value)}
                                            >
                                                <option value="multiple-choice">Multiple Choice</option>
                                                <option value="true-false">True/False</option>
                                                <option value="fill-in-the-blank">Fill in the Blank</option>
                                            </select>
                                        </div>
                                        <div className="w-25">
                                            <label className="form-label" htmlFor="question-points"><b>Points</b></label>
                                            <input
                                                type="number"
                                                className="form-control"
                                                id="question-points"
                                                value={editingQuestion.points || ""}
                                                onChange={(e) => handleFieldChange("points", Number(e.target.value))}
                                            />
                                        </div>
                                    </div>
                                    <div className="form-group mb-3">
                                        <label className="form-label" htmlFor="question-instructions"><b>Question</b></label>
                                        <textarea
                                            className="form-control"
                                            id="question-instructions"
                                            value={editingQuestion.question || ""}
                                            onChange={(e) => handleFieldChange("question", e.target.value)}
                                        ></textarea>
                                    </div>

                                    {/* Potential Answers Section */}
                                    <div className="form-group mb-3">
                                        <label className="form-label"><b>Potential Answers</b></label>

                                        {editingQuestion.type === "multiple-choice" && (
                                            <>
                                                {editingQuestion.choices?.map((choice: string, index: number) => (
                                                    <div className="input-group mb-2" key={index}>
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            placeholder="Answer"
                                                            value={choice}
                                                            onChange={(e) => handleChoiceChange(index, e.target.value)}
                                                        />
                                                        <div className="input-group-text">
                                                            <input
                                                                type="radio"
                                                                name="correct-answer"
                                                                checked={editingQuestion.answer === choice}
                                                                onChange={() => handleCorrectAnswerSelection(choice)}
                                                            />
                                                        </div>
                                                        <button
                                                            type="button"
                                                            className="btn btn-danger"
                                                            onClick={() => handleRemoveChoice(index)}
                                                        >
                                                            <FaTrash />
                                                        </button>
                                                    </div>
                                                ))}
                                                <a onClick={handleAddChoice}
                                                    className="float-end text-danger text-decoration-none d-flex align-items-center"
                                                    style={{ cursor: "pointer" }}>
                                                    <FaPlus className="me-2" />
                                                    Add Another Answer
                                                </a>
                                            </>
                                        )}

                                        {editingQuestion.type === "true-false" && (
                                            <div>
                                                <div className="form-check">
                                                    <input
                                                        id="wd-question-true-input"
                                                        className="form-check-input"
                                                        type="radio"
                                                        name="tf-answer"
                                                        checked={editingQuestion.answer === "true"}
                                                        onChange={() => handleTrueFalseSelection(true)}
                                                    />
                                                    <label className="form-check-label" htmlFor="wd-question-true-input">
                                                        True
                                                    </label>
                                                </div>
                                                <div className="form-check">
                                                    <input
                                                        id="wd-question-false-input"
                                                        className="form-check-input"
                                                        type="radio"
                                                        name="tf-answer"
                                                        checked={editingQuestion.answer === "false"}
                                                        onChange={() => handleTrueFalseSelection(false)}
                                                    />
                                                    <label className="form-check-label" htmlFor="wd-question-false-input">
                                                        False
                                                    </label>
                                                </div>
                                            </div>
                                        )}

                                        {editingQuestion.type === "fill-in-the-blank" && (
                                            <>
                                                {editingQuestion.choices?.map((choice: string, index: number) => (
                                                    <div key={index} className="input-group mb-2">
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            placeholder="Correct Answer"
                                                            value={choice}
                                                            onChange={(e) => handleChoiceChange(index, e.target.value)}
                                                        />
                                                        <button
                                                            type="button"
                                                            className="btn btn-danger"
                                                            onClick={() => handleRemoveChoice(index)}
                                                        >
                                                            <FaTrash />
                                                        </button>
                                                    </div>
                                                ))}
                                                <a onClick={handleAddChoice}
                                                    className="float-end text-danger text-decoration-none d-flex align-items-center"
                                                    style={{ cursor: "pointer" }}>
                                                    <FaPlus className="me-2" />
                                                    Add Another Answer
                                                </a>
                                            </>
                                        )}
                                    </div>
                                    <hr />
                                    <div className="d-flex justify-content-start">
                                        <button type="button" className="btn btn-light border text-secondary me-2" onClick={handleCancelEdit}>
                                            Cancel
                                        </button>
                                        <button type="button" className="btn btn-danger" onClick={handleUpdateQuestion}>
                                            Update Question
                                        </button>
                                    </div>
                                </div>
                            )}
                        </li>
                    );
                })}
            </ul>
            <div className="text-center mt-3">
                <button className="btn btn-lg btn-secondary" onClick={handleCreateNewQuestion}>
                    <FaPlus className="position-relative me-2" style={{ bottom: "1px" }} />
                    New Question
                </button>
            </div>
            <hr />
            <div className="d-flex float-end">
                <Link to={`/Kanbas/Courses/${cid}/Quizzes`}>
                    <button className="btn btn-light border text-secondary mx-1">Cancel</button>
                </Link>
                <button type="button" className="btn btn-danger border border-dark mx-1" onClick={handleSaveAll}>
                    Save
                </button>
            </div>
        </div>
    );
}
