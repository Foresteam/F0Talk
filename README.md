# F0Talk - an advanced soundboard
## What's it?
This app is an advanced soundboard, that allows you not just to stream sounds but even to "voice chat" through terminal using GTTS. It can play sounds from a file, or an URL. The URL should be pointing to YouTube.com (MPV requires youtube-dl for this), or it should point to a file directly. Basically, the application may be used just in terminal (launch it without -g) as the GUI is just a shell.

Tested on:
* Windows 10
* Linux 5.11.10-1-MANJARO

## Installation
Download distribution from "releases" section. Install Google Chrome.

#### Windows:
1. Install VCable https://vb-audio.com/Cable/ 
2. Run **F0Talk.exe** itself, or **F0Talk GUI.bat**

#### Linux: 
1. Install **mpv** via pacman, apt or whatever. You can also install **youtube-dl**, if you want to play sounds directly from YouTube (that may be much slower than using local files).
2. Then, you have to deal with audio. You can run **vsink_t.sh** to get temporal VSink. If you want these changes to be permanent, you have to append the contents of **vsink.txt** to **/etc/pulse/default.pa**.
3. To start in GUI mode, use "-g" parameter.

Now you can simply select the desired audio output through the GUI of the app. On Linux, you can also control sound via **pavucontrol** (for example, use "auto" as program's output an set its monitor as an input of another program).

## Usage short tour
See in the app in "About" tab

## Build
1. Install Node.JS, NPM and Yarn.
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