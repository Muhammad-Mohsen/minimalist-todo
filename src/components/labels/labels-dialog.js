import { Repository } from "../../core/repository.js";

export class LabelsDialog extends HTMLElement {

	static DEFAULT_COLOR = '#000000';
	static THRESHOLD = 100;

	intermediateY = 0;

	constructor() { super(); }

	connectedCallback() {
		document.head.appendHTML(this.css(), { ifNotExistsSelector: '#LabelsDialog' });
		this.setAttribute('aria-hidden', 'true');

		this.ontouchstart = (event) => {
			this.intermediateY = event.touches[0].clientY;
		}
		this.ontouchmove = (event) => {
			const delta = Math.max(0, event.touches[0].clientY - this.intermediateY); // prevent -ve
			this.style.transform = `translateY(${delta}px)`;
		}
		this.ontouchend = () => {
			if (parseInt(this.style.transform.slice(11, -3)) > LabelsDialog.THRESHOLD) this.back();
			this.style.transform = '';
		}
	}

	open() {
		this.labels = Repository.Labels.selectAll();
		this.innerHTML = this.render();

		this.setAttribute('open', '');
		this.removeAttribute('aria-hidden');
	}

	add(target) {
		const color = target.parentElement.querySelector('[type="color"]');
		const text = target.parentElement.querySelector('[type="text"]');

		if (!text.value.trim()) return;

		const container = this.querySelector('main');
		container.insertAdjacentHTML('beforeend', this.#labelHTML({ id: this.#id(), color: color.value || LabelsDialog.DEFAULT_COLOR, text: text.value }, 'hidden'));
		setTimeout(() => container.querySelector('.label-entry:last-child').classList.remove('hidden'), 100);

		color.value = LabelsDialog.DEFAULT_COLOR;
		text.value = '';
	}
	delete(target) {
		target = target.parentElement;
		target.classList.add('hidden');
		setTimeout(() => target.remove(), 250);
	}
	back(notify) {
		// close the thing
		this.setAttribute('aria-hidden', 'true');
		this.removeAttribute('open');

		// dispatch close event
		if (notify) this.dispatchCustomEvent('close', this.todo);
	}
	saveAndClose() {
		// get the labels from the UI!
		const labels = this.querySelectorAll('.label-entry:not(.new)')
			.toArray()
			.map(l => ({
				id: l.getAttribute('data-id'),
				color: l.querySelector('[type="color"]').value,
				text: l.querySelector('[type="text"]').value
			}));

		// save em
		Repository.Labels.upsert(labels);

		this.back('notify');
	}

	css() {
		return `
			<style id="LabelsDialog">
				labels-dialog {
					position: fixed;
					inset: 0;
					display: flex;
					flex-direction: column;
					justify-content: flex-end;

					backdrop-filter: blur(25px);
    				background: var(--bg-alpha);
					-webkit-mask-image: linear-gradient(transparent, black 10%);

					translate: 0 130vh;
					transition: .35s cubic-bezier(0.7, 0, 0.84, 0);
					z-index: 1;

					&[open] {
						translate: 0;
						transition: .35s cubic-bezier(0.16, 1, 0.3, 1);
					}

					& h1 {
						position: relative;
						width: fit-content;
						margin-inline: auto;
						padding: 0 12px;
						color: var(--fg);

						&::before, &::after {
							content: '';
							position: absolute;
							inset: calc(50% - 1px) auto auto 0;
							width: 100vw;
							height: 2px;
							background: var(--fg-sec);
						}
						&::before { translate: -100% 0; }
						&::after { inset: calc(50% - 1px) auto auto 100%; }
					}

					& main {
						display: flex;
						flex-direction: column;
						max-height: calc(100vh - 302px);
						padding: 6px 0 0;
						overflow-y: auto;
					}

					& .label-entry {
						flex-shrink: 0;
						display: flex;
						align-items: center;
						margin-block: 8px;
						padding: 8px;
						transition: .25s ease;

						outline: 2px solid #0000;
						outline-offset: -2px;

						max-height: 100%;
						overflow: hidden;

						* {
							overflow: hidden;
							transition: .25s ease;
						}

						&.hidden {
							max-height: 0;
							margin-block: 0;
							padding-block: 0;
							opacity: 0;
							translate: -50px 0;

							& * {
								max-height: 0 !important;
								padding-block: 0 !important;
							}
						}

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
						/* box-shadow: 0 0 0 2px var(--fg-sec); */
						outline-color: var(--fg-sec);
						outline-offset: 4px;

						& .red { opacity: 1; }
					}

					& footer {
						flex-shring: 0;
						justify-content: flex-end;
						gap: 20px;
						padding: 0 calc(50% - var(--fab-size) / 2) 0 0;
					}
				}
			</style>
		`;
	}

	render() {
		const id = this.id;

		return `
			<h1>LABELS</h1>
			<main>
				${this.labels.map(l => this.#labelHTML(l)).join('')}
			</main>

			<div class="label-entry new">
				<input type="color">
				<input type="text" placeholder="Add Label">
				<button class="material-symbols-outlined fab mini" onclick="${id}.add(this);">add</button>
			</div>

			<footer>
				<button class="material-symbols-outlined undo fab secondary" onclick="${id}.back()">west</button>
				<button class="material-symbols-outlined fab green" onclick="${id}.saveAndClose()">check</button>
			</footer>
		`;
	}

	#labelHTML(label, hidden) {
		return `<div class="label-entry ${hidden || ''}" data-id="${label.id}">
			<input type="color" value="${label.color}">
			<input type="text" value="${label.text}">
			<button class="material-symbols-outlined fab mini red" onclick="${this.id}.delete(this);">delete</button>
		</div>`;
	}
	#id() {
		return new Date().getTime();
	}
}

customElements.define('labels-dialog', LabelsDialog);