---
description: Deploy static site to GitHub Pages for free hosting
---

# Деплой на GitHub Pages

Этот workflow описывает шаги для публикации статического сайта на GitHub Pages.

## Предварительные условия
- Репозиторий уже существует на GitHub (c:\Users\Maksim\Documents\GitHub\Spanish)
- Все изменения закоммичены и запушены в remote

## Шаги

### 1. Проверить, что все изменения закоммичены
```powershell
cd c:\Users\Maksim\Documents\GitHub\Spanish
git status
```
Если есть незакоммиченные изменения:
```powershell
git add .
git commit -m "Prepare for GitHub Pages deployment"
```

### 2. Запушить изменения на GitHub
```powershell
git push origin main
```
(или `master`, в зависимости от названия ветки)

### 3. Включить GitHub Pages в настройках репозитория
1. Открыть репозиторий на GitHub: https://github.com/YOUR_USERNAME/Spanish
2. Перейти в **Settings** → **Pages** (в левом меню)
3. В секции **Source** выбрать:
   - **Branch**: `main` (или `master`)
   - **Folder**: `/ (root)`
4. Нажать **Save**

### 4. Дождаться деплоя
GitHub автоматически создаст и опубликует сайт. Это занимает 1-3 минуты.
Статус можно посмотреть во вкладке **Actions** репозитория.

### 5. Получить URL сайта
После успешного деплоя сайт будет доступен по адресу:
```
https://YOUR_USERNAME.github.io/Spanish/
```

## Проверка после деплоя
- [ ] Главная страница открывается
- [ ] Навигация работает (Teoría, Práctica)
- [ ] Таблица времён отображается корректно
- [ ] Страницы деталей времён открываются
- [ ] Стили загружаются (тёмная тема, шрифты)

## Возможные проблемы

### Пути к файлам
Если используются абсолютные пути (начинающиеся с `/`), они могут не работать на GitHub Pages, т.к. сайт находится в подпапке `/Spanish/`. 

**Решение**: Убедиться, что все пути относительные (например, `../styles.css` вместо `/styles.css`).

### Кэширование
Если изменения не отображаются:
1. Очистить кэш браузера (Ctrl+Shift+R)
2. Подождать 5 минут и обновить страницу

## Обновление сайта
После любых изменений просто:
```powershell
git add .
git commit -m "Update description"
git push
```
GitHub Pages автоматически пересоберёт сайт.
