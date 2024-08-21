import { Repository } from "../../core/repository.js";

export class TodoList extends HTMLElement {

	DRAG = {
		TIMEOUT: 500,
		THRESHOLD: 30,

		timeout: null,

		startX: 0,
		startY: 0,
		currentX: 0,
		currentY: 0,
		over: null,

		element: null,
	};

	constructor() { super(); }

	async connectedCallback() {
		document.head.appendHTML(this.css(), { ifNotExistsSelector: '#TodoList' });

		this.labels = Repository.Labels.selectAll();
		this.todos = await Repository.Todos.selectAll();

		this.classList.toggle('empty', !this.todos.length);
		this.innerHTML = this.render();
	}

	async toggleItem(id, element) {
		const todo = this.todos.find(td => td.id == id);
		todo.isDone = !todo.isDone;
		element.dataset.isdone = todo.isDone;

		await Repository.Todos.upsert(todo);
		element.querySelector('.content').classList.toggle('done');
	}
	async deleteItem(id, element) {
		await Repository.Todos.delete([id]);
		this.todos = this.todos.filter(td => td.id != id);

		element = element.closest('.item');
		element.classList.add('hidden');
		setTimeout(() => {
			element.remove();
			this.classList.toggle('empty', !this.todos.length);
		}, 250);
	}
	editItem(id, element) {
		todoDialog.open(id);

		element = element.closest('.item');
		element.scroll({ left: 0, behavior: 'smooth' });
	}

	onTouchStart(event, element) {
		this.DRAG.startX = this.DRAG.currentX = event.touches[0].clientX;
		this.DRAG.startY = this.DRAG.currentY = event.touches[0].clientY;

		this.DRAG.timeout = setTimeout(() => {
			if (Math.abs(this.DRAG.startX - this.DRAG.currentX) > this.DRAG.THRESHOLD) return; // this is a X slide
			if (Math.abs(this.DRAG.startY - this.DRAG.currentY) > this.DRAG.THRESHOLD) return; // this is a Y slide...weee

			this.DRAG.element = element;
			this.classList.add('dragging');
			this.DRAG.element.classList.add('dragging');

		}, this.DRAG.TIMEOUT);
	}
	onTouchMove(event) {
		if (!this.DRAG.element) return;

		const [x, y] = [event.touches[0].clientX, event.touches[0].clientY];
		this.DRAG.currentX = x;
		this.DRAG.currentY = y;

		// move dragged element
		this.DRAG.element.style.inset = `${y}px 0 auto 0`;

		const prevElement = this.querySelector('.item.dragover');
		const element = document.elementFromPoint(x, y)?.closest('.item');

		if (prevElement != element) {
			element?.classList?.add('dragover');
			prevElement?.classList?.remove('dragover');
		}
	}
	onTouchEnd(event) {
		if (this.DRAG.element) {
			const element = this.querySelector('.item.dragover');

			this.querySelector('.item.dragover')?.classList?.remove('dragover');
			this.classList.remove('dragging');
			this.DRAG.element.classList.remove('dragging');
			this.DRAG.element.style.inset = '';

			if (element) element.insertAdjacentElement('beforebegin', this.DRAG.element);
			else this.insertAdjacentElement('beforeend', this.DRAG.element);
			this.DRAG.element = null;

		} else {
			if (Math.abs(this.DRAG.startX - this.DRAG.currentX) > this.DRAG.THRESHOLD) return; // this is a X slide
			if (Math.abs(this.DRAG.startY - this.DRAG.currentY) > this.DRAG.THRESHOLD) return; // this is a Y slide...weee

			let element = document.elementFromPoint(this.DRAG.currentX, this.DRAG.currentY);
			if (element.closest('.actions')) return; // a button click

			element = element.closest('.item');
			if (element) this.toggleItem(element.dataset.id, element);
			clearTimeout(this.DRAG.timeout);
		}
	}

	onFiltersChanged(event) {
		const data = event.detail;
		this.querySelectorAll('.item').toArray().forEach(td => {
			const doneGood = data.done == 'all'
				|| data.done == 'done' && td.dataset.isdone == 'true'
				|| data.done == 'notdone' && td.dataset.isdone != 'true';

			const labelGood = !data.filters.length || data.filters.reduce((a, b) => a ||= td.dataset.labels.includes(b), false);

			td.classList.toggle('hidden', !(doneGood && labelGood));
		});
	}

