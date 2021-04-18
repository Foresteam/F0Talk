module.exports = {
	transpileDependencies: [
		'vuetify'
	],
	devServer: {
		port: 8000
	},
	outputDir: '../wgui/',
	chainWebpack: config => config.plugin('html').tap(args => {
		args[0].title = 'F0Talk';
		return args;
	})
}
