// import { SplashScreen } from '@capacitor/splash-screen';

window.customElements.define(
	'todo-item',
	class extends HTMLElement {
		constructor() {
			super();

			const root = this.attachShadow({ mode: 'open' });
			root.innerHTML = `
				<style>
					:host {
						font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
						display: block;
						width: 100%;
						height: 100%;
					}
				</style>
				<div>
					<capacitor-welcome-titlebar>
						<h1>Capacitor</h1>
					</capacitor-welcome-titlebar>
					<main>
						<p>
							Capacitor makes it easy to build powerful apps for the app stores, mobile web (Progressive Web Apps), and desktop, all
							with a single code base.
						</p>
						<h2>Getting Started</h2>
						<p>
							You'll probably need a UI framework to build a full-featured app. Might we recommend
							<a target="_blank" href="http://ionicframework.com/">Ionic</a>?
						</p>
						<p>
							Visit <a href="https://capacitorjs.com">capacitorjs.com</a> for information
							on using native features, building plugins, and more.
						</p>
						<a href="https://capacitorjs.com" target="_blank" class="button">Read more</a>
						<h2>Tiny Demo</h2>
						<p>
							This demo shows how to call Capacitor plugins. Say cheese!
						</p>
						<p>
							<button class="button" id="take-photo">Take Photo</button>
						</p>
						<p>
							<img id="image" style="max-width: 100%">
						</p>
					</main>
				</div>
				`;
		}

		connectedCallback() {
			const self = this;

			self.shadowRoot.querySelector('#take-photo').addEventListener('click', async function (e) {
				try {
					//
					const image = self.shadowRoot.querySelector('#image');
					if (!image) {
						return;
					}

					image.src = photo.webPath;
				} catch (e) {
					console.warn('User cancelled', e);
				}
			});
		}
	}
);
