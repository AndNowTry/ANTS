# ANTS (по факту не имеет название) )

Данный проект был предан идеи пройти учебную практику. 
В нем представлена базовая связь LibreOffice как движка конвертации 
и UI управления для удобства использования в веб пространстве.

В наличие имеются:
- Уровни юзеров, а также варианты их использования в проекте и тестовой системы оплаты.
  | Возможность | Гость | User | Professional | API |
  |:---|:---:|:---:|:---:|:---:|
  | Макс. файлов за раз | 1 | 1 | 6 | 1 |
  | Макс. размер файла | 100 MB | 250 MB | 500 MB | 250 MB |
  | Очередь | Общая | Приоритетная | Приоритетная | Приоритетная |
  | Параллельная обработка | ❌ | ❌ | ✅ | ❌ |
  | История конвертаций | ❌ | ✅ | ✅ | ✅ |
  | API доступ | ❌ | ❌ | ✅ | ✅ |
  | Подписка | ❌ | ✅ | ✅ | ✅ |
- Конвертация через API с поддержкой ключей. Примеры интеграции на Python, Go, Java, C#, PHP с поллингом статуса через SSE.
- Конвертация через веб-интерфейс.

## Стек технологий
- Язык: Python, JavaScript
- Фреймворки: Django REST Framework, Vue3, Vuetify3
- БД: SQLite
- Очередь задач: Celery + Redis
- Конвертация: LibreOffice, FFmpeg, Pillow
- Авторизация: JWT (httpOnly cookies)

## Локальный запуск
- Клонировать репозиторий
- Запустить Docker Desktop
- docker-compose up --build
- Применить миграции
- Создать суперпользователя





 
# ANTS (actually unnamed) )

This project was dedicated to the idea of educational internship.
It presents the basic connection between LibreOffice as a conversion engine
and a control UI for ease of use in the web-space.

The following features are available:
- User levels, as well as options for their use in the project and a test payment system.
- Conversion via API with API key support. Integration examples in Python, Go, Java, C#, and PHP with status polling via SSE.
- Conversion via web-interface.

## Tech Stack
- Language: Python, JavaScript
- Frameworks: Django REST Framework, Vue3, Vuetify3
- Database: SQLite
- Task queue: Celery + Redis
- Conversion: LibreOffice, FFmpeg, Pillow
- Authentication: JWT (httpOnly cookies)