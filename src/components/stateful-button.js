// NOT CURRENTLY USED
HTMLButtonElement.prototype.state = function (state) {
	if (state != undefined) {

		return this.setAttribute('state', state);
	}
	else return this.getAttribute('state');
}


class StatefulButton extends HTMLButtonElement {

	static observedAttributes = ['checked'];

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
					h1, h2, h3, h4, h5 {
						text-transform: uppercase;
					}
					.button {
						display: inline-block;
						padding: 10px;
						background-color: #73B5F6;
						color: #fff;
						font-size: 0.9em;
						border: 0;
						border-radius: 3px;
						text-decoration: none;
						cursor: pointer;
					}
					main {
						padding: 15px;
					}
					main hr { height: 1px; background-color: #eee; border: 0; }
					main h1 {
						font-size: 1.4em;
						text-transform: uppercase;
						letter-spacing: 1px;
					}
					main h2 {
						font-size: 1.1em;
					}
					main h3 {
						font-size: 0.9em;
					}
					main p {
						color: #333;
					}
					main pre {
						white-space: pre-line;
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
		console.log("Custom element added to page.");
	}

	disconnectedCallback() {
		console.log("Custom element removed from page.");
	}

	attributeChangedCallback(name, oldValue, newValue) {
		console.log(`Attribute ${name} has changed.`);
	}
}

customElements.define("stateful-button", StatefulButton, { extends: 'button' });
