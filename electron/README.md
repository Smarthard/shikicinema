# shikicinema electron app

Подпроект нативного клиента на `electron`

## Сборка

Прежде, чем начать сборку:

- Установить переменную среды `PLATFORM_TARGET=native-app` и запустить `npm run set-env`
- Либо поправить аналогично поле `target` в файлах angular `environment.ts` и `environment.prod.ts`

Из корня монорепозитория:

1. Прежде, чем генерировать конечную сборку для целевой платформы, необходимо собрать основной проект:
`$ ionic cap sync && npx cap sync @capacitor-community/electron`
2. Для всех целевых платформ: `npm run build -w electron`, либо для выбора конкретной платформы см. скрипты из `package.json`
