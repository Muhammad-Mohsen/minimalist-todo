import { Repository } from "../../core/repository.js";

export class TodoDialog extends HTMLElement {

	constructor() { super(); }

	static THRESHOLD = 100;
	intermediateY = 0;

	connectedCallback() {
		document.head.appendHTML(this.css(), { ifNotExistsSelector: '#TodoDialog' });
		this.setAttribute('aria-hidden', 'true');

		this.ontouchstart = (event) => {
			this.intermediateY = event.touches[0].clientY;
		}
		this.ontouchmove = (event) => {
			const delta = Math.max(0, event.touches[0].clientY - this.intermediateY); // prevent -ve
			this.style.transform = `translateY(${delta}px)`;
		}
		this.ontouchend = () => {
			if (parseInt(this.style.transform.slice(11, -3)) > TodoDialog.THRESHOLD) this.back();
			this.style.transform = '';
		}
	}

	async open(id) {
		this.labels = Repository.Labels.selectAll();
		this.todo = id
			? await Repository.Todos.select(id)
			: { id: this.#id(), text: '', labels: [] };

		this.innerHTML = this.render();

		this.setAttribute('open', '');
		this.removeAttribute('aria-hidden');
	}

	back(notify) {
		// close the thing
		this.setAttribute('aria-hidden', 'true');
		this.removeAttribute('open');

		// dispatch close event
		if (notify) this.dispatchCustomEvent('close', this.todo);
	}
	saveAndClose() {
		// text
		this.todo.text = this.querySelector('#todoTextField').innerHTML.trim();

		if (!this.todo.text) return;

		// get the active labels
		this.todo.labels = this.querySelectorAll('.label[state="active"]')
			.toArray()
			.map(l => l.getAttribute('data-id'));


		// save it
		Repository.Todos.upsert(this.todo);

		this.back('notify');
	}

	toggleLabel(elem) {
		const newState = elem.state() ? '' : 'active';
		elem.state(newState);

		const color = elem.dataset.color;
		elem.style = `background: ${newState ? color : 'var(--bg)'}; color: ${newState ? 'var(--bg)' : color}; border-color: ${color}`;
	}

	css() {
		return `
			<style id="TodoDialog">
				todo-dialog {
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
						gap: 16px;
						padding: 6px 0;
					}

					& #todoTextField {
						max-height: calc(100vh - 330px);
						margin-block-end: 20px;
						padding: 16px;
						color: var(--fg);
						outline: none;
						overflow-y: auto;

						&:empty::before {
							content: 'TODO: add a todo...';
							color: var(--fg-sec);
						}
					}

					& .label-list {
						display: flex;
						gap: 12px;
						margin: -20px 0;
						padding: 20px 16px;
						overflow-x: auto;

						&::-webkit-scrollbar { display: none; }
					}
					& .label {
						flex-shrink: 0;
						padding: 6px 12px;
						border-radius: 6px;
						border: 2px solid;
						background: var(--bg);
						font: 600 var(--text-s)/var(--text-s) Poppins;
						text-transform: uppercase;
						letter-spacing: .1em;
						transition: .2s ease-out;
						scroll-snap-align: end;
						scroll-padding-inline-end: var(--scroll-overshoot);
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
			<h1>${this.todo.text ? 'EDIT TODO' : 'NEW TODO'}</h1>

			<main>
				<div id="todoTextField" role="textbox" contenteditable="true" aria-multiline="true" aria-required="true">${this.todo.text}</div>

				<div class="label-list">
					${this.labels.map(l => this.#labelHTML(l)).join('')}
				</div>
			</main>

			<footer>
				<button class="material-symbols-outlined undo fab secondary" onclick="${id}.back()">west</button>
				<button class="material-symbols-outlined fab green" onclick="${id}.saveAndClose()">check</button>
			</footer>
		`;
	}

	#id() {
		return new Date().getTime();
	}
	#labelHTML(label) {
		const style = this.todo.labels.includes(label.id) // isActive
			? `style="color: var(--bg); background: ${label.color}; border-color: ${label.color}" state="active"`
			: `style="color: ${label.color}; background: var(--bg); border-color: ${label.color}" state=""`;

		return `<button class="label" ${style} data-color="${label.color}" data-id="${label.id}" onclick="${this.id}.toggleLabel(this)">${label.text}</button>`
	}
}

customElements.define('todo-dialog', TodoDialog);