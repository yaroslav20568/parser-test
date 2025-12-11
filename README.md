# Parser Project

Проект для парсинга информации с сайта a-parser.com

## Ответы на вопросы

### 1. Регулярное выражение для выбора названий парсеров и их описаний

Для извлечения названий парсеров со страницы https://a-parser.com/wiki/parsers/ используется следующее регулярное выражение:

```javascript
/([A-Za-z0-9_]+(?:::[A-Za-z0-9_]+)+)/
```

Для извлечения описания парсеров со страницы https://a-parser.com/wiki/parsers/ используется следующий алгоритм:

1. Поиск следующего элемента `<p>` среди siblings родителя (начиная с элемента, следующего за элементом с названием парсера)
2. Если не найден — поиск следующего `<p>` через `nextAll('p')`
3. Если всё ещё не найден — поиск `p.text-sm.mt-1` внутри родителя

```javascript
const $parent = $nameEl.parent();
let description = '';

const nameElIndex = $nameEl.index();
const $allChildren = $parent.children();

for (let i = nameElIndex + 1; i < $allChildren.length; i++) {
    const $child = $($allChildren[i]);
    if ($child.is('p')) {
        description = $child.text().trim();
        break;
    }
}

if (!description) {
    const $nextP = $nameEl.nextAll('p').first();
    if ($nextP.length > 0) {
        description = $nextP.text().trim();
    }
}

if (!description) {
    const $description = $parent
        .find('p.text-sm.mt-1, p[class*="text-sm"][class*="mt-1"]')
        .first();
    if ($description.length > 0) {
        description = $description.text().trim();
    }
}
```

### 2. Функция на JavaScript для подсчета слов длиной более 3 символов

Функция для подсчета количества слов на странице https://a-parser.com длиной более 3 символов, без учета HTML тегов и скриптов:

```javascript
const countWordsOnPage = async (url) => {
    const axios = require('axios');
    const cheerio = require('cheerio');
    
    const response = await axios.get(url, {
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        }
    });
    
    const html = response.data;
    const $ = cheerio.load(html);
    
    $('script').remove();
    $('style').remove();
    $('noscript').remove();
    
    const text = $('body').text() || $.text();
    
    const words = text
        .replace(/[^\p{L}\p{N}\s]/gu, ' ')
        .split(/\s+/)
        .filter(word => word.trim().length > 0);
    
    const longWords = words.filter(word => word.length > 3);
    
    return longWords.length;
};
```

## Запуск проекта

### Требования

- Node.js (версия 18 или выше)
- npm или yarn

### Установка зависимостей

```bash
npm install
```

### Запуск

Для запуска проекта в режиме разработки (без компиляции):

```bash
npm run dev
```

Для сборки проекта:

```bash
npm run build
```

Для запуска скомпилированного проекта:

```bash
npm start
```

После выполнения программа сохранит результаты в директории `src/results/`:
- `parsers-info.json` - информация о парсерах
- `words-info.json` - информация о подсчете слов

## Демонстрация

![Демонстрация работы парсера](video/record.gif)

---

# Parser Project

Project for parsing information from a-parser.com website

## Answers to Questions

### 1. Regular Expression for Selecting Parser Names and Their Descriptions

The following regular expression is used to extract parser names from the page https://a-parser.com/wiki/parsers/:

```javascript
/([A-Za-z0-9_]+(?:::[A-Za-z0-9_]+)+)/
```

The following algorithm is used to extract parser descriptions from the page https://a-parser.com/wiki/parsers/:

1. Search for the next `<p>` element among parent siblings (starting from the element following the parser name element)
2. If not found — search for the next `<p>` via `nextAll('p')`
3. If still not found — search for `p.text-sm.mt-1` inside the parent

```javascript
const $parent = $nameEl.parent();
let description = '';

const nameElIndex = $nameEl.index();
const $allChildren = $parent.children();

for (let i = nameElIndex + 1; i < $allChildren.length; i++) {
    const $child = $($allChildren[i]);
    if ($child.is('p')) {
        description = $child.text().trim();
        break;
    }
}

if (!description) {
    const $nextP = $nameEl.nextAll('p').first();
    if ($nextP.length > 0) {
        description = $nextP.text().trim();
    }
}

if (!description) {
    const $description = $parent
        .find('p.text-sm.mt-1, p[class*="text-sm"][class*="mt-1"]')
        .first();
    if ($description.length > 0) {
        description = $description.text().trim();
    }
}
```

### 2. JavaScript Function for Counting Words Longer Than 3 Characters

Function for counting the number of words on the page https://a-parser.com longer than 3 characters, excluding HTML tags and scripts:

```javascript
const countWordsOnPage = async (url) => {
    const axios = require('axios');
    const cheerio = require('cheerio');
    
    const response = await axios.get(url, {
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        }
    });
    
    const html = response.data;
    const $ = cheerio.load(html);
    
    $('script').remove();
    $('style').remove();
    $('noscript').remove();
    
    const text = $('body').text() || $.text();
    
    const words = text
        .replace(/[^\p{L}\p{N}\s]/gu, ' ')
        .split(/\s+/)
        .filter(word => word.trim().length > 0);
    
    const longWords = words.filter(word => word.length > 3);
    
    return longWords.length;
};
```

## Running the Project

### Requirements

- Node.js (version 18 or higher)
- npm or yarn

### Installing Dependencies

```bash
npm install
```

### Running

To run the project in development mode (without compilation):

```bash
npm run dev
```

To build the project:

```bash
npm run build
```

To run the compiled project:

```bash
npm start
```

After execution, the program will save results in the `src/results/` directory:
- `parsers-info.json` - parser information
- `words-info.json` - word count information

## Demo

![Parser demo](video/record.gif)
