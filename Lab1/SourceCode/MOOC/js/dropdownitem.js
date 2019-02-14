class DropdownItem {

	/**
	 * Create a new DropdownItem
	 * @param {string} name - The name of the item.
	 * @param {string} [icon] - An icon name.
	 * @param {Array} [submenu] - Sub-menu.
	 * @param {string} [link] - Page to link to.
	 */
	constructor({name, icon, submenu, link}) {
		this.name = name;
		this.icon = icon;
		this.link = link;
		if (Array.isArray(submenu)) {
			this.submenu = submenu.map(item => new DropdownItem(item));
		}
	}

	/**
	 *
	 * @returns {jQuery} - Newly cloned list element, to be added to the DOM.
	 */
	render() {
		const $item = this.$template.clone();
		const $name = $item.find('.name');
		const $icon = $item.find('.material-icons');
		const $image = $item.find('.icons');
		const $link = $item.find('.link');
		const $submenu = $item.find('.dropdown-menu');
		const $caret = $item.find('.caret');

		$name.text(this.name);

		if (this.icon) {
			if (this.icon.startsWith('https://') || this.icon.startsWith('http://')) {
				$image.attr('src', this.icon);
				$icon.remove();
			} else {
				$icon.text(this.icon);
				$image.remove();
			}
		} else {
			$icon.remove();
			$image.remove();
		}

		if (this.submenu) {
			this.submenu.forEach(function (item) {
				$submenu.append(item.render());
			});
		} else {
			$submenu.remove();
			$caret.remove();
		}

		if (this.link) {
			$link.attr('data-link', this.link);
			$link.attr('href', this.link);
		}

		if (!(this.submenu || this.link)) {
			$item.addClass('disabled');
		}

		return $item;
	}
}
