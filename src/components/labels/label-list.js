import { Repository } from "../../core/repository.js";

export class LabelList extends HTMLElement {

	constructor() { super(); }

	connectedCallback() {
		document.head.appendHTML(this.css(), { ifNotExistsSelector: '#LabelList' });

		this.labels = Repository.Labels.selectAll();
		this.innerHTML = this.render();
	}

	toggle(label) {

	}
	clear() {

	}
	edit() {
		editLabelsDialog.open();
	}

	css() {
		return `
		<style id="LabelList">
			label-list {

				display: flex;
				align-items: center;
				gap: 12px;
				margin-inline: 64px 80px;

				animation: scroll-reveal both;
				animation-timeline: scroll(x);

				& h3 {
					margin-inline-end: 56px;
					color: var(--fg);
					font: 400 var(--text-m)/var(--text-l) PoiretOne;
				}

				& button {
					flex-shrink: 0;
					padding: 6px 12px;
					border-radius: 6px;
					border: 2px solid;
					background: var(--bg);
					font: 600 var(--text-s)/var(--text-s) Poppins;
					text-transform: uppercase;
					letter-spacing: .1em;
				}

				& button.filter { border-radius: 50px; }
			}

			@keyframes scroll-reveal {
				0% { opacity: 0; }
				50% { opacity: 1; }
			}
		</style>
		`;
	}

	render() {
		const id = this.id;
		return `
			<h3>LABELS</h3>
			${this.labels.map(l => {
				return `<button class="label" style="color: ${l.color}" onclick="${id}.toggle(this)">${l.text}</button>`;
			}).join('')}
			<button class="filter green" onclick="${id}.toggle(this)">DONE & DONE!</button>
			<button class="filter red fill" onclick="${id}.clear()">CLEAR</button>
			<button class="filter white fill" onclick="${id}.edit()">EDIT</button>
		`;
	}
}

customElements.define('label-list', LabelList);