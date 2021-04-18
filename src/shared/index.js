const readline = require('readline');
const { exec } = require('child_process');
let GTTS;
const fs = require('fs');
const { ArgParser, Command } = require('../cmd-argparse');
const os = require('os');
const { promisify } = require('util');

const locales = require('./locales');

const MPV = os.platform() == 'linux' ? 'mpv' : 'mpv\\mpv.exe';
const Reset = '\x1b[0m', Bright = '\x1b[1m', Dim = '\x1b[2m', Underscore = '\x1b[4m', Blink = '\x1b[5m', Reverse = '\x1b[7m', Hidden = '\x1b[8m', FgBlack = '\x1b[30m', FgRed = '\x1b[31m', FgGreen = '\x1b[32m', FgYellow = '\x1b[33m', FgBlue = '\x1b[34m', FgMagenta = '\x1b[35m', FgCyan = '\x1b[36m', FgWhite = '\x1b[37m', BgBlack = '\x1b[40m', BgRed = '\x1b[41m', BgGreen = '\x1b[42m', BgYellow = '\x1b[43m', BgBlue = '\x1b[44m', BgMagenta = '\x1b[45m', BgCyan = '\x1b[46m', BgWhite = '\x1b[47m';
const APPDATA = os.platform() == 'linux' ? os.homedir() + '/.config/f0talk/' : '';
const CACHEDIR = os.platform() == 'linux' ? os.homedir() + '/.cache/f0talk/' : 'cache/';
const CACHE = CACHEDIR + 'cache.json';
const SHORTCUTS = APPDATA + 'shortcuts.json';
const KEYBINDS = APPDATA + 'keybinds.json';
const CONFIG = APPDATA + 'config.json';

const loc = name => locales[name][+config.self.lang];

let sound;

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
const argsParser = new ArgParser('', false);
const cin = text => new Promise(resolve => rl.question(text, resolve));

class Config {
    constructor(fn, defval = {}) {
        this.fn = fn;
        this.defval = defval;
        fs.watchFile(this.fn, (curr, prev) => {
            if (this.wasSaved)
                this.wasSaved = false;
            else
                this.load();
        });
        this.load();
    }
    load() {
        try { this.self = JSON.parse(fs.readFileSync(this.fn, 'utf-8')); } catch { this.self = this.defval; }
    }
    save() {
        this.wasSaved = true;
        fs.writeFileSync(this.fn, JSON.stringify(this.self));
    }
};

try { APPDATA && fs.mkdirSync(APPDATA); } catch {}
try { fs.mkdirSync(CACHEDIR); } catch {}

const q = [];
const commands = [];
let inq = false;
let lastAudio, asyncAudios = [];
const cfgHelp = {
    v: () => loc('cfg_v'),
    tv: () => loc('cfg_tv'),
    device: () => loc('cfg_device'),
    chrome_path: () => loc('cfg_chrome_path'),
    async: () => loc('cfg_async'),
    lang: () => loc('cfg_lang')
};
const config = new Config(CONFIG, {
    v: '100',
    tv: false,
    device: '',
    chrome_path: undefined,
    lang: false
});
const shortcuts = new Config(SHORTCUTS);
const cache = new Config(CACHE, []);
const keyBinds = new Config(KEYBINDS, [
    { }, // plain
    { }, // ctrl
    { }, // shift,
    { } // ctrl + shift
]);

const doq = async async => {
    if (q.length == 0 || inq && !async)
        return;
    if (!async)
        inq = true;
    const { lang, text, tconfig } = q.splice(0, 1)[0];
    // console.log(async, text);

    let _config = tconfig || config.self;
    // console.log(tconfig, config);

    let vol = _config.tv || _config.v;
    let cached = cache.self.findIndex(v => v.toLowerCase() == lang.toLowerCase() + ' ' + text.toLowerCase());

    const params = { mpv: ['--no-video', '--volume=' + vol] };
    if (_config.device)
        params.mpv.push('--audio-device=' + _config.device);
    config.self = _config;
    if (config.self.tv && (!async || !inq)) {
        config.self.tv = false;
        config.save();
    }

    let sp = (...prs) => {
        let t = sound.play(...prs);
        if (async)
            asyncAudios.push(t);
        else
            lastAudio = t;
    }

    if (lang == 'play' || cached > -1)
        await new Promise(resolve => sp(cached > -1 ? CACHEDIR + cached + '.mp3' : text, params, resolve));
    else {
        try {
            let gtts = new GTTS(text, lang);
            let name = CACHEDIR + cache.self.length + '.mp3';
            await new Promise(resolve => gtts.save(name, resolve));
            // await new Promise(resolve => gtts(cmd, false).save(name, text, resolve));
            await new Promise(resolve => sp(name, params, resolve));
            cache.self.push(lang + ' ' + text);
            cache.save();
        } catch (e) { console.log(locales.invalidLang[+config.self.lang], FgRed, e.stack) }
    }
    if (!async) {
        inq = false;
        doq();
    }
};

