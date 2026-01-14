import React, {useEffect, useState} from "react";
import {useLocation, useNavigate} from "react-router-dom";
import "./TeacherCreateCourseForm.scss";

type Category = { id: number; name: string };

export type AssignmentForm = {
    title: string;
    description: string;
    max_score: number;
};

export type LessonForm = {
    title: string;
    video_url: string;
    order_num: number;
    assignments: AssignmentForm[];
};

export type ModuleForm = {
    title: string;
    description: string;
    order_num: number;
    lessons: LessonForm[];
};

export type CourseFormData = {
    title: string;
    short_desc: string;
    description: string;
    price: string;
    thumbnail_url: string;
    category: number | null;
    slug: string;
    modules: ModuleForm[];
};

interface EditingCourse {
    id: number;
    title: string;
    short_desc: string;
    description: string;
    price: string;
    thumbnail_url: string;
    category?: { id: number; name: string };
    slug: string;
    modules?: ModuleForm[];
}

const TeacherCreateCourseForm: React.FC = () => {
    const API_URL = import.meta.env.VITE_API_URL;
    const navigate = useNavigate();
    const location = useLocation();
    const editingCourse = (location.state as { course?: EditingCourse })?.course;

    const [categories, setCategories] = useState<Category[]>([]);
    const [formData, setFormData] = useState<CourseFormData>({
        title: editingCourse?.title || "",
        short_desc: editingCourse?.short_desc || "",
        description: editingCourse?.description || "",
        price: editingCourse?.price || "",
        thumbnail_url: editingCourse?.thumbnail_url || "",
        category: editingCourse?.category?.id || null,
        slug: editingCourse?.slug || "",
        modules: editingCourse?.modules?.map(m => ({
            title: m.title,
            description: m.description,
            order_num: m.order_num,
            lessons: m.lessons.map(l => ({
                title: l.title,
                video_url: l.video_url,
                order_num: l.order_num,
                assignments: l.assignments.map(a => ({
                    title: a.title,
                    description: a.description,
                    max_score: a.max_score,
                })),
            })),
        })) || [],
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    // ===== AI генерация =====
    const [aiPrompt, setAiPrompt] = useState("");
    const [isGenerating, setIsGenerating] = useState(false);

    const generateCourse = async () => {
        if (!aiPrompt.trim()) return alert("Введите запрос для генерации курса");

        setIsGenerating(true);
        try {
            const response = await fetch(`http://localhost:3000/generate-course`, {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({prompt: aiPrompt}),
            });

            if (!response.ok) throw new Error("Ошибка генерации курса");

            const course: CourseFormData = await response.json();

            setFormData({
                title: course.title,
                short_desc: course.short_desc,
                description: course.description,
                price: String(course.price),
                thumbnail_url: course.thumbnail_url,
                category: course.category ? Number(course.category) : null,
                slug: course.slug,
                modules: course.modules,
            });

            alert("Курс успешно сгенерирован и подставлен в форму!");
        } catch (err) {
            console.error(err);
            alert("Не удалось сгенерировать курс");
        } finally {
            setIsGenerating(false);
        }
    };

    // ===== Загрузка категорий =====
    useEffect(() => {
        fetch(`${API_URL}/categories/dict`)
            .then(res => res.json())
            .then(data => setCategories(data.results as Category[]))
            .catch(err => console.error("Ошибка загрузки категорий:", err));
    }, [API_URL]);

    // ===== Общие изменения =====
    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const {name, value} = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    // ===== Модули =====
    const addModule = () => {
        setFormData(prev => ({
            ...prev,
            modules: [
                ...prev.modules,
                {title: "", description: "", order_num: prev.modules.length + 1, lessons: []},
            ],
        }));
    };
    const removeModule = (mIdx: number) => {
        setFormData(prev => ({
            ...prev,
            modules: prev.modules.filter((_, i) => i !== mIdx),
        }));
    };
    const updateModule = (mIdx: number, field: keyof ModuleForm, value: string | number) => {
        setFormData(prev => {
            const modules = [...prev.modules];
            modules[mIdx] = {...modules[mIdx], [field]: value};
            return {...prev, modules};
        });
    };

    // ===== Уроки =====
    const addLesson = (mIdx: number) => {
        setFormData(prev => {
            const modules = [...prev.modules];
            modules[mIdx].lessons.push({title: "", video_url: "", order_num: prev.modules.length + 1, assignments: []});
            return {...prev, modules};
        });
    };
    const removeLesson = (mIdx: number, lIdx: number) => {
        setFormData(prev => {
            const modules = [...prev.modules];
            modules[mIdx].lessons = modules[mIdx].lessons.filter((_, i) => i !== lIdx);
            return {...prev, modules};
        });
    };
    const updateLesson = (mIdx: number, lIdx: number, field: keyof LessonForm, value: string | number) => {
        setFormData(prev => {
            const modules = [...prev.modules];
            modules[mIdx].lessons[lIdx] = {...modules[mIdx].lessons[lIdx], [field]: value};
            return {...prev, modules};
        });
    };

    // ===== ДЗ =====
    const addAssignment = (mIdx: number, lIdx: number) => {
        setFormData(prev => {
            const modules = [...prev.modules];
            modules[mIdx].lessons[lIdx].assignments.push({title: "", description: "", max_score: 100});
            return {...prev, modules};
        });
    };
    const removeAssignment = (mIdx: number, lIdx: number, aIdx: number) => {
        setFormData(prev => {
            const modules = [...prev.modules];
            modules[mIdx].lessons[lIdx].assignments = modules[mIdx].lessons[lIdx].assignments.filter((_, i) => i !== aIdx);
            return {...prev, modules};
        });
    };
    const updateAssignment = (
        mIdx: number,
        lIdx: number,
        aIdx: number,
        field: keyof AssignmentForm,
        value: string | number
    ) => {
        setFormData(prev => {
            const modules = [...prev.modules];
            const assignment = modules[mIdx].lessons[lIdx].assignments[aIdx];
            modules[mIdx].lessons[lIdx].assignments[aIdx] = {...assignment, [field]: value};
            return {...prev, modules};
        });
    };

    // ===== Отправка формы =====
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.category) return alert("Выберите категорию!");
        setIsSubmitting(true);
        try {
            const method = editingCourse ? "PUT" : "POST";
            console.log(JSON.stringify(formData))
            const url = editingCourse ? `${API_URL}/instructor/courses/full-create/${editingCourse.id}/` : `${API_URL}/instructor/courses/full-create/`;
            const response = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("access")}`,
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) throw new Error("Ошибка при сохранении курса");
            const savedCourse = await response.json();
            alert(`Курс "${savedCourse.title}" успешно ${editingCourse ? "обновлён" : "создан"}!`);
            navigate("/teacher/profile");
        } catch (err) {
            console.error(err);
            alert("Не удалось сохранить курс");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form className="teacher-course-form" onSubmit={handleSubmit}>
            <h2>{editingCourse ? "Редактировать курс" : "Создать новый курс"}</h2>

            {/* ===== AI генерация ===== */}
            <div className="ai-generator">
                <h3>Сгенерировать курс с помощью AI</h3>
                <input
                    type="text"
                    placeholder="Напишите запрос для генерации курса"
                    value={aiPrompt}
                    onChange={e => setAiPrompt(e.target.value)}
                />
                <button type="button" onClick={generateCourse} disabled={isGenerating}>
                    {isGenerating ? "Генерируем..." : "Сгенерировать курс"}
                </button>
            </div>

            {/* ===== Основная форма ===== */}
            <div className="basic-info">
                <input type="text" name="title" placeholder="Название курса" value={formData.title}
                       onChange={handleChange} required/>
                <input type="text" name="short_desc" placeholder="Краткое описание" value={formData.short_desc}
                       onChange={handleChange} required/>
                <textarea name="description" placeholder="Полное описание" value={formData.description}
                          onChange={handleChange} rows={3} required/>
                <input type="number" name="price" placeholder="Цена" value={formData.price} onChange={handleChange}
                       required/>
                <input type="text" name="thumbnail_url" placeholder="Ссылка на изображение"
                       value={formData.thumbnail_url} onChange={handleChange}/>
                <input type="text" name="slug" placeholder="Ключевое слово для перехода (slug)"
                       value={formData.slug} onChange={handleChange} required/>
                <select name="category" value={formData.category ?? ""} onChange={handleChange} required>
                    <option value="">-- выберите категорию --</option>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
            </div>

            {/* ===== Модули ===== */}
            <div className="modules-section">
                {formData.modules.map((mod, mIdx) => (
                    <div key={mIdx} className="module-card">
                        <h3>Модуль {mIdx + 1}</h3>
                        <input placeholder="Название модуля" value={mod.title}
                               onChange={e => updateModule(mIdx, "title", e.target.value)}/>
                        <textarea placeholder="Описание модуля" value={mod.description}
                                  onChange={e => updateModule(mIdx, "description", e.target.value)}/>
                        <button type="button" onClick={() => removeModule(mIdx)}>Удалить модуль</button>

                        {mod.lessons.map((lesson, lIdx) => (
                            <div key={lIdx} className="lesson-card">
                                <h4>Урок {lIdx + 1}</h4>
                                <input placeholder="Название урока" value={lesson.title}
                                       onChange={e => updateLesson(mIdx, lIdx, "title", e.target.value)}/>
                                <input placeholder="Видео URL" value={lesson.video_url}
                                       onChange={e => updateLesson(mIdx, lIdx, "video_url", e.target.value)}/>
                                <button type="button" onClick={() => removeLesson(mIdx, lIdx)}>Удалить урок</button>

                                {lesson.assignments.map((ass, aIdx) => (
                                    <div key={aIdx} className="assignment-card">
                                        <h5>ДЗ {aIdx + 1}</h5>
                                        <input placeholder="Название ДЗ" value={ass.title}
                                               onChange={e => updateAssignment(mIdx, lIdx, aIdx, "title", e.target.value)}/>
                                        <textarea placeholder="Описание ДЗ" value={ass.description}
                                                  onChange={e => updateAssignment(mIdx, lIdx, aIdx, "description", e.target.value)}/>
                                        <input type="number" placeholder="Максимальный балл" value={ass.max_score}
                                               onChange={e => updateAssignment(mIdx, lIdx, aIdx, "max_score", Number(e.target.value))}/>
                                        <button type="button" onClick={() => removeAssignment(mIdx, lIdx, aIdx)}>Удалить
                                            ДЗ
                                        </button>
                                    </div>
                                ))}

                                <button type="button" onClick={() => addAssignment(mIdx, lIdx)}>Добавить ДЗ</button>
                            </div>
                        ))}

                        <button type="button" onClick={() => addLesson(mIdx)}>Добавить урок</button>
                    </div>
                ))}

                <button type="button" onClick={addModule}>Добавить модуль</button>
            </div>

            <button type="submit"
                    disabled={isSubmitting}>{isSubmitting ? "Сохраняем..." : editingCourse ? "Сохранить курс" : "Создать курс"}</button>
        </form>
    );
};

export default TeacherCreateCourseForm;
