import { Repository } from "../../core/repository.js";

export class LabelList extends HTMLElement {

	constructor() { super(); }

	async connectedCallback() {
		this.labels = await Repository.Labels.getAll();
		this.innerHTML = this.css() + this.render();
	}

	static clearFilters() {

	}

	static add() {

	}
	static edit() {

	}
	static remove() {

	}

	css() {
		return `
		<style>
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

			.white {
				background: var(--bg);
				color: var(--fg);
			}
			.white.fill {
				border-color: var(--fg);
				background: var(--fg);
				color: var(--bg);
			}
			.green {
				background: var(--bg);
				color: var(--green);
			}
			.green.fill {
				border-color: var(--green);
				background: var(--green);
				color: var(--white);
			}
			.red {
				background: var(--bg);
				color: var(--red);
			}
			.red.fill {
				border-color: var(--red);
				background: var(--red);
				color: var(--white);
			}
		</style>
		`;
	}

	render() {
		return `
			<h3>FILTERS</h3>
			${this.labels.map(l => {
				return `<button class="label ${l.color}" onclick="LabelList.toggleLabel(this)">${l.name}</button>`;
			}).join('')}
			<button class="filter green" onclick="LabelList.toggleDone()">DONE & DONE!</button>
			<button class="filter red fill" onclick="LabelList.clearFilters()">CLEAR</button>
			<button class="filter white fill" onclick="LabelList.editLabels()">EDIT</button>
		`;
	}
}

customElements.define('label-list', LabelList);