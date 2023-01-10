#!/usr/bin/env sh

# Остановить публикацию при ошибках
set -e

# Сборка приложения
npm run build

# Переход в каталог директрории
cd dist

# инициализация репозитория и загрузка кода в GitHub
git init
git add -A
git commit -m 'deploy'
git push -f https://github.com/mrPlotnik/vue-technozavr master:gh-pages

cd -