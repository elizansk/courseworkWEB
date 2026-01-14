import express, { Request, Response } from 'express';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import {swaggerOptions} from "./swaggerOptions";
import ollama from 'ollama';
const app = express();
const port = 3000;
import cors from 'cors';
app.use(express.json());
app.use(cors());

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerSpec));


/**
 * @swagger
 * /:
 *   get:
 *     summary: Проверка API
 *     responses:
 *       200:
 *         description: API работает
 */
app.get('/', (req: Request, res: Response) => {
    res.status(200).json({ message: "API на TS работает!" });
});


/**
 * @swagger
 * /generate-course:
 *   post:
 *     summary: Генерация курса с помощью Ollama
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               prompt:
 *                 type: string
 *                 example: Создай курс по C# с 3 модулями
 *     responses:
 *       200:
 *         description: Сгенерированный курс
 *       400:
 *         description: Ошибка валидации
 *       500:
 *         description: Ошибка генерации курса
 */
app.post('/generate-course', async (req: Request, res: Response) => {
    const { prompt } = req.body;
    console.log(prompt)
    if (!prompt) return res.status(400).json({ error: 'prompt обязателен' });

    try {
        const response = await ollama.chat({
            model: 'gpt-oss:20b-cloud',
            messages: [
                {
                    role: 'user',
                    content: `
Ты создаешь JSON курса по формату:

{
  "title": "...",
  "short_desc": "...",
  "description": "...",
  "price": 20000,
  "thumbnail_url": "",
  "category": "0",
  "slug"
  "modules": [
    {
      "title": "...",
      "description": "...",
      "order_num": 1,
      "lessons": [
        {
          "title": "...",
          "video_url": "",
          "order_num": 1,
          "assignments": [
            { "title": "...", "description": "...", "max_score": 100 }
          ]
        }
      ]
    }
  ]
}

video_url всегда пустой, max_score = 100. Сгенерируй курс по запросу: "${prompt}"
Возвращай только JSON строго в этом формате.
          `,
                },
            ],
        });

        const text = response.message.content;

        try {
            const course = JSON.parse(text);
            res.json(course);
        } catch {
            res.status(500).json({ error: 'Не удалось распарсить JSON от Olama', raw: text });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Ошибка генерации курса' });
    }
});


app.listen(port, () => {
    console.log(`Сервер запущен на http://localhost:${port}`);
    console.log(`Swagger UI доступен по http://localhost:${port}/swagger`);
});
