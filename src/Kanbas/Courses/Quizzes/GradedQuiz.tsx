import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import * as quizClient from "./client";
import "./QuizView.css";
import { useSelector } from "react-redux";

export default function GradedQuiz() {
    const { qid, cid } = useParams();
    const [questions, setQuestions] = useState<any[]>([]);
    const [quiz, setQuiz] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
    const [answers, setAnswers] = useState<{ [key: string]: any }>({});
    const [answer, setAnswer] = useState<any>(null);
    const { currentUser } = useSelector((state: any) => state.accountReducer);
    const navigate = useNavigate();
    console.log("answers:", answers);
    console.log("answer:", answer);
    console.log("questions:", questions);


    
    const calculateScore = (questions: any[], answers: { [key: string]: any }) => {
        return questions.reduce((score, question) => {
          const userAnswer = answers[question._id];
          let correctAnswer = question.answer;
          
          if (question.type === "multiple-choice" && (!correctAnswer || correctAnswer.trim() === "")) {
            correctAnswer = question.choices && question.choices.length > 0 ? question.choices[0] : "";
          }
      
          switch (question.type) {
            case "multiple-choice":
                if (userAnswer === correctAnswer) {
                    return score + (question.points || 0);
                }
                break;

            case "true-false":
                if (
                    userAnswer && correctAnswer &&
                    userAnswer.toString().toLowerCase() === correctAnswer.toString().toLowerCase()
                ) {
                    return score + (question.points || 0);
                }
                break;
            case "fill-in-the-blank":
              if (
                userAnswer &&
                correctAnswer &&
                userAnswer.trim().toLowerCase() === correctAnswer.trim().toLowerCase()
              ) {
                return score + (question.points || 0);
              }
              break;
            default:
                // Unknown question type, no score added
            break;
          }
          return score;
        }, 0);
      };

    const earnedScore = calculateScore(questions, answers);

    const handleSubmitQuiz = async () => {
        
    };

    useEffect(() => {
        const fetchQuestions = async () => {
            if (qid) {
                try {
                    const fetchedQuestions = await quizClient.getQuestions(qid);
                    setQuestions(fetchedQuestions || []);
                } catch (error) {
                    console.error("Error fetching questions:", error);
                    setQuestions([]);
                }
            }
        };

        const fetchAnswers = async () => {
            if (qid) {
                try {
                    const fetchedAnswers = await quizClient.getAnswers(qid, currentUser._id);
                    setAnswer(fetchedAnswers);
                    setAnswers(fetchedAnswers.answers || {});
                } catch (error) {
                    console.error("Error fetching answers:", error);
                }
            }
        };

        

        const fetchQuiz = async () => {
            if (qid) {
                try {
                    const fetchedQuiz = await quizClient.getQuiz(qid);
                    setQuiz(fetchedQuiz);
                } catch (error) {
                    console.error("Error fetching quiz:", error);
                    setQuiz(null);
                }
            }
            setLoading(false);
        };
        

        fetchQuiz();
        fetchQuestions();
        fetchAnswers();
    }, [qid, currentUser._id]);

    if (!quiz) {
        return <div>Quiz not found</div>;
    }

    

   

    const renderQuestion = (question: any, index: number) => {
        if (!question) {
            return <p className="unknown-type">Question data is missing</p>;
        }

        return (
            <div key={question._id} className="question-card">
                <div className="question-header">
                    <div className="question-title">Question {index + 1}</div>
                    <div className="question-points">{question.points || 0} pts</div>
                </div>
                <p className="question-text">{question.question || "No question text available"}</p>
                {(() => {
                    switch (question.type) {
                        case "multiple-choice":
                            return (
                                <ul className="options-list">
                                    {question.choices.map((choice: string, idx: number) => (
                                        <li key={`${question._id}-choice-${idx}`} className="option-item">
                                            <input
                                                type="radio"
                                                name={question._id}
                                                value={choice}
                                                className="radio-input"
                                                checked={answers[question._id] === choice}
                                                disabled
                                            />
                                            <label>{choice}</label>
                                            {question.answer === choice && (
                                                <>
                                                    <span className="correct-arrow" style={{ color: 'green' }}>✔</span>
                                                    <span className="correct-answer" style={{ color: 'green' }}>Correct</span>
                                                </>
                                            )}
                                        </li>
                                    ))}
                                </ul>
                            );
                        case "true-false":
                            return (
                                <ul className="options-list">
                                    {["true", "false"].map((choice, idx) => (
                                        <li key={`${question._id}-choice-${idx}`} className="option-item">
                                            <input
                                                type="radio"
                                                name={question._id}
                                                value={choice}
                                                className="radio-input"
                                                checked={answers[question._id]?.toLowerCase() === choice.toLowerCase()}
                                        
                                                disabled
                                            />
                                            <label>{choice}</label>
                                            {question.answer === choice && (
                                                <>
                                                    <span className="correct-arrow" style={{ color: 'green' }}>✔</span>
                                                    <span className="correct-answer" style={{ color: 'green' }}>Correct</span>
                                                </>
                                            )}
                                        </li>
                                    ))}
                                </ul>
                            );
                        case "fill-in-the-blank":
                            return (
                                <div>
                                    <input
                                        type="text"
                                        name={question._id}
                                        value={answers[question._id]}
                                        disabled
                                    />
                                    {question.answer && answers[question._id] && answers[question._id].trim().toLowerCase() === question.answer.trim().toLowerCase() && (
                                        <>
                                            <span className="correct-arrow" style={{ color: 'green' }}>✔</span>
                                            <span className="correct-answer" style={{ color: 'green' }}>Correct</span>
                                        </>
                                    )}
                                </div>
                            );
                        default:
                            return <p className="unknown-type">Unknown question type</p>;
                    }
                })()}
            </div>
        );
    };

    const currentQuestion = questions[currentQuestionIndex];

    return (
        <div className="quiz-container">
            <h1 className="quiz-title">{quiz.name}</h1>
            <p className="quiz-instructions">{quiz.instructions}</p>
            <h3>Grade: {earnedScore}/{quiz.points}</h3>
            <hr className="quiz-divider" />

            {quiz.one_at_a_time ? (
                <div>
                    {currentQuestion ? renderQuestion(currentQuestion, currentQuestionIndex) : <p>No question available</p>}
                    <div className="action-buttons">
                        <button
                            className="action-button"
                            disabled={currentQuestionIndex === 0}
                            onClick={() => setCurrentQuestionIndex((prev) => prev - 1)}
                        >
                            Previous
                        </button>
                        {currentQuestionIndex < questions.length - 1 ? (
                            <button
                                className="action-button"
                                onClick={() => setCurrentQuestionIndex((prev) => prev + 1)}
                            >
                                Next
                            </button>
                        ) : (
                            <div className="submit-quiz">
                                <button onClick={handleSubmitQuiz} className="action-button">Done</button>
                            </div>
                        )}
                    </div>
                </div>
            ) : (
                <div>
                    {questions.map((question, index) => renderQuestion(question, index))}
                    <div className="submit-quiz">
                        <button onClick={handleSubmitQuiz} className="action-button">Sumbit quiz</button>
                    </div>
                </div>
            )}
        </div>
    );
}
