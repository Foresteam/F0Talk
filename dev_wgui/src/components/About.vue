<template>
    <div>

	<v-container>
		<v-row class="text-center">
			<v-col cols="12">
				<v-img
					:src="require('../assets/logo.svg')"
					class="my-3"
					contain
					height="240"
				/>
			</v-col>

			<v-col class="mb-4">
				<h1 class="display-2 font-weight-bold mb-3">
					{{ locales.welcomeTo[+lang] }} F0Talk
				</h1>
                <p class="subheading font-weight-regular">
                    {{ locales.thisAppIs[+lang] }}
                </p>
                <p>
                    {{ locales.shortTour[+lang] }}:
                    <ul>
                        <li v-for="(v, k) in locales.shortTourR[+lang]" :key="k">{{ v }}</li>
                    </ul>
                </p>
				<p>
                    {{ locales.commands[+lang] }}:
                    <ul>
                        <li v-for="(text, i) in help" :key="i">
                            {{ text }}
                        </li>
                    </ul>
				</p>
			</v-col>
		</v-row>
	</v-container>
    <v-footer>
        Created by Foresteam, licensed under GNU GPL v3
    </v-footer>
    </div>
</template>

<script>
	export default {
		name: 'HelloWorld',
        props: ['help', 'locales', 'lang']
	}
</script>

<style scoped>
li {
    text-align: left;
}
ul {
    margin: auto;
    
    max-width: 800px;
}
</style>