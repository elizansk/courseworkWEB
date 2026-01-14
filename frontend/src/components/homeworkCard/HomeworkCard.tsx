import React, { useState } from "react";
import "./HomeworkCard.scss";
import type { Assignment, Submission } from "../../types/CourseResponse";

type Props = {
    assignment: Assignment;
    onSubmitted: (submission: Submission) => void;
};

const HomeworkCard: React.FC<Props> = ({ assignment, onSubmitted }) => {
    const API_URL = import.meta.env.VITE_API_URL;
    const submission = assignment.submission

    console.log(assignment.submission);
    const [content, setContent] = useState("");
    const [fileUrl, setFileUrl] = useState("");
    const [loading, setLoading] = useState(false);

    let status = "Домашнее задание не сдано";
    if (submission) {
        if (submission.score === null) status = "Домашнее задание на проверке";
        else if (submission.score < 50) status = "Домашнее задание не выполнено";
        else status = "Домашнее задание выполнено";
    }

    const submit = async () => {
        setLoading(true);
        try {
            console.log(fileUrl)
            const res = await fetch(`${API_URL}/submissions/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("access")}`,
                },
                body: JSON.stringify({
                    assignment: assignment.id,
                    content,
                    file_url: fileUrl,
                }),
            });

            if (!res.ok) throw new Error("Ошибка отправки");

            const newSubmission: Submission = {
                ...(await res.json()),
                score: null,
            };

            onSubmitted(newSubmission);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="homework">
            <h4>{assignment.title}</h4>
            <p>{assignment.description}</p>

            <div className="homework-status">{status}</div>

    {!submission && (
        <div className="homework-form">
        <textarea
            placeholder="Комментарий"
        value={content}
        onChange={e => setContent(e.target.value)}
        />
        <input
        placeholder="Ссылка на файл"
        value={fileUrl}
        onChange={e => setFileUrl(e.target.value)}
        />
        <button onClick={submit} disabled={loading}>
        {loading ? "Отправка..." : "Сдать ДЗ"}
        </button>
        </div>
    )}

    {submission?.feedback && (
        <div className="feedback">
            <strong>Комментарий преподавателя:</strong> {submission.feedback}
    </div>
    )}
    </div>
);
};

export default HomeworkCard;
