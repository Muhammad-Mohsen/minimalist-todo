import { Repository } from "../../core/repository.js";

export class EditLabelsDialog extends HTMLDialogElement {

	constructor() { super(); }

	connectedCallback() {
		this.setAttribute('inert', '');
	}

	async open() {
		this.labels = await Repository.Labels.getAll();
		this.innerHTML = this.css() + this.render();

		this.setAttribute('open', '');
		this.removeAttribute('inert', '');
	}
	close() {
		this.setAttribute('inert', '');
		this.removeAttribute('open');
	}

	static addLabel() {

	}
	static deleteLabel(label) {

	}

	css() {
		return `
		<style>
			edit-labels-dialog {
				background: gray;
				position: fixed;
				inset: 0;
				translate: 0 25%;
				opacity: 0;
				transition: opacity .25s, translate .25s ease-out .1s;
				z-index: 1;

				&[open] {
					translate: 0;
					opacity: 1;
					transition: opacity .25s .1s, translate .25s ease-out;
				}

				& dialog {}
			}
		</style>
		`;
	}

	render() {
		return `
			<dialog>
			</dialog>
		`;
	}
}

customElements.define('edit-labels-dialog', EditLabelsDialog, { extends: 'dialog' });