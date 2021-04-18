var fwgui = {
	Waiting: class Waiting {},
	waitingForReply: {},
	exposed: {},
	_exposeEnd: false,
	async exposeEnd() {
		while (!this._exposeEnd)
			await new Promise(resolve => setTimeout(resolve, 50));
	},
	expose(funcname, func) {
		if (!funcname)
			return;
		if (!func) {
			func = funcname;
			funcname = funcname.name;
		}
		this.exposed[funcname] = func;
		if (this.ws.connected)
			this.ws.send(JSON.stringify({ expose: true, func: funcname }));
	},
	resolve(name) {
		this[name] = async (...args) => await this.svExec(name, ...args);
	},
	async svExec(func, ...args) {
		let fid = `${Date.now().toString(16)}${Math.random().toString(16)}`;
		this.ws.send(JSON.stringify({ func, args, fid }));
		this.waitingForReply[fid] = new fwgui.Waiting();
		// fwgui.whoIsGay().then(console.log)
		while (this.waitingForReply[fid] instanceof fwgui.Waiting)
			await new Promise(resolve => setTimeout(resolve, 10));
		let rs = this.waitingForReply[fid];
		delete this.waitingForReply[fid];
		return rs;
	},
	start() {
		this.ws = new WebSocket('ws://localhost:8080');
		this.ws.connected = false;
		this.ws.onopen = () => {
			this.ws.connected = true;
			for (const func in this.exposed)
				this.ws.send(JSON.stringify({ expose: true, func }));
			this.ws.send(JSON.stringify({ endInit: true }));
		};
		this.ws.onmessage = async ({ data: msg }) => {
			try {
				msg = JSON.parse(msg);
				console.log(msg);
				let f = this.exposed[msg.func];
				if (msg.expose)
					this.resolve(msg.func);
				else if ('reply' in msg)
					this.waitingForReply[msg.fid] = msg.reply;
				else if (msg.endExpose)
					this._exposeEnd = true;
				else {
					if (f) {
						this.ws.send(JSON.stringify({
							reply: await f(...msg.args) || null,
							fid: msg.fid
						}));
					}
					else {
						this.error(`function '${msg.func}' not found`);
						console.log(msg);
					}
				}
			}
			catch (e) {
			    this.error(`Clientside error: ${e.stack}`);
			}
		};
	}
};
fwgui.start();
fwgui.expose(alert);
fwgui.expose(function add(...args) { return args.reduce((a, v) => a + v) });