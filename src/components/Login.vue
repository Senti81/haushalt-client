<template>
	<v-card
		class="mx-auto mt-16 pa-6 green lighten-5"
		max-width="496"
		max-height="786"
		outlined
		:elevation="8"
		>
		<v-overlay v-show="this.$store.getters.isLoading">Loading...</v-overlay>
		<v-card-title>🏡 Haushalts App</v-card-title>
		<v-list-item three-line>
			<v-list-item-content>
				<v-form>
					<v-alert 
						v-if="errorMessage"
						border="right"
						colored-border
						type="error"
						elevation="0"
						>
						{{errorMessage}}
					</v-alert>
					<v-text-field
						v-model="name"
						label="Name"
						required
						@focus="errorMessage=''"
					></v-text-field>
					<v-text-field
						v-model="password"
						label="Passwort"
						type="password"
						required
						@keypress.enter="submit"
					></v-text-field>
					<v-card-actions>
						<v-btn 
							block
							:disabled="disabled"
							@click="submit"
							color="primary"
							class="mt-4">
							Anmelden
						</v-btn>
					</v-card-actions>
				</v-form>
			</v-list-item-content>
		</v-list-item>
	</v-card>
</template>

<script>
export default {
	data() {
		return {
			name: '',
			password: '',
			errorMessage: ''
		}
	},
	computed: {
		disabled() {
			return this.name.length == 0 || this.password.length < 4
		},
	},
	methods: {
		async submit () {
      const payload = { name: this.name, password: this.password }
      const status = await this.$store.dispatch('verifyLogin', payload)
      if (status !== 200) {        
        this.errorMessage = 'Name oder Passwort falsch',
        this.name = '',
        this.password = ''
      }
		}
	}
}
</script>

<style scoped>
	.login {
		margin: 8% 0px;
	}
</style>