# Документация разработчика: TacticalUnit

Добро пожаловать в команду разработки веб-платформы для игрового клана Squad. Данный документ поможет вам настроить окружение и запустить проект локально.

---

## Системные требования

Перед началом убедитесь, что у вас установлены следующие инструменты:

* **Node.js**: версия `20.x` или `22.x` (LTS).
* **Пакетный менеджер**: `npm` (идет в комплекте с Node.js).
* **.NET SDK**: версия `9.0`.
* **IDE**: VS Code (для фронтенда) или Visual Studio 2022/2026 (для бэкенда).
* **БД**: PostgreSQL.

---

## Frontend (Client)

Стек: **React + TypeScript + Vite + Tailwind CSS 3**.
Архитектура: **Feature-Sliced Design (FSD)**.

### Настройка и запуск
1. Перейдите в директорию клиента:
   ```bash
   cd Client
   ```
2. Установите все зависимости:
   ```bash
   npm install
   ```
3. Запустите проект в режиме разработки:
   ```bash
   npm run dev
   ```
   *Приложение будет доступно по адресу `http://localhost:5173`.*

### Важные нюансы для разработки
* **Пути (Aliases)**: Используйте префикс `@/` для импортов из папки `src`. Например: `import { Button } from '@/shared/ui'`.
* **Стили**: Мы используем Tailwind CSS. Все кастомные стили и конфигурации находятся в `tailwind.config.ts` и `src/app/styles/index.css`.
* **Структура FSD**: Не забывайте соблюдать изоляцию слоев. Модули из `entities` не могут импортировать ничего из `features` или `widgets`.

---

## Backend (Server)

Стек: **C# ASP.NET Core 9.0 + Entity Framework Core**.
Архитектура: **Layered (Controller-Service-DTO-Entity)**.

### Настройка и запуск
1. Перейдите в директорию сервера:
   ```bash
   cd Server
   ```
2. Восстановите зависимости NuGet:
   ```bash
   dotnet restore
   ```
3. Настройте строку подключения к базе данных в файле `appsettings.Development.json`.
4. Примените миграции для создания базы данных:
   ```bash
   dotnet ef database update
   ```
   *(Если у вас не установлен инструмент EF, выполните: `dotnet tool install --global dotnet-ef`)*
5. Запустите сервер:
   ```bash
   dotnet run
   ```
   *API будет доступно по адресу `https://localhost:7xxx` (см. вывод в консоли). Swagger-документация доступна по пути `/swagger`.*

---

## Командный воркфлоу (Git)

Чтобы проект оставался чистым, придерживайтесь следующих правил:

1. **Ветки**: Создавайте новую ветку для каждой задачи: `feature/task-name` или `fix/issue-name`.
2. **Commit Messages**: Пишите понятные сообщения на английском или русском (согласно договоренности), например: `feat: add user profile page` или `fix: resolve auth token issue`.
3. **Pull Requests**: Перед слиянием в `main` создавайте PR для проверки кода другими участниками.

---

## Полезные команды (Cheat Sheet)

| Задача | Команда (Frontend) | Команда (Backend) |
| :--- | :--- | :--- |
| **Установка** | `npm install` | `dotnet restore` |
| **Запуск** | `npm run dev` | `dotnet run` |
| **Сборка** | `npm run build` | `dotnet build` |
| **Миграции** | — | `dotnet ef migrations add <Name>` |
| **Линтер** | `npm run lint` | — |

---

> !IMPORTANT
> **Секреты и ключи**: Никогда не пушьте файлы `.env` или `appsettings.json` с реальными паролями в репозиторий. Используйте шаблоны `.env.example`.