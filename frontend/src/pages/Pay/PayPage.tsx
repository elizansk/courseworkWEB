import { useState } from "react";
import "../../styles/variables.scss";
import { useParams } from "react-router-dom";
import "./PayPage.scss";
import {useAuth} from "../../context/AuthContext.tsx";

const PayPage = () => {
    const { courseId } = useParams();
    const { user } = useAuth();
    const [formData, setFormData] = useState({
        name: "",
        cardNumber: "",
        expiry: "",
        cvv: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();

        const res = await fetch(`http://127.0.0.1:8000/api/v1/buy-course/${courseId}/`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${user?.access}`,
                "Accept": "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify(formData)
        });

        if (res.ok) alert("Курс оплачен");
    };

    return (

        <section className="payment-section">
            <div className="container">
                <h2>Оплата курса</h2>
                <p className="intro">
                    Введите номер карты и получите доступ к курсу прямо сейчас.
                </p>

                <div className="card payment-card">
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Номер карты</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Имя на карте</label>
                            <input
                                type="text"
                                name="cardNumber"
                                value={formData.cardNumber}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>Срок действия</label>
                                <input
                                    type="text"
                                    name="expiry"
                                    placeholder="MM/YY"
                                    value={formData.expiry}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>CVV</label>
                                <input
                                    type="text"
                                    name="cvv"
                                    value={formData.cvv}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <button type="submit" className="btn">
                            Оплатить
                        </button>
                    </form>
                </div>
            </div>
        </section>
    );
};

export default PayPage;
