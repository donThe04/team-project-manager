cat > /mnt/user-data/outputs/README.md << 'READMEEOF'
# 📋 TaskFlow — Ứng dụng Quản lý Dự án Nhóm Thời gian Thực

> Ứng dụng quản lý dự án theo phong cách Trello, hỗ trợ cộng tác thời gian thực qua WebSocket, tích hợp rich text editor và phân quyền thành viên.

![Java](https://img.shields.io/badge/Java-17-orange?style=flat-square)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.x-brightgreen?style=flat-square)
![React](https://img.shields.io/badge/React-18-blue?style=flat-square)
![MySQL](https://img.shields.io/badge/MySQL-8.0-blue?style=flat-square)
![WebSocket](https://img.shields.io/badge/WebSocket-STOMP-yellow?style=flat-square)
![Docker](https://img.shields.io/badge/Docker-ready-blue?style=flat-square)

---

## 📌 Mục lục

- [Giới thiệu](#-giới-thiệu)
- [Tính năng](#-tính-năng)
- [Tech Stack](#-tech-stack)
- [Kiến trúc hệ thống](#-kiến-trúc-hệ-thống)
- [Database Schema](#-database-schema)
- [API Documentation](#-api-documentation)
- [Cài đặt & Chạy](#-cài-đặt--chạy)
- [Cấu trúc thư mục](#-cấu-trúc-thư-mục)
- [Biến môi trường](#-biến-môi-trường)
- [Deploy với Docker](#-deploy-với-docker)
- [Tác giả](#-tác-giả)

---

## 🎯 Giới thiệu

**TaskFlow** là ứng dụng quản lý dự án nhóm full-stack, cho phép nhiều thành viên cùng làm việc trên một Kanban board theo thời gian thực. Khi một thành viên kéo thả task hoặc thêm comment, tất cả người dùng đang xem board sẽ thấy cập nhật ngay lập tức mà không cần reload trang.

**Điểm nổi bật:**
- 🔄 **Realtime collaboration** — WebSocket STOMP, zero-reload sync
- 🖊️ **Rich text editor** — Tiptap với bold, italic, code block, image
- 🔐 **Bảo mật JWT** — Access token + phân quyền Owner/Member
- 🐳 **Docker ready** — Chạy toàn bộ stack chỉ với một lệnh

---

## ✨ Tính năng

### Cơ bản
- [x] Đăng ký / Đăng nhập với JWT Authentication
- [x] CRUD Project, Board, Column, Task
- [x] Kéo thả task giữa các cột (Drag & Drop)
- [x] Assign nhiều thành viên vào task
- [x] Deadline + label màu sắc cho task
- [x] Comment trên task
- [x] Rich text editor (Tiptap) cho mô tả task

### Trung bình
- [x] WebSocket realtime — cập nhật board tức thì
- [x] Notification khi được assign, được mention
- [x] Tìm kiếm task theo tên
- [x] Filter theo label, deadline, assignee
- [x] Activity log — ai làm gì, lúc nào
- [x] Upload ảnh đính kèm

### Nâng cao
- [ ] Collaborative text editor (Yjs + Tiptap)
- [ ] Checklist / Subtask trong task
- [ ] Calendar view
- [ ] Dark mode
- [ ] Export task sang PDF

---

## 🛠️ Tech Stack

### Backend
| Công nghệ | Phiên bản | Mục đích |
|---|---|---|
| Java | 17 | Ngôn ngữ chính |
| Spring Boot | 3.x | Framework backend |
| Spring Security | 6.x | Authentication & Authorization |
| Spring WebSocket | 3.x | Realtime STOMP over WebSocket |
| JPA / Hibernate | 6.x | ORM & database access |
| MySQL | 8.0 | Cơ sở dữ liệu chính |
| JWT (jjwt) | 0.12 | Token-based authentication |
| Maven | 3.9 | Build tool |

### Frontend
| Công nghệ | Phiên bản | Mục đích |
|---|---|---|
| React | 18 | UI framework |
| Vite | 5.x | Build tool & dev server |
| Tailwind CSS | 3.x | Utility-first styling |
| react-beautiful-dnd | 13.x | Drag & Drop Kanban |
| Tiptap | 2.x | Rich text editor |
| SockJS + STOMP.js | latest | WebSocket client |
| Axios | 1.x | HTTP client |
| React Router | 6.x | Client-side routing |

### DevOps
| Công nghệ | Mục đích |
|---|---|
| Docker | Container hóa ứng dụng |
| Docker Compose | Orchestrate multi-container |
| Nginx | Serve React build (production) |

---

## 🏗️ Kiến trúc hệ thống

```
┌─────────────────────────────────────────────────────┐
│                   CLIENT LAYER                      │
│   React + Vite  │  Tiptap Editor  │  DnD Board     │
└──────────┬──────────────┬─────────────────┬─────────┘
           │  REST API    │  WebSocket       │
           │  (HTTP/S)    │  (STOMP/SockJS)  │
┌──────────▼──────────────▼──────────────────▼────────┐
│                  BACKEND LAYER                       │
│  Spring Boot 3  │  Spring Security  │  JWT Filter   │
│  REST Controllers  │  WebSocket Broker               │
│  Service Layer  │  JPA Repositories                  │
└──────────────────────────┬──────────────────────────┘
                           │
┌──────────────────────────▼──────────────────────────┐
│                  DATA LAYER                          │
│              MySQL 8.0 Database                      │
│   users │ projects │ boards │ columns │ tasks        │
│   comments │ notifications │ activity_logs           │
└─────────────────────────────────────────────────────┘
```

### Luồng WebSocket

```
Client A kéo task                Client B (cùng board)
      │                                  │
      │── HTTP PUT /tasks/{id}/move ──►  │
      │                                  │
      │       Spring Backend             │
      │   ┌─────────────────────┐        │
      │   │  Cập nhật DB        │        │
      │   │  Broadcast STOMP    │        │
      │   └─────────────────────┘        │
      │                                  │
      │◄── /topic/board/{id} ──────────►│
      │   (cả A và B đều nhận)           │
      │   Board tự re-render             │
```

---

## 🗄️ Database Schema

### Các bảng chính

```sql
-- 1. USERS
CREATE TABLE users (
    id           BIGINT PRIMARY KEY AUTO_INCREMENT,
    username     VARCHAR(50) NOT NULL UNIQUE,
    email        VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    avatar_url   VARCHAR(500),
    created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. PROJECTS
CREATE TABLE projects (
    id          BIGINT PRIMARY KEY AUTO_INCREMENT,
    name        VARCHAR(100) NOT NULL,
    description TEXT,
    owner_id    BIGINT NOT NULL,
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (owner_id) REFERENCES users(id)
);

-- 3. PROJECT_MEMBERS (nhiều-nhiều: users <-> projects)
CREATE TABLE project_members (
    id          BIGINT PRIMARY KEY AUTO_INCREMENT,
    project_id  BIGINT NOT NULL,
    user_id     BIGINT NOT NULL,
    role        ENUM('owner', 'member') DEFAULT 'member',
    joined_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY uk_project_user (project_id, user_id)
);

-- 4. BOARDS
CREATE TABLE boards (
    id          BIGINT PRIMARY KEY AUTO_INCREMENT,
    project_id  BIGINT NOT NULL,
    name        VARCHAR(100) NOT NULL,
    background  VARCHAR(50) DEFAULT '#0079BF',
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
);

-- 5. COLUMNS
CREATE TABLE columns (
    id          BIGINT PRIMARY KEY AUTO_INCREMENT,
    board_id    BIGINT NOT NULL,
    name        VARCHAR(100) NOT NULL,
    position    INT NOT NULL DEFAULT 0,
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (board_id) REFERENCES boards(id) ON DELETE CASCADE
);

-- 6. TASKS
CREATE TABLE tasks (
    id          BIGINT PRIMARY KEY AUTO_INCREMENT,
    column_id   BIGINT NOT NULL,
    title       VARCHAR(255) NOT NULL,
    description LONGTEXT,
    label_color VARCHAR(20),
    priority    ENUM('low','medium','high') DEFAULT 'medium',
    deadline    DATE,
    position    INT NOT NULL DEFAULT 0,
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (column_id) REFERENCES columns(id) ON DELETE CASCADE
);

-- 7. TASK_ASSIGNEES (nhiều-nhiều: tasks <-> users)
CREATE TABLE task_assignees (
    id          BIGINT PRIMARY KEY AUTO_INCREMENT,
    task_id     BIGINT NOT NULL,
    user_id     BIGINT NOT NULL,
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY uk_task_user (task_id, user_id)
);

-- 8. COMMENTS
CREATE TABLE comments (
    id          BIGINT PRIMARY KEY AUTO_INCREMENT,
    task_id     BIGINT NOT NULL,
    user_id     BIGINT NOT NULL,
    content     LONGTEXT NOT NULL,
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 9. ATTACHMENTS
CREATE TABLE attachments (
    id          BIGINT PRIMARY KEY AUTO_INCREMENT,
    task_id     BIGINT NOT NULL,
    file_name   VARCHAR(255) NOT NULL,
    file_url    VARCHAR(500) NOT NULL,
    file_size   BIGINT,
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE
);

-- 10. ACTIVITY_LOGS
CREATE TABLE activity_logs (
    id          BIGINT PRIMARY KEY AUTO_INCREMENT,
    task_id     BIGINT NOT NULL,
    user_id     BIGINT NOT NULL,
    action      VARCHAR(100) NOT NULL,
    detail      TEXT,
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 11. NOTIFICATIONS
CREATE TABLE notifications (
    id          BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id     BIGINT NOT NULL,
    type        VARCHAR(50) NOT NULL,
    message     TEXT NOT NULL,
    is_read     BOOLEAN DEFAULT FALSE,
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

### Quan hệ giữa các bảng

```
users ──────┬──── project_members ────┬──── projects
            │                         │         │
            │                         │         ├──── boards
            │                         │         │         │
            ├──── task_assignees ──── tasks ◄───┴── columns
            │                         │
            ├──── comments ───────────┤
            │                         │
            ├──── activity_logs ───── ┤
            │                         │
            └──── notifications        └──── attachments
```

---

## 📡 API Documentation

> Base URL: `http://localhost:8080/api`
> Authentication: `Bearer <JWT_TOKEN>` trong header `Authorization`

---

### 🔐 Auth API

#### POST `/auth/register` — Đăng ký tài khoản
```json
Request Body:
{
  "username": "nguyenvana",
  "email": "vana@gmail.com",
  "password": "Password123!"
}

Response 201:
{
  "message": "Đăng ký thành công",
  "userId": 1
}
```

#### POST `/auth/login` — Đăng nhập
```json
Request Body:
{
  "email": "vana@gmail.com",
  "password": "Password123!"
}

Response 200:
{
  "token": "eyJhbGciOiJIUzI1NiJ9...",
  "userId": 1,
  "username": "nguyenvana",
  "email": "vana@gmail.com",
  "avatarUrl": null
}
```

#### GET `/auth/me` — Lấy thông tin user hiện tại
```json
Response 200:
{
  "id": 1,
  "username": "nguyenvana",
  "email": "vana@gmail.com",
  "avatarUrl": "https://..."
}
```

---

### 📁 Project API

#### GET `/projects` — Lấy danh sách project của tôi
```json
Response 200:
[
  {
    "id": 1,
    "name": "Đồ án CNPM",
    "description": "Dự án quản lý công việc nhóm",
    "ownerId": 1,
    "role": "owner",
    "memberCount": 4,
    "createdAt": "2025-05-01T08:00:00"
  }
]
```

#### POST `/projects` — Tạo project mới
```json
Request Body:
{
  "name": "Đồ án CNPM",
  "description": "Dự án quản lý công việc nhóm"
}

Response 201:
{
  "id": 1,
  "name": "Đồ án CNPM",
  "ownerId": 1,
  "createdAt": "2025-05-01T08:00:00"
}
```

#### GET `/projects/{id}` — Lấy chi tiết project
#### PUT `/projects/{id}` — Cập nhật project
#### DELETE `/projects/{id}` — Xoá project (chỉ owner)

#### POST `/projects/{id}/members` — Mời thành viên
```json
Request Body:
{
  "email": "thanhb@gmail.com",
  "role": "member"
}
```

#### DELETE `/projects/{id}/members/{userId}` — Xoá thành viên
#### GET `/projects/{id}/members` — Lấy danh sách thành viên

---

### 📋 Board API

#### GET `/projects/{projectId}/boards` — Lấy danh sách board
```json
Response 200:
[
  {
    "id": 1,
    "name": "Sprint 1",
    "background": "#0079BF",
    "projectId": 1,
    "createdAt": "2025-05-01T08:00:00"
  }
]
```

#### POST `/projects/{projectId}/boards` — Tạo board mới
```json
Request Body:
{
  "name": "Sprint 1",
  "background": "#0079BF"
}
```

#### GET `/boards/{id}` — Lấy board kèm columns và tasks
```json
Response 200:
{
  "id": 1,
  "name": "Sprint 1",
  "columns": [
    {
      "id": 1,
      "name": "To Do",
      "position": 0,
      "tasks": [
        {
          "id": 1,
          "title": "Thiết kế database",
          "labelColor": "#FF5733",
          "priority": "high",
          "deadline": "2025-05-15",
          "position": 0,
          "assignees": [
            { "id": 1, "username": "nguyenvana", "avatarUrl": null }
          ]
        }
      ]
    }
  ]
}
```

#### PUT `/boards/{id}` — Cập nhật board
#### DELETE `/boards/{id}` — Xoá board

---

### 📂 Column API

#### POST `/boards/{boardId}/columns` — Tạo cột mới
```json
Request Body:
{
  "name": "In Progress"
}
```

#### PUT `/columns/{id}` — Đổi tên cột
```json
Request Body:
{
  "name": "Doing"
}
```

#### PUT `/columns/reorder` — Sắp xếp lại thứ tự cột
```json
Request Body:
{
  "boardId": 1,
  "columnIds": [3, 1, 2]
}
```

#### DELETE `/columns/{id}` — Xoá cột

---

### ✅ Task API

#### POST `/columns/{columnId}/tasks` — Tạo task mới
```json
Request Body:
{
  "title": "Thiết kế database",
  "description": "<p>Thiết kế ERD cho toàn bộ hệ thống</p>",
  "labelColor": "#FF5733",
  "priority": "high",
  "deadline": "2025-05-15"
}

Response 201:
{
  "id": 1,
  "title": "Thiết kế database",
  "columnId": 1,
  "position": 0,
  "priority": "high",
  "deadline": "2025-05-15",
  "createdAt": "2025-05-01T08:00:00"
}
```

#### GET `/tasks/{id}` — Lấy chi tiết task (kèm comments, assignees, attachments)
```json
Response 200:
{
  "id": 1,
  "title": "Thiết kế database",
  "description": "<p>Thiết kế ERD...</p>",
  "labelColor": "#FF5733",
  "priority": "high",
  "deadline": "2025-05-15",
  "columnId": 1,
  "assignees": [...],
  "comments": [...],
  "attachments": [...],
  "activityLogs": [...]
}
```

#### PUT `/tasks/{id}` — Cập nhật task
```json
Request Body:
{
  "title": "Thiết kế database schema",
  "description": "<p>Cập nhật ERD...</p>",
  "labelColor": "#33FF57",
  "priority": "medium",
  "deadline": "2025-05-20"
}
```

#### PUT `/tasks/{id}/move` — Di chuyển task (sau khi kéo thả)
```json
Request Body:
{
  "targetColumnId": 2,
  "newPosition": 1
}
```

#### PUT `/tasks/reorder` — Sắp xếp lại task trong cột
```json
Request Body:
{
  "columnId": 1,
  "taskIds": [3, 1, 2]
}
```

#### DELETE `/tasks/{id}` — Xoá task

#### POST `/tasks/{id}/assignees` — Assign thành viên
```json
Request Body:
{
  "userId": 2
}
```

#### DELETE `/tasks/{id}/assignees/{userId}` — Bỏ assign thành viên

---

### 💬 Comment API

#### GET `/tasks/{taskId}/comments` — Lấy danh sách comment
```json
Response 200:
[
  {
    "id": 1,
    "content": "<p>Đã xong phần users và projects</p>",
    "author": {
      "id": 1,
      "username": "nguyenvana",
      "avatarUrl": null
    },
    "createdAt": "2025-05-01T10:00:00"
  }
]
```

#### POST `/tasks/{taskId}/comments` — Thêm comment
```json
Request Body:
{
  "content": "<p>Đã xong phần users và projects</p>"
}
```

#### PUT `/comments/{id}` — Sửa comment (chỉ chủ comment)
#### DELETE `/comments/{id}` — Xoá comment

---

### 📎 Attachment API

#### POST `/tasks/{taskId}/attachments` — Upload file đính kèm
```
Content-Type: multipart/form-data
Body: file (binary)
```

#### DELETE `/attachments/{id}` — Xoá file đính kèm

---

### 🔔 Notification API

#### GET `/notifications` — Lấy danh sách thông báo
```json
Response 200:
[
  {
    "id": 1,
    "type": "ASSIGNED",
    "message": "nguyenvana đã assign bạn vào task 'Thiết kế database'",
    "isRead": false,
    "createdAt": "2025-05-01T10:00:00"
  }
]
```

#### PUT `/notifications/{id}/read` — Đánh dấu đã đọc
#### PUT `/notifications/read-all` — Đánh dấu tất cả đã đọc

---

### 🔍 Search & Filter API

#### GET `/boards/{boardId}/tasks/search?q={keyword}` — Tìm kiếm task
#### GET `/boards/{boardId}/tasks/filter?label={color}&assignee={userId}&deadline={date}` — Filter task

---

### 📊 Activity Log API

#### GET `/tasks/{taskId}/activity` — Lấy lịch sử hoạt động của task
```json
Response 200:
[
  {
    "id": 1,
    "action": "MOVED",
    "detail": "Di chuyển từ 'To Do' sang 'In Progress'",
    "user": { "id": 1, "username": "nguyenvana" },
    "createdAt": "2025-05-01T10:00:00"
  }
]
```

---

### 🔌 WebSocket Endpoints

> Kết nối: `ws://localhost:8080/ws` (SockJS fallback)

#### Subscribe (nhận message)

| Topic | Mô tả |
|---|---|
| `/topic/board/{boardId}` | Nhận mọi cập nhật của board |
| `/user/queue/notifications` | Nhận notification cá nhân |

#### Publish (gửi message)

| Destination | Mô tả |
|---|---|
| `/app/board/{boardId}/task-moved` | Thông báo kéo thả task |
| `/app/board/{boardId}/task-created` | Thông báo tạo task mới |
| `/app/board/{boardId}/comment-added` | Thông báo comment mới |

#### Message format mẫu

```json
{
  "type": "TASK_MOVED",
  "payload": {
    "taskId": 1,
    "fromColumnId": 1,
    "toColumnId": 2,
    "newPosition": 0,
    "movedBy": {
      "id": 1,
      "username": "nguyenvana"
    }
  }
}
```

---

## 🚀 Cài đặt & Chạy

### Yêu cầu hệ thống

- Java 17+
- Node.js 18+
- MySQL 8.0+
- Maven 3.9+

### 1. Clone project

```bash
git clone https://github.com/username/taskflow.git
cd taskflow
```

### 2. Cài đặt Database

```bash
mysql -u root -p
CREATE DATABASE taskflow_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
exit;
```

### 3. Cấu hình Backend

```bash
cd backend
cp src/main/resources/application.example.properties src/main/resources/application.properties
```

Chỉnh sửa `application.properties`:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/taskflow_db
spring.datasource.username=root
spring.datasource.password=your_password
jwt.secret=your_jwt_secret_key_min_32_chars
jwt.expiration=86400000
```

Chạy backend:

```bash
mvn spring-boot:run
```

Backend chạy tại: `http://localhost:8080`

### 4. Cài đặt Frontend

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

Frontend chạy tại: `http://localhost:5173`

### 5. Tài khoản test

```
Email: admin@taskflow.com
Password: Admin123!
```

---

## 📁 Cấu trúc thư mục

```
taskflow/
├── backend/                          # Spring Boot
│   ├── src/main/java/com/taskflow/
│   │   ├── config/
│   │   │   ├── SecurityConfig.java   # JWT + Spring Security
│   │   │   └── WebSocketConfig.java  # STOMP configuration
│   │   ├── controller/
│   │   │   ├── AuthController.java
│   │   │   ├── ProjectController.java
│   │   │   ├── BoardController.java
│   │   │   ├── ColumnController.java
│   │   │   ├── TaskController.java
│   │   │   ├── CommentController.java
│   │   │   └── NotificationController.java
│   │   ├── service/
│   │   │   ├── AuthService.java
│   │   │   ├── ProjectService.java
│   │   │   ├── BoardService.java
│   │   │   ├── TaskService.java
│   │   │   └── WebSocketService.java
│   │   ├── repository/
│   │   │   ├── UserRepository.java
│   │   │   ├── TaskRepository.java
│   │   │   └── ...
│   │   ├── entity/
│   │   │   ├── User.java
│   │   │   ├── Project.java
│   │   │   ├── Board.java
│   │   │   ├── Column.java
│   │   │   ├── Task.java
│   │   │   └── ...
│   │   ├── dto/
│   │   │   ├── request/
│   │   │   └── response/
│   │   ├── security/
│   │   │   ├── JwtUtil.java
│   │   │   └── JwtAuthFilter.java
│   │   └── websocket/
│   │       └── BoardWebSocketController.java
│   ├── src/main/resources/
│   │   └── application.properties
│   └── pom.xml
│
├── frontend/                         # React + Vite
│   ├── src/
│   │   ├── components/
│   │   │   ├── Board/
│   │   │   │   ├── Board.jsx         # Kanban board chính
│   │   │   │   ├── Column.jsx        # Cột
│   │   │   │   └── TaskCard.jsx      # Card task
│   │   │   ├── Task/
│   │   │   │   ├── TaskModal.jsx     # Modal chi tiết task
│   │   │   │   ├── TaskEditor.jsx    # Tiptap rich text
│   │   │   │   └── CommentBox.jsx    # Comment section
│   │   │   ├── Notification/
│   │   │   │   └── NotificationBell.jsx
│   │   │   └── common/
│   │   ├── pages/
│   │   │   ├── LoginPage.jsx
│   │   │   ├── RegisterPage.jsx
│   │   │   ├── ProjectsPage.jsx
│   │   │   └── BoardPage.jsx
│   │   ├── hooks/
│   │   │   ├── useWebSocket.js       # STOMP connection hook
│   │   │   └── useBoard.js
│   │   ├── services/
│   │   │   ├── api.js                # Axios instance
│   │   │   ├── authService.js
│   │   │   └── taskService.js
│   │   ├── store/
│   │   │   └── authStore.js          # Zustand store
│   │   └── App.jsx
│   ├── .env.example
│   └── package.json
│
├── docker-compose.yml
├── README.md
└── .gitignore
```

---

## 🔧 Biến môi trường

### Backend (`application.properties`)

```properties
# Database
spring.datasource.url=jdbc:mysql://localhost:3306/taskflow_db
spring.datasource.username=root
spring.datasource.password=

# JPA
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=false

# JWT
jwt.secret=taskflow_secret_key_must_be_at_least_32_chars
jwt.expiration=86400000

# File upload
spring.servlet.multipart.max-file-size=10MB
spring.servlet.multipart.max-request-size=10MB
file.upload-dir=./uploads
```

### Frontend (`.env`)

```env
VITE_API_URL=http://localhost:8080/api
VITE_WS_URL=http://localhost:8080/ws
```

---

## 🐳 Deploy với Docker

### Chạy toàn bộ stack

```bash
docker-compose up --build
```

### `docker-compose.yml`

```yaml
version: '3.8'

services:
  mysql:
    image: mysql:8.0
    environment:
      MYSQL_DATABASE: taskflow_db
      MYSQL_ROOT_PASSWORD: taskflow123
    ports:
      - "3306:3306"
    volumes:
      - mysql_data:/var/lib/mysql

  backend:
    build: ./backend
    ports:
      - "8080:8080"
    environment:
      SPRING_DATASOURCE_URL: jdbc:mysql://mysql:3306/taskflow_db
      SPRING_DATASOURCE_USERNAME: root
      SPRING_DATASOURCE_PASSWORD: taskflow123
    depends_on:
      - mysql

  frontend:
    build: ./frontend
    ports:
      - "80:80"
    depends_on:
      - backend

volumes:
  mysql_data:
```

Sau khi chạy:
- Frontend: `http://localhost`
- Backend API: `http://localhost:8080`

---

## 👨‍💻 Tác giả

| Họ tên | MSSV | Vai trò |
|---|---|---|
| Nguyễn Văn A | 2100000 | Fullstack Developer |

**Trường:** Đại học [Tên trường]
**Môn học:** [Tên môn]
**Giáo viên hướng dẫn:** [Tên GV]
**Năm học:** 2024 - 2025

---

## 📄 License

MIT License — feel free to use for learning purposes.
READMEEOF
echo "Done"
