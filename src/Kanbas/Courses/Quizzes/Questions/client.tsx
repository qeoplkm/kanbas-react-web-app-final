import axios from "axios";
const REMOTE_SERVER = process.env.REACT_APP_REMOTE_SERVER;
const axiosWithCredentials = axios.create({ withCredentials: true });
const QUIZ_API = `${REMOTE_SERVER}/api/quizzes`;

export const findQuestionsForQuiz = async (quizId: string) => {
    const response = await axiosWithCredentials.get(`${QUIZ_API}/${quizId}/questions`);
    return response.data;
}

export const createQuestion = async (quizId: string, question: any) => {
    const { data } = await axiosWithCredentials.post(`${QUIZ_API}/${quizId}/questions`, question);
    return data;
}

export const updateQuestion = async (questionId: string, question: any) => {
    const { data } = await axiosWithCredentials.put(`${REMOTE_SERVER}/api/questions/${questionId}`, question);
    return data;
};


export const deleteQuestion = async (quizId: string, questionId: string) => {
    const response = await axiosWithCredentials.delete(`${QUIZ_API}/${quizId}/questions/${questionId}`);
    return response.data;
}