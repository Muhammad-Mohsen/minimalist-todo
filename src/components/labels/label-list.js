import { Repository } from "../../core/repository.js";

export class LabelList extends HTMLElement {

	constructor() { super(); }

	connectedCallback() {
		document.head.appendHTML(this.css(), { ifNotExistsSelector: '#LabelList' });

		this.labels = Repository.Labels.selectAll();
		this.innerHTML = this.render();
	}

	// filtering functions
	toggle(label, notify) {
		const newState = label.state() ? '' : 'active';
		label.state(newState);

		const color = label.dataset.color;
		label.style = `background: ${newState ? color : 'var(--bg)'}; color: ${newState ? 'var(--bg)' : color}; border-color: ${color}`;

		if (notify) this.dispatchCustomEvent('filter', {
			done: this.querySelector('.done-done').state(),
			filters: this.querySelectorAll('.label[state="active"]').toArray().map(l => l.dataset.id)
		});
	}
	toggleDoneDone(doneDone) {
		const states = { // cycles the state
			all: 'done',
			done: 'notdone',
			notdone: 'all'
		};

		doneDone.state(states[doneDone.state()]);
		this.dispatchCustomEvent('filter', {
			done: doneDone.state(),
			filters: this.querySelectorAll('.label[state="active"]').toArray().map(l => l.dataset.id)
		});
	}
	clear() {
		const doneDone = this.querySelector('.done-done');
		doneDone.state('all');

		this.querySelectorAll('.label[state="active"]').toArray().forEach(l => this.toggle(l, false));
		this.dispatchCustomEvent('filter', {
			done: 'all',
			filters: []
		});
	}

	edit() {
		labelsDialog.open();
	}

	css() {
		return `
		<style id="LabelList">
			label-list {
				flex-shrink: 0;
				display: flex;
				align-items: center;
				gap: 12px;
				padding-inline: 0 20px;

				animation: scroll-reveal both;
				animation-timeline: scroll(x);

				& h3 {
					margin-inline: 56px;
					color: var(--fg);
					font: 400 var(--text-m)/var(--text-l) PoiretOne;
				}

				& button {
					flex-shrink: 0;
					padding: 7px 12px 6px; /* poppins is one pixel out of alignment! */
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

				& button.filter { border-radius: 50px; }

				& button.done-done { background: var(--bg); color: var(--green); border-color: var(--green); }
				& .done-done[state="done"] { background: var(--green); color: var(--bg); border-color: var(--green); }
				& .done-done[state="notdone"] { text-decoration: line-through 3px; }
			}

			@keyframes scroll-reveal {
				0%, 5% { opacity: 0; }
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
				return `<button class="label" style="color: ${l.color}" data-id="${l.id}" data-color="${l.color}" onclick="${id}.toggle(this, true)">${l.text}</button>`;
			}).join('')}
			<button class="filter done-done" state="all" onclick="${id}.toggleDoneDone(this)">&nbsp;DONE & DONE!&nbsp;</button>
			<button class="filter red fill" onclick="${id}.clear()">CLEAR</button>
			<button class="filter white fill" onclick="${id}.edit()">EDIT</button>
		`;
	}
}

customElements.define('label-list', LabelList);