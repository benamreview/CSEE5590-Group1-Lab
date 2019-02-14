
$(function () {
	DropdownItem.prototype.$template = $('#menuitem-template').contents('li');
	const $menu = $('#category + .dropdown-menu');
	menuItems.forEach(function (item) {
		const menuItem = new DropdownItem(item);
		const html = menuItem.render();
		$menu.append(html);
	});

	$('.dropdown-toggle:not([data-link])').on('click', function (e) {
		const $parent = $(this).parent();
		const siblings = $parent.siblings().toArray();

		if (!$parent.hasClass('open')) {
			$parent.addClass('open');
		} else {
			siblings.push($parent);
		}

		siblings.forEach(function (sibling) {
			const $sibling = $(sibling);
			$sibling.removeClass('open');
			$sibling.find('.open').removeClass('open');
		});

		e.stopPropagation();
		e.preventDefault();
	});
});
