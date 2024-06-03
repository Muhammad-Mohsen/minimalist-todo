import { Repository } from "../../core/repository.js";

export class TODOList extends HTMLElement {

	constructor() { super(); }

	async connectedCallback() {
		document.head.appendHTML(this.css(), { ifNotExistsSelector: '#TODOList' });

		this.todos = await Repository.Todos.selectAll();
		this.innerHTML = this.render();
	}

	css() {
		return `
		<style id="LabelList">
			todo-list {
				--scroll-overshoot: 20px;

				flex-grow: 1;

				&:empty {
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

				& .item {
					display: flex;
					padding: 0 var(--scroll-overshoot);
					scroll-snap-type: x mandatory;
					overflow-x: auto;

					& .content {
						min-width: 100vw;
    					padding: 12px 32px;
						color: var(--fg);
						font-size: 14px;
						scroll-snap-align: start;
					}

					& .actions {
						display: flex;
						align-items: center;
						gap: 12px;
						padding: 12px;
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

	// item TODO:
	// DONE - scroll snapping
	// actions (un)done/edit/delete
	// labels
	// dispatch event on edit
	// rerender on delete
	// change item on (un)done
	render() {
		const id = this.id;
		return `
			<div class="item">
				<div class="content">todo item todos: DONE - scroll snapping + actions + dispatch event on edit + rerender on edit/delete !</div>
				<div class="actions">
					<button class="material-symbols-outlined action fab green" style="font-size: 34px;">check</button>
					<button class="material-symbols-outlined action fab" style="font-size: 22px;">edit</button>
					<button class="material-symbols-outlined action fab red" style="font-size: 24px;">delete</button>
				</div>
			</div>
		`;
	}
}

customElements.define('todo-list', TODOList);