'use strict';


const input = document.getElementById('select-cities'),
	label = document.querySelector('.label'),
	button = document.querySelector('.button'),
	closeButton = document.querySelector('.close-button'),
	dropdownListsCol = document.querySelectorAll('.dropdown-lists__col'),
	dropdownLists = document.querySelector('.dropdown-lists');
let responseArr = [];

const listAutocomplete = document.getElementById('list--autocomplete'),
	dropdownListsListSelect = document.querySelector('#dropdown-lists__list'),
	listCountry = document.querySelector('.dropdown-lists__list--default');	

button.classList.add('disabled');


// Прелоадер
const loader = document.createElement('div');
loader.innerHTML = `
	<div class="loader">
	<div class="inner one"></div>
	<div class="inner two"></div>
	<div class="inner three"></div>
	</div>`;
document.body.append(loader);

document.querySelector('.dropdown-lists').addEventListener('click', event => {
	if (event.target.matches('.dropdown-lists__city') ||
		event.target.matches('.dropdown-lists__country')) {
		label.textContent = '';
		input.value = event.target.textContent;
		closeButton.style.display = 'block';
		responseArr.forEach(item => {
			item.cities.forEach(elem => {
				if (elem.name === input.value) {
					button.classList.remove('disabled');
					button.setAttribute("target", "_blank");
					button.href = elem.link;
				} else if (input.value === item.country) {
					button.classList.add('disabled');
					button.removeAttribute("target", "_blank");
				}
			});
		});
	}
});


const divList = (item, classItem, arg) => {
	const div = document.createElement('div');
	div.classList.add(classItem);
	switch (classItem) {
		case 'dropdown-lists__countryBlock':
			if (arg === 4) {
				div.innerHTML = `
					<div class="dropdown-lists__line">
					<div class="dropdown-lists__city">Ничего не найдено</div>
					</div>
			`;
			}
			if (arg === 3) {
				div.innerHTML = `
					<div class="dropdown-lists__line">
					<div class="dropdown-lists__city">${item.name}</div>
					<div class="dropdown-lists__count">${item.count}</div>
					</div>
			`;
			}
			if (arg === 2) {
				div.innerHTML = `
					<div class="dropdown-lists__total-line">
					<div class="dropdown-lists__country">${item.country}</div>
					<div class="dropdown-lists__count">${item.count}</div>
					</div>
			`;
			}
			if (arg === 1) {
				div.innerHTML = `
					${divList(item, 'dropdown-lists__countryBlock', 2).innerHTML}
					<div class="dropdown-lists__line">
					<div class="dropdown-lists__city dropdown-lists__city--ip">${item.cities[0].name}</div>
					<div class="dropdown-lists__count">${item.cities[0].count}</div>
					</div>
					<div class="dropdown-lists__line">
					<div class="dropdown-lists__city">${item.cities[1].name}</div>
					<div class="dropdown-lists__count">${item.cities[1].count}</div>
					</div>
					<div class="dropdown-lists__line">
					<div class="dropdown-lists__city">${item.cities[2].name}</div>
					<div class="dropdown-lists__count">${item.cities[2].count}</div>
					</div>
					</div>
				`;
			}
			break;
		case 'dropdown-lists__line':
			div.innerHTML = `
				<div class="dropdown-lists__city">${item.name}</div>
				<div class="dropdown-lists__count">${item.count}</div>
				`;
			break;
		default:
			break;
	}
	return div;
};


const listThree = () => {
	let count = 0, 
		cityArray = [];
	input.addEventListener('input', () => {
		
		dropdownListsListSelect.classList.add('dropdown-lists__list--select');
		listCountry.classList.add('dropdown-lists__list--select');
		listAutocomplete.classList.remove('dropdown-lists__list--autocomplete');

		dropdownListsCol[2].textContent = '';
		responseArr.forEach(item => {
			item.cities.forEach(elem => {
				cityArray.push(elem);
				if (elem.name.toLowerCase().startsWith(input.value.toLowerCase())) {
					const div = divList(elem, 'dropdown-lists__countryBlock', 3);
					dropdownListsCol[2].appendChild(div);
				} else {
					count ++;
				}
				if (input.value === '') {
					listAutocomplete.classList.add('dropdown-lists__list--autocomplete');
					listCountry.classList.remove('dropdown-lists__list--select');
					label.textContent = 'Страна или город';
				}
			});
		});
		if (count === cityArray.length) {
			const div = divList(1, 'dropdown-lists__countryBlock', 4);
			dropdownListsCol[2].appendChild(div);
		}
		count = 0;
		cityArray = [];
	});
};
listThree();