const getMPVDeviceList = () => new Promise(resolve => exec(`${MPV} --audio-device=help`, (e, stdout, strerr) => {
    stdout = stdout.split('\n');
    stdout.splice(0, 1);
    stdout.splice(stdout.length - 1, 1);
    stdout = stdout.map(v => (new RegExp(/'.*'/).exec(v) || '').toString().split('\'').join(''));
    resolve(stdout);
}));

const runCmd = async (raw, _console = true) => {
    let output = [];
    if (raw.startsWith('bind') || raw.startsWith('kbind'))
        raw = [raw];
    else
        raw = raw.split(';');
    for (let _raw of raw) {
        _raw = _raw.trim();
        const parsed = argsParser.parse(_raw, commands);
        if (parsed)
            output = output.concat(await parsed.cmd.execute({ _raw, args: parsed.args, refwith: parsed.refwith }));
    }
    if (!_console)
        return output;
    for (let v of output)
        if (v)
            console.log(v);
};

const main = async (_GTTS, _sound) => {
    GTTS = _GTTS;
    sound = _sound({ player: MPV });
    console.log(`${FgWhite}${loc('welcomeTo')} ${FgBlue}F0Talk${FgWhite}. ${loc('aTool')}.`);
    while (true)
        runCmd(await cin(FgCyan + '> ' + FgWhite));
};
let printNextKey = false;

