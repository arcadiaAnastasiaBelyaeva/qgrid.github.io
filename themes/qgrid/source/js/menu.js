﻿function toggleVisibility(e) {
	const target = e.target || e.srcElement;
	if (target.dataset.hasOwnProperty('stopPropagation')) {
		e.stopImmediatePropagation();
		return;
	}
	const nav = document.getElementById('nav');
	const overlay = document.getElementById('overlay');
	if (nav.style.display === 'none' || nav.style.display === '') {
		nav.style.display = 'block';
		overlay.style.display = 'block';
	} else {
		nav.style.display = 'none';
		overlay.style.display = 'none';
	}
}

function searchOnLoad() {
	const active = document.querySelector('.active');
	const search = getSearch();
	if (active && search) {
		pageTextSearch(search);
		tagsSearch(search);
		menuItemsSearch(search);
	}
}

function searchOnHashChange() {
	const search = getSearch();
	updateMenuLinks(search);
	pageTextSearch(search);
	tagsSearch(search);
	menuItemsSearch(search);
}

function onSearchChange(e) {
	e.stopImmediatePropagation();
	const input = e.target || e.srcElement;
	const search = input.value.toLowerCase();
	setSearch(search);
}

function setSearch(search) {
	if (search) {
		location.hash = 'search=' + search;
	}
	else {
		location.hash = '';
	}
}

