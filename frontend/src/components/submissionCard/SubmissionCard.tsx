import type {SubmissionForTeacher} from "../../types/TeacherSubmissions.ts";
import React, {useState} from "react";
import "./SubmissionCard.scss";
type Props = {
    submission: SubmissionForTeacher;
    onGrade: (id: number, score: number, feedback: string) => void;
};

export const SubmissionCard: React.FC<Props> = ({ submission, onGrade }) => {
    const [score, setScore] = useState<number>(submission.score ?? 0);
    const [feedback, setFeedback] = useState(submission.feedback ?? "");
    const [sending, setSending] = useState(false);

    const submitGrade = async () => {
        setSending(true);
        await onGrade(submission.id, score, feedback);
        setSending(false);
    };

    return (
        <div className="submission-card">
            <div className="submission-header">
                <strong>
                    {submission.user.first_name} {submission.user.last_name}
                </strong>
                <span>{submission.user.email}</span>
            </div>

            <div className="submission-meta">
                <div>Курс: {submission.course_title}</div>
                <div>Урок: {submission.lesson_title}</div>
                <div>{submission.assignment_title}</div>
            </div>

            {submission.content && (
                <div className="submission-content">
                    <strong>Комментарий студента:</strong>
                    <p>{submission.content}</p>
                </div>
            )}

            {submission.file_url && (
                <a
                    href={submission.file_url}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Открыть файл
                </a>
            )}

            <div className="grading">
                <input
                    type="number"
                    min={0}
                    max={100}
                    value={score}
                    onChange={e => setScore(Number(e.target.value))}
                />

                <textarea
                    placeholder="Комментарий преподавателя"
                    value={feedback}
                    onChange={e => setFeedback(e.target.value)}
                />

                {!feedback ?  (
                <button onClick={submitGrade} disabled={sending}>
                    {sending ? "Сохранение..." : "Выставить оценку"}
                </button>) : null}
            </div>
        </div>
    );
};
