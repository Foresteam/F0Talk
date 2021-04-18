module.exports = {
    invalidLang: ['Error. Invalid command or unsupported language passed: ', 'Ошибка. Не верная команда или язык переданы: '],
    aTool: ['An advanced soundboard', 'Продвинутый soundboard'],
    cmd_play: ['Play a sound from file or URL', 'Проиграть звук из файла или URL'],
    cmd_skip: ['Skip current playing', 'Пропустить трек'],
    cmd_stop: ['Clear the queue and drop current playing. Stops async tracks too', 'Очистить очередь и остановить воспроизведение. Распространяется и на асинхронные треки'],
    cmd_binds: ['List all binds', 'Вывести все бинды'],
    cmd_kbinds: ['List all kbinds', 'Вывести список всех биндов на горячие клавиши'],
    cmd_bind: ['Make a shortcut (alias)', 'Сделать сокращение команд(ы)'],
    cmd_unbind: ['Remove a shortcut (alias)', 'Удалить сокращение'],
    cmd_kbind: ['Make a key bind', 'Добавить бинд на горячую клавишу'],
    cmd_kunbind: ['Remove a key bind', 'Удалить бинд с горячей клавиши'],
    cmd_getkey: ['Print next pressed key', 'Вывести следующую нажатую клавишу'],
    cmd_set: ['Set a value in the config file', 'Задать параметр в конфигурационном файле'],
    'cmd_?set': ['Set a value in config file if unset', 'Задать параметр в конфигурационном файле, если не задан'],
    cmd_cfghelp: ['Show config help', 'Показать помощь по конфигурационному файлу'],
    cmd_help: ['Help', 'Помощь'],
    cmd_tts: ['Default behavior. Text To Speech, in the given language', 'Стандартное поведение. Text To Speech'],

    leaveEmptyToSeeAll: ['leave empty to see all', 'оставьте пустым, чтобы увидеть всё'],
    langAnyText: ['<lang> <any text>', '<язык> <любой текст>'],
    cfg_v: ['Player default volume, %', 'Стандартная громкость воспроизведения, %'],
    cfg_tv: ['Player temporal volume, %. Affects the next sound, overrides "v"', 'Временная громкость, %. Срабатывает единажды. Перекрывает "v"'],
    cfg_device: ['Audio output device', 'Устройство выхода звука'],
    cfg_chrome_path: ['Path to Google Chrome. Do not touch this, if the GUI works', 'Путь до Google Chrome. Не трогайте, если GUI работает'],
    cfg_async: ['The next sound will bypass the queue', 'Обход очереди проигрывания, один раз'],
    cfg_lang: ['Interface language. "false" for English, "true" for Russian', 'Язык интерфейса. "false" - для английского, а "true" - для русского'],

    example: ['Example', 'Пример'],
    add: ['Add', 'Добавить'],
    clear: ['Clear', 'Очистить'],
    shortcut: ['Shortcut', 'Сокращение'],
    command: ['Command', 'Команда'],
    edit: ['Edit', 'Изменить'],
    remove: ['Remove', 'Удалить'],
    run: ['Run', 'Запустить'],
    welcomeTo: ['Welcome to', 'Добро пожаловать в'],
    aboutTab: ['About', 'О программе'],
    close: ['Close', 'Закрыть'],
    grabbed: ['Grabbed', 'Захвачено'],
    commands: ['Commands', 'Команды'],

    mainSettingsTab: ['Main settings', 'Основные настройки'],
    commandShortcutsTab: ['Command shortcuts', 'Сокращения команд'],
    hotkeysTab: ['Hotkeys', 'Горячие клавиши'],
    device: ['Output audio device', 'Выходное аудио устройство'],
    popupText: ['The result popup is being shown only when a command returns something.', 'Окно с результатом показывается только когда команда что-то возвращает.'],
    execResult: ['Execution result', 'Результат выполнения'],
    interpretedLabel_0: ['Enter a command.', 'Введите команду.'],
    interpretedLabel_1: [' Help: ', ' Помощь: '],
    grabHotkey: ['Grab a hotkey', 'Захватить клавишу'],
    pressKey: ['Press the key you want to grab...', 'Нажмите клавишу, которую хотите захватить...'],
    shortcutExample: ['. Example: shift+28', '. Пример: shift+28'],
    thisAppIs: [
        'This app is an advanced soundboard, that allows you not just to stream sounds but even to "voice chat" through terminal using GTTS. It can play sounds from a file, or an URL. The URL should be pointing to YouTube.com (MPV requires youtube-dl for this), or it should point to a file directly.',
        'Это приложение является продвинутым Soundboard\'ом, позволяющим не просто проигрывать звуки в микрофон, но и "на лету" транслировать текст, преобразованный в речь через GTTS, в указанный в настройках выход звука. Программа может проигрывать звуки как из файлов, так и по URL. Но URL должна быть на YouTube.com (MPV требует для этого youtube-dl) или быть прямой ссылкой на файл.'
    ],
    isFor: [
        'Basically, the application may be used just in terminal (launch it without -g) as the GUI is just a shell.',
        'Вообще, приложение может быть использовано и только из терминала, так как GUI - лишь оболочка.'
    ],
    shortTour: ['Short tour', 'Краткий экскурс'],
    shortTourR: [
        [
            'use "play" to play a sound from file or url',
            '"<lang>" is for TTS (it uses GTTS to say text, language aliases come from Google too)',
            'the hidden commands "e" (us layout) and "р" (Russian layout) are for TTS in English and Russian',
            '"bind" to bind a command to another command or a command sequence, so you can access it easier',
            '"kbind" to bind a command to a key'
        ],
        [
            'используйте "play" чтобы проиграть звук из файла или url',
            '"<lang>" - для TTS (использует GTTS, чтобы переводить текст в речь, аббревиатуры языков тоже из Google)',
            'скрытые команды "e" (us раскладка) и "р" (русская раскладка) - для TTS на английском и русском, соответственно',
            '"bind" нужна для создания новой команды, которая выполняет другую команду, или последовательность. Таким образом вместо 10 команд с 20 аргументами можно прописать лишь одно слово',
            '"kbind" привязка горячей клавишы к команде или последовательности команд'
        ]
    ],
    shortTourExample: [
        [
            'Command "set tv 150; e Hello world!" says the text in English with aplified volume (config parameter tv does this)',
            'Command "ru Привет мир!" says the text in Russian',
            'And "р Привет мир!" does the same as the one above, \'cause it\'s an alias to ru locale'
        ],
        [
            'Команда "set tv 150; e Hello world!" произносит данную фразу на английском с увеличенной громкостью (это делает параметр конфига tv)',
            'Команда "ru Привет мир!" говорит эту фразу на русском',
            'При этом, "р Привет мир!" делает то же самое. То есть, "р" является псевдонимом названием локали ru.'
        ]
    ],
    shortTourExamples: [
        'Usage examples',
        'Примеры использования'
    ]
};