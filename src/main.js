const path = require('path');
const fs = require('fs');
const ioHook = require('iohook');
const f0talk = require('./shared/index');
const fwgui = require('./fwgui');
const open = require('open');
const { promisify } = require('util');
const { exec } = require('child_process');

const RELEASE = fs.existsSync('RELEASE');

ioHook.on('keydown', e => {
    let ctrlShift = (e.shiftKey << 1) + e.ctrlKey;
    let cmd = f0talk.keyBinds.self[ctrlShift][e.keycode];
    if (cmd)
        f0talk.runCmd(cmd);
    if (f0talk.getPrintNextKey() === true)
        f0talk.setPrintNextKey(e.keycode);
});

ioHook.start();
f0talk.main(require('gtts'), require('play-sound'), fwgui, () => ioHook.unload());

(async () => {
    if (process.argv.includes('-g')) {
        if (!await fwgui.start({ webdir: RELEASE ? path.join(__dirname, '../wgui') : 'wgui', rebuild: !RELEASE, serverPort: 8080, clientPort: RELEASE ? 8080 : 8000, chromePath: f0talk.config.self.chrome_path }))
            console.log('Failed to open GUI');
        fwgui.expose('openMyGitHub', () => open('https://github.com/foresteam/F0Talk'));
        fwgui.expose('runCmd', async raw => await f0talk.runCmd(raw, false));
        fwgui.expose('getConfig', () => f0talk.config.self);
        fwgui.expose(f0talk.getMPVDeviceList);
        fwgui.expose(async function chooseFile() {
            let { stdout: path } = await promisify(exec)('zenity --file-selection');
            return path;
        });
        
        fwgui.endExpose();
    }
})();