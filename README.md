# 🛠️ Project Guidelines and Requirements\*\*

Die Aufgabe: Erstellung einer E-Commerce-API, über die Produkte und Kategorien aufgelistet sowie Bestellungen für Benutzer angelegt werden können.

Stack: Express + TypeScript + Mongoose (MongoDB)

**FR 006 MongoDB (Atlas or local)**
Als Object Data Modeling (ODM) verwende ich Mongoose Bibliothek für MongoDB.
Gemäß den Projektanforderungen bestand die Möglichkeit, entweder MongoDB Atlas (Cloud) oder eine lokale MongoDB-Datenbank zu verwenden. Ich habe mich für die lokale Datenbank entschieden.

**FR 007 Mongoose Integration**
Gemäß den Projektanforderungen ("Connect to MongoDB with Mongoose and expose a ready connection before starting the HTTP server") stellen wir erst eine vollständige Verbindung zur Datenbank her, bevor der Server gestartet wird.

Diese Logik wurde in der Datei src/app.ts mithilfe einer asynchronen Funktion (async/await) umgesetzt:

await connectDB(): Die Anwendung wartet, bis Mongoose erfolgreich eine Verbindung zu MongoDB aufgebaut hat.

app.listen(): Erst nach erfolgreicher Datenbankverbindung startet der Express-Server und nimmt Anfragen entgegen.

**FR009 Zod-Validierung**
Zur Überprüfung eingehender Anfragedaten (Request Body, Params, Query) verwenden wir Zod-Schemas. Die Validierung erfolgt über ein Middleware direkt in den Routen, bevor die Daten an die Controller übergeben werden.

Schemas: src/schemas/userSchema.ts (Definition der Validierungsregeln für User)

Middleware: src/middleware/validate.ts (Prüfung der Daten in den Routen src/routes/userRoutes.ts)

**FR010 Common Middleware**
(промежуточные обработчики - Когда клиент отправляет запрос на сервер, этот запрос проходит через конвейер. Каждая станция на этом конвейере — это Middleware)

- JSON parsing (express.json()):
  Фронтенд присылает данные в виде длинной текстовой строки JSON. Этот middleware «распаковывает» её, чтобы в контроллере мы могли удобно обращаться к данным: req.body.name, req.body.email.

- CORS (cors()):
  Это политика безопасности браузера. По умолчанию браузеры запрещают фронтенду (например, React на localhost:5173) делать запросы на бэкенд (localhost:8080), если они на разных портах. cors() дает браузеру разрешение: «Всё в порядке, этому фронтенду можно верить».

- Centralized Error Handling (Централизованная обработка ошибок):
  Чтобы не писать try/catch с обработкой ошибок в каждом контроллере отдельно. Все ошибки сбрасываются в единый специальный middleware — errorHandler (он всегда стоит в самом конце app.ts). Он формирует одинаковые, аккуратные ответы с кодом ошибки (например, 400 или 500) и понятным текстом.

Согласно ТЗ и логике нашего проекта, в папке middleware должно быть всего 2 файла:

validate.ts — middleware для проверки входящих данных через Zod-схемы (валидация).

errorHandler.ts — middleware для централизованной обработки всех ошибок приложения.

app.use(express.json()) — встроенный в Express.
app.use(cors()) — из установленной библиотеки cors.

В отличие от express.json(), который уже встроена в сам Express, библиотека CORS устанавливается отдельно.

Так как мы работаем на TypeScript, нам нужно установить саму библиотеку и её типы для разработчика.

В терминале нужно выполнить команду:

npm install cors
npm install -D @types/cors

cors — сама библиотека для работы.
-D @types/cors — типы, чтобы TypeScript понимал подсказки и не выдавал ошибок при написании кода.

## Data Models (Mongoose)

**FR011 User Model**
Fields: name (string), email (string), password (string). Ensure unique email at the DB or app layer.

**FR015 Response Shaping**
Не отправлять пароль: Когда мы создаем или получаем пользователя, сервер никогда не должен возвращать поле password в ответе API (даже в зашифрованном виде). Это правило безопасности.

Красивый ID: MongoDB по умолчанию создает идентификатор как \_id: преобразовывать \_id в стандартный id перед отправкой ответа клиенту.

##Business Rules
User ---

**FR019 Users CRUD**
GET /users, POST /users, GET /users/:id, PUT /users/:id, DELETE
Решение: Вместо delete мы создаем новый объект только с теми полями, которые хотим вернуть клиенту (без \_id, \_\_v и password)

Была проблемс: The operand of a 'delete' operator must be optional.
Сделать \_id опциональным в типе Mongoose-документа — это действительно некорректный компромисс (плохая практика), потому что у любого документа, сохраненного в MongoDB, \_id обязателен по определению базы данных.
Какое решение является стандартным и верным?
В современном JavaScript / TypeScript от использования оператора delete вообще отказываются (так как он мутирует объект и снижает производительность движка V8).
Вместо delete используют деструктуризацию объекта (Object Rest/Spread). Это иммутабельный подход: мы извлекаем из объекта то, что нужно исключить (\_id, \_\_v, password), а всё остальное возвращаем. При этом исходные типы модели IUser остаются 100% строгими и правильными!

**FR023**
Swagger UI — это интерактивная визуальная веб-страница (интерфейс) для бэкенда - Чтобы разработчикам фронтенда не нужно было гадать, какие URL-адреса (эндпоинты) есть у сервера, какие данные туда отправлять и что сервер вернет в ответ.
Как работает: Он берет файл документации (OpenAPI specification в формате JSON или YAML) и превращает его в красивый сайт с кнопками.
src/docs/swagger.json - подробно описаны все маршруты (/users, /products), методы (GET, POST), параметры и форматы данных
src/app.ts: Маршрут, который подключает библиотеку swagger-ui-express и открывает страницу документации (обычно по адресу http://localhost:8080/docs).

---

Мы полностью готовы к написанию кода для Пользователя.
Маршрут -> Валидация -> Контроллер -> Модель базы данных.

1. FR011, FR015.
   User Mongoose Model (src/models/User.ts):
   Поля: name, email (уникальный!), password.
   Настройка скрытия password и трансформация \_id $\rightarrow$ id (FR015).
   Создаем схему пользователя с уникальным email и настраиваем метод toJSON, чтобы автоматически удалять password и переименовывать \_id в id.

2. FR009
   User Zod Schema (src/schemas/userSchema.ts):
   Валидация body для POST и PUT запросов (проверка email, длины пароля и т.д.).
   Описываем правила валидации входящих данных для создания и обновления пользователя (проверка email, минимальная длина пароля).
3. FR009, FR019
   User Controller (src/controllers/users.ts):
   Обработка 5 CRUD операций: getAll, getById, create, update, delete.
   Реализуем 5 функций для CRUD-операций с базой данных.

4. FR009, FR019
   User Routes (src/routes/userRoutes.ts):Подключение validate middleware и проброс запросов в контроллер.
   Связываем эндпоинты, middleware валидации и методы контроллера.
