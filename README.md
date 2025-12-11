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