	css() {
		return `
		<style id="TodoList">
			todo-list {

				transform-origin: center;
				transition: .25s;

				&.empty {
					display: flex;
					flex-direction: column;
					align-items: center;
					color: var(--fg-sec);

					&::before {
						content: '¯\\\\_(ツ)_/¯';
						margin-top: 15vh;
						font-family: arial;
						font-size: var(--text-xl);
					}
					&::after {
						content: 'NOTHIN\\' TO DO, I GUESS!!'
					}
				}

				&::after {
					content: '';
					display: block;
					height: 2px;
					margin-top: 8px;
					background: var(--fg-sec);
					scale: 0 1;
					transition: .25s ease-out;
				}

				&.dragging {
					/* scale: .95; */

					/* prevent scrolling because when an item comes into the same place occupied by the item being dragged, it can be scrolled! */
					& .item { overflow: hidden; }

					&:not(:has(.item.dragover))::after { scale: 1 1; }
				}

				& .item {
					position: relative;
					display: flex;
					max-height: 100%;
					padding: 0 var(--scroll-overshoot);
					scroll-snap-type: x mandatory;
					overflow: auto hidden;
					transition: .25s ease;

					&.hidden {
						max-height: 0;
						opacity: 0;
						translate: -50px 0;
						transition: .25s ease, max-height .25s ease .15s;
					}

					&.dragging {
						position: absolute;
						opacity: .5;
						transition: 0s;
						pointer-events: none;
						overflow: hidden;
					}

					&.dragover { padding-top: 32px; }
					&::before {
						content: '';
						position: absolute;
						inset: 20px -20px auto 0; /* sigh! */
						height: 2px;
						background: var(--fg-sec);
						scale: 0 1;
						transition: .25s ease-out;
					}
					&.dragover::before { scale: 1 1; }

					& .content {
						position: relative;
						min-width: 100vw;
    					padding: 16px 32px 0 48px;
						color: var(--fg);
						font-size: 14px;
						scroll-snap-align: start;
						transition: .2s ease;

						& span {
							max-width: calc(100% - 36px);
							margin-block-start: 2px;
							font-size: var(--text-s);
							transition: .5s;
						}

						& .labels {
							flex: 1 0 100%;
							display: flex;
    						gap: 8px;
							margin-block: 8px;
						}

						& .pill {
							width: 28px;
							height: 4px;
							border-radius: 50px;
						}
					}

					& .content.done span {
    					color: var(--green);
						text-decoration: line-through solid #00800088 3px;
					}

					& .content i {
						position: absolute;
						inset: 14px auto auto 12px;
						color: var(--fg-sec);
					}
					& .content .done-marker { color: var(--green); }

					& .content .undone-marker,
					& .content.done .done-marker { scale: 1; opacity: 1; transition: .2s ease-in .2s; transform-origin: 12px 12px; }

					& .content .done-marker,
					& .content.done .undone-marker { scale: .1; opacity: 0; transition: .2s ease-out; transform-origin: 12px 12px; }

					/* animation inspired by magnificode's codepen */
					& .content .done-marker {
						&::before {
							content: '';
							position: absolute;
							top: 0;
							left: 0;
							width: 24px;
							height: 24px;
							border-radius: 50%;
							border: 1px solid var(--green);
							scale: 0;
						}
					}
					& .content.done .done-marker {
						&::before {
							border-color: transparent;
							scale: 2;
							transition: scale 1s ease, 1s border-color ease .6s;
						}
					}

					& .actions {
						display: flex;
						align-items: center;
						gap: 12px;
						padding: 0 12px;
						scroll-snap-align: end;

						& button.action {
							position: static;
							width: 48px;
							margin: 0;
							padding: 0;
						}

						.separator {
							width: 1px;
							height: 16px;
							background: var(--fg-sec);
						}
					}

					&::-webkit-scrollbar { display: none; }
				}
			}
		</style>
		`;
	}

	render() {
		const id = this.id;

		return `
			${this.todos.map(td => `
				<div class="item" data-id="${td.id}" data-isDone="${td.isDone}" data-labels="${td.labels}"
						ontouchstart="${id}.onTouchStart(event, this)" ontouchmove="${id}.onTouchMove(event, this)" ontouchend="${id}.onTouchEnd(event, this)">

					<div class="content ${td.isDone ? 'done' : ''}">
						<i class="material-symbols-outlined undone-marker">circle</i>
						<i class="material-symbols-outlined done-marker done">task_alt</i>
						<span>${td.text.replace(/\n/g, '<br>')}</span>
						<div class="labels">
							${td.labels.map(id => {
								const l = this.#labelById(id);
								if (!l) return '';
								return `<div class="pill" style="background: ${l.color}"></div>`;
							}).join('')}
						</div>
					</div>
					<div class="actions">
						<button class="material-symbols-outlined action fab" style="font-size: 22px;" onclick="event.stopPropagation(); ${id}.editItem(${td.id}, this);">edit</button>
						<button class="material-symbols-outlined action fab red" style="font-size: 24px;" onclick="event.stopPropagation(); ${id}.deleteItem(${td.id}, this);">delete</button>
					</div>
				</div>
			`).join('')}
		`.minify();
	}

	#labelById(id) {
		return this.labels.find(l => l.id == id);
	}
}

customElements.define('todo-list', TodoList);