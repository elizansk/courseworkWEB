import React, { useEffect, useState } from "react";
import "./TeacherSubmissionsPage.scss";
import type {
    SubmissionForTeacher,
    SubmissionsListResponse,
} from "../../types/TeacherSubmissions";
import { SubmissionCard } from "../../components/submissionCard/SubmissionCard.tsx"

const TeacherSubmissionsPage: React.FC = () => {
    const API_URL = import.meta.env.VITE_API_URL;

    const [submissions, setSubmissions] = useState<SubmissionForTeacher[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSubmissions = async () => {
            const res = await fetch(`${API_URL}/submissions/list/`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("access")}`,
                },
            });

            const data: SubmissionsListResponse = await res.json();
            setSubmissions(data.results);
            setLoading(false);
        };

        fetchSubmissions();
    }, []);

    const gradeSubmission = async (
        submissionId: number,
        score: number,
        feedback: string
    ) => {
        await fetch(`${API_URL}/submissions/${submissionId}/grade/`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("access")}`,
            },
            body: JSON.stringify({ score, feedback }),
        });

        setSubmissions(prev =>
            prev.map(s =>
                s.id === submissionId
                    ? { ...s, score, feedback, is_graded: true }
                    : s
            )
        );
    };

    if (loading) return <p>Загрузка...</p>;

    return (
        <div className="teacher-submissions">
            <h1>Проверка домашних заданий</h1>

            {submissions.map(submission => (
                <SubmissionCard
                    key={submission.id}
                    submission={submission}
                    onGrade={gradeSubmission}
                />
            ))}
        </div>
    );
};

export default TeacherSubmissionsPage;