commands.push(new Command(
    ['play', 'p'],
    [
        { type: '...string', name: 'filename' }
    ],
    () => loc('cmd_play'),
    async ({text, args}) => {
        let async = config.self.async;
        config.self.async = false;
        let tconfig = {};
        Object.assign(tconfig, config.self);
        const tobj = { lang: 'play', text: args.filename.join(' '), tconfig };
        if (!async)
            q.push(tobj);
        else
            q.splice(0, 0, tobj);
        doq(async);
    }
));
commands.push(new Command(
    ['skip'],
    [],
    () => loc('cmd_skip'),
    async ({text, args}) => {
        if (lastAudio)
            lastAudio.kill();
    }
));
commands.push(new Command(
    ['stop'],
    [],
    () => loc('cmd_stop'),
    async ({text, args}) => {
        q.splice(0, q.length);
        if (lastAudio)
            lastAudio.kill();
        for (let v of asyncAudios)
            v.kill();
        asyncAudios.splice(0, asyncAudios.length);
    }
));
commands.push(new Command(
    ['binds'],
    [],
    () => loc('cmd_binds'),
    async () => {
        let output = [];
        for (let [k, v] of Object.entries(shortcuts.self))
            output.push(`${k} => ${v}`);
        return output;
    }
));
commands.push(new Command(
    ['kbinds'],
    [],
    () => loc('cmd_kbinds'),
    async () => {
        let output = [];
        let kz = ['', 'ctrl+', 'shift+', 'ctrl+shift+'];
        for (let i in keyBinds.self)
            for (let [k, v] of Object.entries(keyBinds.self[i]))
                output.push(`${kz[i]}${k} => ${v}`);
        return output;
    }
));
commands.push(new Command(
    ['bind'],
    [
        { type: 'string', name: 'shortcut' },
        { type: '...string', name: 'cmd' }
    ],
    () => loc('cmd_bind'),
    async ({text, args}) => {
        shortcuts.self[args.shortcut] = args.cmd.join(' ');
        shortcuts.save();
    }
));
commands.push(new Command(
    ['unbind'],
    [{ type: 'string', name: 'shortcut' }],
    () => loc('cmd_unbind'),
    async ({text, args}) => {
        delete shortcuts.self[args.shortcut];
        shortcuts.save();
    }
));
commands.push(new Command(
    ['kbind'],
    [
        { type: 'string', name: 'keys', desc: () => loc('example').toLowerCase() + ': ctrl+shift+80' },
        { type: '...string', name: 'cmd'}
    ],
    () => loc('cmd_kbind'),
    async ({args}) => {
        let keys = args.keys.split('+');
        let ctrlShift = (keys.includes('shift') << 1) + keys.includes('ctrl');
        keyBinds.self[ctrlShift][parseInt(keys[keys.length - 1])] = args.cmd.join(' ');
        keyBinds.save();
    }
));
commands.push(new Command(
    ['kunbind'],
    [
        { type: 'string', name: 'keys' },
    ],
    () => loc('cmd_kunbind'),
    async ({args}) => {
        let keys = args.keys.split('+');
        let ctrlShift = (keys.includes('shift') << 1) + keys.includes('ctrl');
        delete keyBinds.self[ctrlShift][parseInt(keys[keys.length - 1])];
        keyBinds.save();
    }
));
commands.push(new Command(
    ['getkey', 'pnk', 'nextkey'],
    [],
    () => loc('cmd_getkey'),
    async () => {
        printNextKey = true;
        while (printNextKey === true)
            await promisify(setTimeout)(50);
        let key = printNextKey;
        printNextKey = false;
        return key;
    }
));
commands.push(new Command(
    ['set'],
    [
        { type: 'string', name: 'param' },
        { type: 'string', name: 'value' }
    ],
    () => loc('cmd_set'),
    async ({args}) => {
        if (args.value == 'false')
            args.value = false;
        if (args.value == 'true')
            args.value = true;
        if (args.value == 'null')
            args.value = null;
        if (args.value == 'undefined')
            args.value = undefined;
        config.self[args.param] = args.value;
        config.save();
    }
));
commands.push(new Command(
    ['?set'],
    [
        { type: 'string', name: 'param' },
        { type: 'string', name: 'value' }
    ],
    () => loc('cmd_?set'),
    async ({args}) => {
        if (config.self[args.param])
            return;
        if (args.value == 'false')
            args.value = false;
        if (args.value == 'true')
            args.value = true;
        if (args.value == 'null')
            args.value = null;
        if (args.value == 'undefined')
            args.value = undefined;
        config.self[args.param] = args.value;
        config.save();
    }
));
commands.push(new Command(
    ['cfghelp'],
    [],
    () => loc('cmd_cfghelp'),
    async () => Object.entries(cfgHelp).map(v => `${v[0]} - ${v[1]()}`)
));
commands.push(new Command(
    ['help', '?'],
    [{type: 'string', name: 'command', desc: () => loc('leaveEmptyToSeeAll')}],
    () => loc('cmd_help'),
    async ({msg, args}) => {
        let fs = [];
        if (args.command) {
            for (let com of commands)
                if (com.aliases.indexOf(args.command) >= 0) {
                    fs.push(com.printHelp());
                    break;
                }
        }
        else
            for (let com of commands)
                fs.push(com.printHelp());
        return fs || 'Command not found';
    }
));
commands.push(new Command(
    ['', 'р', 'e'],
    [ { type: '...string', name: 'default', desc: () => loc('langAnyText')} ],
    () => loc('cmd_tts'),
    async ({text, args}) => {
        let [lang, ...txt] = args.default;
        if (lang == 'e') lang = 'en';
        if (lang == 'р') lang = 'ru';
        let alias = shortcuts.self[args.default.join(' ')];
        if (alias)
            await runCmd(alias);
        else {
            let tconfig = {};
            Object.assign(tconfig, config.self);
            q.push({ lang, text: txt.join(' '), tconfig });
            doq();
        }
    }
));

module.exports = {
    main,
    runCmd,
    getMPVDeviceList,
    shortcuts,
    keyBinds,
    cache,
    config,
    CACHEDIR,
    SHORTCUTS,
    CONFIG,
    KEYBINDS,
    getPrintNextKey: () => printNextKey,
    setPrintNextKey: v => printNextKey = v,
    rl
};