function getSearch() {
	const search = new RegExp(/^#search=/);
	if (search.test(location.hash)) {
		return location.hash.substr(search.source.length - 1).replace(/%20/g, ' ').toLowerCase();
	}
	return '';
}

function updateMenuLinks(search) {
	const nav = document.getElementById('nav');
	const menuItems = nav.getElementsByTagName('li');
	for (let searchTarget of menuItems) {
		const title = searchTarget.querySelector('.title');
		if (title) {
			let href = title.getAttribute('href');
			const index = href.lastIndexOf('#search=');
			if (index == -1 && search != '') {
				href += '#search=';
			}
			else {
				if (index > -1) {
					href = href.substr(0, href.indexOf('=') + 1);
				}
				if (search == '') {
					href = href.replace(/#search=/, '');
				}
			}
			title.setAttribute('href', href + search);
		}
	}
}

function pageTextSearch(search) {
	const h2 = document.getElementsByTagName('h2');
	const p = document.getElementsByTagName('p');
	for (let searchTarget of [...h2, ...p]) {
		const a = searchTarget.getElementsByTagName('a')[0];
		if (a && a.textContent) {
			searchTarget = a;
		}
		highlightText(searchTarget, search);
	}
	for (let searchTarget of [...h2, ...p]) {
		const index = searchTarget.textContent.toLowerCase().indexOf(search);
		if (index > -1 && search != '') {
			searchTarget.scrollIntoView();
			return;
		}
	}
}

function tagsSearch(search) {
	const active = document.querySelector('.active');
	const nav = document.getElementById('nav');
	const menuItems = nav.getElementsByTagName('li');
	for (let searchMenuItem of menuItems) {
		const tags = searchMenuItem.dataset.tag;
		if (tags) {
			const tag = tags.split(',');
			for (let searchTag of tag) {
				const indexTag = searchTag.toLowerCase().indexOf(search);
				const title = searchMenuItem.querySelector('.title');
				if (title) {
					if (indexTag > -1 && searchMenuItem != active && search != '') {
						searchMenuItem.style.display = '';
						title.classList.add('menu-item');
						if (title.textContent[0] != '/') {
							title.prepend("/ ");
						}
						showTag(searchMenuItem, searchTag, search);
						break;
					}
					else {
						let dataShowTag = searchMenuItem.getElementsByTagName('data-show-tag')[0];
						if (dataShowTag) {
							dataShowTag.style.display = 'none';
						}
						title.classList.remove('menu-item');
						title.textContent = title.textContent.replace("/ ", '');
					}
				}
			}
		}
	}
}

function showTag(menuItem, tagContent, search) {
	const searchTarget = tagContent.split(' ');
	const indexTag = tagContent.toLowerCase().indexOf(search);
	for (let i = 0; i < searchTarget.length; i++) {
		const indexTarget = searchTarget[i].toLowerCase().indexOf(search);
		if (indexTarget > -1 || search == ' ') {
			if (menuItem.getElementsByTagName('data-show-tag').length === 0) {
				const newTag = document.createElement('data-show-tag');
				newTag.appendChild(document.createElement('a'));
				menuItem.insertBefore(newTag, menuItem.children[0]);
			}
			const dataShowTag = menuItem.getElementsByTagName('data-show-tag')[0];
			const a = dataShowTag.getElementsByTagName('a')[0];
			if (searchTarget.length > 2) {
				if (i < searchTarget.length - 2) {
					a.textContent = searchTarget[i] + ' ' + searchTarget[i + 1] + ' ...';
				}
				else {
					a.textContent = '... ' + searchTarget[i - 1] + ' ' + searchTarget[i];
				}
			}
			else {
				a.textContent = tagContent;
			}
			dataShowTag.style.display = 'inline';
			a.setAttribute('href', menuItem.querySelector('.title').getAttribute('href'));
			a.style.display = 'inline';
		}
		else {
			if (indexTag > -1 && menuItem.getElementsByTagName('data-show-tag').length > 0) {
				menuItem.getElementsByTagName('data-show-tag')[0].style.display = '';
			}
		}
	}
}

function menuItemsSearch(search) {
	const nav = document.getElementById('nav');
	const menuItems = nav.getElementsByTagName('li');
	for (let searchTarget of menuItems) {
		const title = searchTarget.querySelector('.title');
		const dataShowTag = searchTarget.getElementsByTagName('data-show-tag')[0];
		if (title || dataShowTag) {
			let indexMenu, indexTag;
			if (title) {
				indexMenu = title.textContent.toLowerCase().indexOf(search);
				highlightText(title, search);
			}
			if (dataShowTag) {
				const tag = dataShowTag.getElementsByTagName('a')[0];
				indexTag = tag.textContent.toLowerCase().indexOf(search);
				highlightText(tag, search);
			}
			if (indexMenu > -1 || indexTag > -1) {
				searchTarget.style.display = '';
			}
			else {
				searchTarget.style.display = 'none';
			}
		}
	}
}

function highlightText(searchTarget, search) {
	const { textContent } = searchTarget;
	const index = textContent.toLowerCase().indexOf(search);
	if (index > -1 && search != '' && textContent[index - 1] != '/') {
		let hightlightContent = textContent;
		for (let i = 1; i <= search.length; i++) {
			hightlightContent = textContent.substring(0, index) + '<span>' + textContent.substring(index, index + i) + '</span>' + textContent.substring(index + i);
		}
		searchTarget.innerHTML = hightlightContent;
		let span = searchTarget.getElementsByTagName('span');
		for (let searchSpan of span) {
			searchSpan.classList.add('highlight');
		}
	}
	else {
		let span = searchTarget.getElementsByTagName('span');
		for (let searchSpan of span) {
			searchSpan.classList.remove('highlight');
		}
	}
}

function init() {
	document.addEventListener('load', searchOnLoad, true);

	const navTrigger = document.getElementById('nav-trigger');
	if (navTrigger) {
		navTrigger.addEventListener('click', toggleVisibility, true);
	}

	const overlay = document.getElementById('overlay');
	overlay.addEventListener('click', toggleVisibility, true);

	const nav = document.getElementById('nav');
	if (nav) {
		nav.addEventListener('click', toggleVisibility, true);
		const logo = nav.getElementsByTagName('a')[0]
		if (logo) {
			logo.addEventListener('click', searchOnLoad, true);
		}
	}

	const search = document.getElementById('search');
	if (search) {
		search.addEventListener('keyup', onSearchChange, true);
	}

	const searchTrigger = document.getElementById('search-trigger');
	if (searchTrigger) {
		searchTrigger.addEventListener('click', activateSearch, true);
	}

	const activeTopic = document.getElementsByClassName('active-topic')[0];
	if (activeTopic) {
		activeTopic.scrollIntoView();
	}
}

window.onhashchange = searchOnHashChange;

document.addEventListener('DOMContentLoaded', init);