# F0Talk - an advanced soundboard
## What's it?
This app is an advanced soundboard, that allows you not just to stream sounds but even to "voice chat" through terminal using GTTS. It can play sounds from a file, or an URL. The URL should be pointing to YouTube.com (MPV requires youtube-dl for this), or it should point to a file directly. Basically, the application may be used just in terminal (launch it without -g) as the GUI is just a shell.

Tested on:
* Windows 10 x64
* Linux 5.11.10-1-MANJARO x64

## Installation
Download distribution from "releases" section. Install Google Chrome.

#### Windows:
1. Install MS Visual C++ Redists from **msvcr** folder.
2. Optionally. Install and configure a [virtual cable](https://vb-audio.com/Cable/) and/or a [virtual mixer](https://vb-audio.com/Voicemeeter/).
3. Run **F0Talk.exe** itself, or **F0Talk GUI.bat**.

#### Linux: 
1. Install **mpv**, **libxkbcommon-x11** via pacman, apt or whatever.
2. Optionally. Install **youtube-dl**, if you want to play sounds directly from YouTube (that may be much slower than using local files).
3. Optionally. Install **zenity** or **kdialog** (depends on your DE), if you want to use GUI file picker.
4. Then, you have to deal with audio. You can run **vsink_t.sh** to get temporal VSink. If you want these changes to be permanent, you have to append the contents of **vsink.txt** to **/etc/pulse/default.pa**.
5. To start in GUI mode, use "-g" parameter.

Now you can simply select the desired audio output through the GUI of the app. On Linux, you can also control sound via **pavucontrol** (for example, use "auto" as input in another program as set its monitor as an output of F0Talk).

## Usage short tour
See in the app in "About" tab

## Build
1. Install Node.JS 14.15.3 and Yarn.
2. Install all dependencies by running the following command in **the root of the repository** and in **dev_wgui** folder:
```
yarn
```

### Debug
In **dev_wgui**, run:
```
yarn serve
```
In **the root of the repository**, run (-g is for GUI):
```
yarn start -g
```

### Release
In **dev_wgui**, run:
```
yarn build
```
In **the root of the repository**, run:

For building **for** Linux **under** Linux:
```
yarn build
```
For building **for** Windows **under** Linux:
```
yarn build-win
```
For building **for** Windows **under** Windows:
```
yarn winbuild
```