const listTwo = () => {
	let step1 = 0, step2 = 100;
	dropdownListsCol[0].addEventListener('click', event => {
		if (event.target.closest('.dropdown-lists__total-line')) {
			responseArr.forEach(item => {
				const { cities, count, country } = item;
				if (event.target.textContent === country ||
					event.target.textContent === count + '') {

					const dropdownListsListSelect = document.querySelector('#dropdown-lists__list'),
						listCountry = document.querySelector('.dropdown-lists__list--default');	

					dropdownListsCol[1].textContent = '';
					const div = divList(item, 'dropdown-lists__countryBlock', 2);	

					cities.forEach(city => {
						const cityOfCountry = divList(city, 'dropdown-lists__line', 2);
						div.appendChild(cityOfCountry);
						});
					dropdownListsCol[1].appendChild(div);

					const animeClickLeft = () => {
						const requestId = requestAnimationFrame(animeClickLeft);
						dropdownListsListSelect.classList.remove('dropdown-lists__list--select');
						dropdownLists.style.display = 'block';

						step1 -= 10;
						step2 -= 10;
						if (step1 > -105) {
							listCountry.style.position = 'relative';
							listCountry.style.left = step1 + '%';
							dropdownListsListSelect.style.position = 'relative';
							dropdownListsListSelect.style.left = step2 + '%';
						} else {
							cancelAnimationFrame(requestId);
							listCountry.classList.add('dropdown-lists__list--select');
							listCountry.style.left = '0%';
							dropdownListsListSelect.style.left = '0%';
							dropdownLists.style.display = 'flex';
							step1 = 0;
							step2 = 100;
						}
					};
					animeClickLeft();

					dropdownListsCol[1].addEventListener('click', event =>{
						if (event.target.closest('.dropdown-lists__total-line')) {
							
							step2 = - step2;
							const animeClick = () => {
								const requestId = requestAnimationFrame(animeClick);
								listCountry.classList.remove('dropdown-lists__list--select');
								dropdownLists.style.display = 'block';
								step1 += 10;
								step2 += 10;
								if (step2 < 0) {
									dropdownListsListSelect.style.left = step2 + '%';
									listCountry.style.left = step1 + '%';
									
								} else {
									cancelAnimationFrame(requestId);
									dropdownListsListSelect.classList.add('dropdown-lists__list--select');
									listCountry.style.left = '0%';
									dropdownListsListSelect.style.left = '0%';
									dropdownLists.style.display = 'flex';
									step1 = 0;
									step2 = -100;
								}
							};
							animeClick();
						}
					});
				}
			});
		}
	});
};

	
const defaultList = () => {
	responseArr.forEach(item => {
		item.cities.sort((a, b) => {
			return (b.count - a.count);
		});
		const div = divList(item, 'dropdown-lists__countryBlock', 1);
		dropdownListsCol[0].appendChild(div);
		listTwo();
	});
};

const sortResponseArr = () => {
	let cookie = document.cookie;
	cookie = cookie.match(/[^prompt=]/g).join('');
	if (cookie === 'EN') {
		[responseArr[0], responseArr[2]] = [responseArr[2], responseArr[0]];
	}
	if (cookie === 'DE') {
		[responseArr[0], responseArr[1]] = [responseArr[1], responseArr[0]];
	} 
};


const getData = local => {
	fetch(`http://localhost:3000/${local}`)
	.then(response => {
		if (response.status !== 200) {
	        throw new Error('Что-то пошло не так...');
	    }
		loader.classList.toggle('loader__activ');
		return response.json();
	})
	.then(response => {
		localStorage.setItem('response', JSON.stringify(response));
		responseArr = JSON.parse(localStorage.getItem('response'));
		sortResponseArr();
	})
	.catch(error => {
		loader.classList.toggle('loader__activ');
		console.log(error);
	});
};


const init = () => {
	let cookie = document.cookie;
	if (cookie === '') {
		const promt = prompt('Введите локаль: RU, EN, DE').toUpperCase();
		document.cookie = `promt=${promt}`;
		getData(promt);
	} else {
		if (localStorage.response) {
			responseArr = JSON.parse(localStorage.getItem('response'));
			loader.classList.toggle('loader__activ');
			sortResponseArr();
		} else {
			cookie = cookie.match(/[^prompt=]/g).join('');
			getData(cookie);
		}
	}
};
init();


input.addEventListener('click', () => {
	defaultList();
});


closeButton.addEventListener('click', () => {
	input.value = '';
	closeButton.style.display = 'none';
	dropdownListsCol.forEach(item => {
		item.textContent = '';
	});
	listCountry.classList.remove('dropdown-lists__list--select');
	label.textContent = 'Страна или город';
	button.classList.add('disabled');
});

