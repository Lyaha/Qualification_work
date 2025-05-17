// Исправленная версия check-locales.js
const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const { globSync } = require('glob'); // Изменим импорт glob

// Конфигурация
const LOCALES_DIR = path.join(__dirname, 'src/locales');
const REFERENCE_LANG = 'en';
const SEARCH_PATTERNS = ['src/**/*.ts', 'src/**/*.tsx'];

// Утилиты
const getNestedKeys = (obj, prefix = '') => {
  return Object.keys(obj).reduce((keys, key) => {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    if (typeof obj[key] === 'object' && obj[key] !== null) {
      return keys.concat(getNestedKeys(obj[key], fullKey));
    }
    return keys.concat(fullKey);
  }, []);
};

const findMissingKeys = (refKeys, targetKeys) => {
  return refKeys.filter(key => !targetKeys.includes(key));
};

// Основная функция
async function checkLocales() {
  try {
    // Шаг 1: Загрузка эталонного языка
    const refPath = path.join(LOCALES_DIR, `${REFERENCE_LANG}/translation.json`);
    const refContent = JSON.parse(fs.readFileSync(refPath, 'utf8'));
    const refKeys = getNestedKeys(refContent);
    
    console.log(chalk.yellow(`Reference lang (${REFERENCE_LANG}) keys count:`), refKeys.length);

    // Шаг 2: Поиск всех ключей в коде
    const usedKeys = new Set();
    const keyPattern = /t\(\s*['"`]([^'"`]+?)['"`]\s*[),]/g;
    
    const files = globSync(SEARCH_PATTERNS);
    console.log(chalk.yellow('Processing files:'), files.length);

    files.forEach(file => {
      const content = fs.readFileSync(file, 'utf8');
      let match;
      while ((match = keyPattern.exec(content)) !== null) {
        usedKeys.add(match[1]);
      }
    });
    console.log(chalk.yellow('Used keys found:'), usedKeys.size);

    const missingInReference = Array.from(usedKeys).filter(key => !refKeys.includes(key));

    if (missingInReference.length > 0) {
      console.log(chalk.red(`\nMissing in ${REFERENCE_LANG} (used in code but not found in translation):`));
      missingInReference.forEach(key => console.log(`- ${key}`));
    } else {
      console.log(chalk.green(`\nAll used keys exist in ${REFERENCE_LANG} translations`));
    }

    // Шаг 3: Проверка других языков
    const locales = fs.readdirSync(LOCALES_DIR)
      .filter(lang => lang !== REFERENCE_LANG && fs.statSync(path.join(LOCALES_DIR, lang)).isDirectory());

    locales.forEach(lang => {
      const langPath = path.join(LOCALES_DIR, `${lang}/translation.json`);
      const langContent = JSON.parse(fs.readFileSync(langPath, 'utf8'));
      const langKeys = getNestedKeys(langContent);
      
      // Поиск недостающих ключей
      const missing = findMissingKeys(refKeys, langKeys);
      if (missing.length > 0) {
        console.log(chalk.red(`\nMissing keys in ${lang} (${missing.length}):`));
        missing.slice(0, 10).forEach(key => console.log(`- ${key}`));
        if (missing.length > 10) console.log(chalk.gray(`...and ${missing.length - 10} more`));
      } else {
        console.log(chalk.green(`\n${lang}: All keys present`));
      }

      // Поиск лишних ключей
      const extra = findMissingKeys(langKeys, refKeys);
      if (extra.length > 0) {
        console.log(chalk.yellow(`\nExtra keys in ${lang} (${extra.length}):`));
        extra.slice(0, 10).forEach(key => console.log(`- ${key}`));
        if (extra.length > 10) console.log(chalk.gray(`...and ${extra.length - 10} more`));
      }
    });

    // Шаг 4: Поиск неиспользуемых ключей
    const unused = Array.from(refKeys).filter(key => !usedKeys.has(key));
    if (unused.length > 0) {
      console.log(chalk.blue('\nUnused keys:'));
      unused.slice(0, 20).forEach(key => console.log(`- ${key}`));
      if (unused.length > 20) console.log(chalk.gray(`...and ${unused.length - 20} more`));
    } else {
      console.log(chalk.green('\nNo unused keys found'));
    }

  } catch (error) {
    console.error(chalk.red('Error:'), error);
    process.exit(1);
  }
}

checkLocales();