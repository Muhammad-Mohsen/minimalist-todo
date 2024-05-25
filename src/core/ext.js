/* NOT A MODULE */

JSON.copy = function (obj) {
	return JSON.parse(JSON.stringify(obj));
}
JSON.tryParse = function (str, defualt) {
	try { return JSON.parse(str); }
	catch { return defualt; }
}

Math.clamp = function (from, num, to) {
	if (from > to) throw 'YouDumbException!';
	return Math.min(Math.max(from, num), to);
}

NodeList.prototype.toArray = function () { return [...this]; }
HTMLCollection.prototype.toArray = function () { return [...this]; }

HTMLButtonElement.prototype.state = function (state) {
	if (state != undefined) return this.setAttribute('state', state);
	else return this.getAttribute('state');
}

HTMLElement.prototype.appendHTML = function (html, options) {
	if (options.replaceSelector) {
		this.querySelector(options.replaceSelector).remove();
		return this.insertAdjacentHTML('beforeend', html);
	}

	if (options.ifNotExistsSelector && !this.querySelector(options.ifNotExistsSelector)) {
		return this.insertAdjacentHTML('beforeend', html);
	}
}

HTMLElement.prototype.dispatchCustomEvent = function (name, data) {
	new Function(`
		const event = new CustomEvent('${name}', {
			bubbles: false,
			cancelable: true,
			detail: ${JSON.stringify(data)}
		});

		this.dispatchEvent(event);

		${this.getAttribute(`on${name}`)};
	`)();
}

// make sure the element is relatively-positioned, and has a transition prop
HTMLElement.prototype.makeSlidable = function (limit) {
	let start, delta; // no touchend touches, so "delta" needs to be globally maintained

	this.ontouchstart = (event) => {
		this.style.transition = 'none'; // disable transition at the start of the slide
		start = event.touches[0].clientX;
	}
	this.ontouchmove = (event) => {
		delta = start - event.touches[0].clientX;
		this.style.right = `${Math.clamp(0, delta, limit)}px`;
	}
	this.ontouchend = () => {
		if (delta > (limit / 2) || delta < (limit / -2)) this.style.right = `${limit}px`;
		else this.style.right = '0';
	}
}
HTMLElement.prototype.resetSlide = function () {
	this.style.right = '0';
}

String.prototype.minify = function () {
	return this.replace(/\s{2,}[\t\n]+/, '');
}
