import { Repository } from "../../core/repository.js";

export class EditLabelsDialog extends HTMLElement {

	static DEFAULT_COLOR = '#000000';

	constructor() { super(); }

	connectedCallback() {
		document.head.appendHTML(this.css(), { ifNotExistsSelector: '#EditLabelsDialog' });
		this.setAttribute('aria-hidden', 'true');
	}

	open() {
		this.labels = Repository.Labels.selectAll();
		this.innerHTML = this.render();

		this.setAttribute('open', '');
		this.removeAttribute('aria-hidden', '');
	}

	add(target) {
		const color = target.parentElement.querySelector('[type="color"]');
		const text = target.parentElement.querySelector('[type="text"]');

		if (!text.value.trim()) return;

		target.parentElement.insertAdjacentHTML('beforebegin', this.#labelHTML({ color: color.value || EditLabelsDialog.DEFAULT_COLOR, text: text.value }));

		color.value = EditLabelsDialog.DEFAULT_COLOR;
		text.value = '';
	}
	delete(target) {
		target.parentElement.remove();
	}
	reset() {
		this.innerHTML = this.render();
	}
	saveAndClose() {
		// get the labels from the UI!
		const labels = this.querySelectorAll('.label-entry:not(.new)')
			.toArray()
			.map(l => ({
				color: l.querySelector('[type="color"]').value,
				text: l.querySelector('[type="text"]').value
			}));

		// save them
		Repository.Labels.upsert(labels);

		// close the thing
		this.setAttribute('aria-hidden', 'true');
		this.removeAttribute('open');

		// dispatch close event with the updated labels
		this.dispatchCustomEvent('close', this.labels);
	}

	css() {
		return `
			<style id="EditLabelsDialog">
				edit-labels-dialog {
					--hr-split: calc(50% + 44px);

					position: fixed;
					inset: 0;
					display: flex;
					flex-direction: column;
					background: var(--bg);

					/*
					backdrop-filter: blur(40px);
    				background: #2225;
					*/

					translate: 0 30vh;
					opacity: 0;
					pointer-events: none;
					transition: .2s ease-out;
					z-index: 1;

					&[open] {
						translate: 0;
						opacity: 1;
						pointer-events: all;
					}

					& hr {
						position: absolute;
						inset: 58px var(--hr-split) auto 0;
						border: 1px solid var(--fg-sec);
					}
					& h1 + hr { inset: 58px 0 auto var(--hr-split); }

					& main {
						flex-grow: 1;
						display: flex;
						flex-direction: column;
						gap: 16px;
						padding: 2px 0;
						overflow-y: auto;
					}

					& .label-entry {
						display: flex;
						align-items: center;
						padding: 8px;
						transition: .25s ease-out;

						& input, & button {
							border: none;
							background: transparent;
							color: var(--fg);
						}
						& input[type="text"] {
							flex-grow: 1;
							padding: 4px 10px 3px;
							outline: none;
						}

						& input[type="color"] {
							padding: 4px;
							border-radius: 50px;
							outline: 2px solid var(--fg-sec);
							outline-offset: -6px;
							transition: .15s ease-out;

							&:is(:focus, :focus-visible) { outline-offset: 2px solid var(--fg-sec); }
						}
						& input[type="color"]::-webkit-color-swatch-wrapper {
							padding: 0;
							border-radius: 50px;
						}
						& input[type="color"]::-webkit-color-swatch {
							border: none;
							border-radius: 50px;
						}

						& button { margin-inline-start: unset; }

						& .red { opacity: 0; }
					}
					& .label-entry:focus-within {
						box-shadow: 0 0 0 2px var(--fg-sec);

						& .red { opacity: 1; }
					}

					& footer { position: relative; }
					& .fab.undo {
						position: absolute;
						inset: calc(50% - var(--fab-size) / 2) auto auto 25%;
						margin: unset;
					}
				}
			</style>
		`;
	}

	render() {
		const id = this.id;

		return `
			<div class="scrim"></div>
			<hr>
			<h1>LABELS</h1>
			<hr>
			<main>
				${this.labels.map(l => this.#labelHTML(l)).join('')}

				<div class="label-entry new">
					<input type="color">
					<input type="text" placeholder="Add Label">
					<button class="material-symbols-outlined fab mini" onclick="${id}.add(this);">add</button>
				</div>
			</main>

			<footer>
				<button class="material-symbols-outlined undo fab secondary" onclick="${id}.reset()">undo</button>
				<button class="material-symbols-outlined fab green" onclick="${id}.saveAndClose()">check</button>
			</footer>

		`.minify();
	}

	#labelHTML(label) {
		return `<div class="label-entry">
			<input type="color" value="${label.color}">
			<input type="text" value="${label.text}">
			<button class="material-symbols-outlined fab mini red" onclick="${this.id}.delete(this);">delete</button>
		</div>`;
	}
}

customElements.define('edit-labels-dialog', EditLabelsDialog);