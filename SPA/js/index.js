const elements = {
	usersContainer: document.querySelector( ".users-page__item-box" ),
	newUserNameInput: document.querySelector( ".users-page__new-user .user-item__name" ),
	newUserPhoneInput: document.querySelector( ".users-page__new-user .user-item__phone" ),
	newUserNameError: document.querySelector( ".user-item__validation-error_name" ),
	newUserPhoneError: document.querySelector( ".user-item__validation-error_phone" ),
	newUserButton: document.querySelector( ".button_add-user" ),
};

// Если нужна строгая проверка только на буквы, можно её включить,
// в ТЗ написано, что нужна валидация на не пустоту.
// const regName = /^[a-zа-я]+$/i;
const regPhone = /^8-\d{3}-\d{3}-\d{2}-\d{2}$/;

// Это статические данные, но вообще изначально массив должен быть пустой,
// и в функции initUsers происходило бы его заполнение путем получения данных через fetch.
const users = [
	{
		id: 0,
		name: "TesterOne",
		phone: "8-901-949-53-17",
		isEditing: false
	},
	{
		id: 12,
		name: "TesterSecond",
		phone: "8-901-949-53-17",
		isEditing: false
	},
	{
		id: 22,
		name: "Роман",
		phone: "8-901-949-53-17",
		isEditing: false
	},
	{
		id: 32,
		name: "TestThird",
		phone: "8-901-949-53-17",
		isEditing: false
	}
];

const onInputChangeValue = input => {
	const symbols = [...input.value].filter( symbol => !isNaN( parseInt( symbol ) ) ).slice( 0, 11 );

	if (symbols.length >= 2) symbols.splice( 1, 0, "-" );
	if (symbols.length >= 6) symbols.splice( 5, 0, "-" );
	if (symbols.length >= 10) symbols.splice( 9, 0, "-" );
	if (symbols.length >= 13) symbols.splice( 12, 0, "-" );

	input.value = symbols.join( "" );
};

const getUserTemplateHTML = ( userId, userName, userPhone ) => {
	return `<div class="user-item" data-id="${userId}">
		<div class="user-item__input-box">
			<label class="user-item__input-wrapper">
				<input class="user-item__name" type="text" placeholder="Введите имя" value="${userName}" readonly>
				<span class="user-item__validation-error" style="display: none;"></span>
			</label>
			<label class="user-item__input-wrapper">
				<input class="user-item__phone" type="text" placeholder="8-999-999-99-99" value="${userPhone}" readonly oninput="onInputChangeValue( this );">
				<span class="user-item__validation-error" style="display: none;"></span>
			</label>
		</div>
		<div class="user-item__button-box">
			<button class="button button_green button_edit-user">Редактировать</button>
			<button class="button button_red button_remove-user">Удалить</button>
		</div>
	</div>`;
};

const initUsers = () => {
	// Функцию обернуть в async.
	// Внутри функцию разбить на try catch блоки.
	// Это все относится к try:
	// const response = await fetch( url );
	// if (!response.ok) throw "Проблемка возникла...";	
	// const data = await response.json();
	// data.forEach( user => {
	// 	users.push({
	// 		id: user.id,
	// 		name: user.name,
	// 		phone: user.phone,
	// 		isEditing: false
	// 	});
	// });

	users.forEach( user => elements.usersContainer.insertAdjacentHTML(
		"beforeEnd",
		getUserTemplateHTML( user.id, user.name, user.phone )
	));
};

const getMessageValidationError = ( value, reg ) => {
	if (!value.length) return "Заполните поле!"; 
	if (reg && !reg.test( value )) return "Поле не соответствует формату!";

	return false;
}

const getValidationInfo = ( name, phone ) => {
	const result = {
		nameErrorMessage: false,
		phoneErrorMessage: false
	};

	result.nameErrorMessage = getMessageValidationError( name );
	result.phoneErrorMessage = getMessageValidationError( phone, regPhone );
	result.isError = !!(result.nameErrorMessage || result.phoneErrorMessage);

	return result;
};

const setVisibleError = ( errorElement, message ) => {
	if (!message) return errorElement.style.display = "none";
	message = `*${message}`;

	if (message !== errorElement.innerHTML) errorElement.innerHTML = message;
	errorElement.style.display = "inline-block";
};

const getUserIndex = userId => {
	for (let index = 0; index < users.length; index++) {
		if (users[index].id === userId) return index;
	}

	return -1;
};

const addUser = ( name, phone ) => {
	// Функцию обернуть в async.
	// Внутри функцию разбить на try catch блоки.
	// Это все относится к try:
	// const response = await fetch( url, {
	// 	method: "POST",
	// 	headers: {
	// 		// ...
	// 	},
	// 	body: JSON.stringify({ id, name, phone })
	// });
	// if (!response.ok) throw "Проблемка возникла...";

	const id = new Date().getTime(); // в качестве заглушки
	users.push({
		id,
		name,
		phone,
		isEditing: false
	});

	elements.usersContainer.insertAdjacentHTML( "beforeEnd", getUserTemplateHTML( id, name, phone ) );

	elements.newUserNameInput.value = "";
	elements.newUserPhoneInput.value = "";
};

const setUser = ( id, isEditing, name, phone ) => {
	// Функцию обернуть в async.
	// Внутри функцию разбить на try catch блоки.
	// Это все относится к try:

	const userIndex = getUserIndex( id );
	if (userIndex === -1) return;

	const userItem = document.querySelector( `.user-item[data-id="${id}"]` );
	const nameInput = userItem.querySelector( ".user-item__name" );
	const phoneInput = userItem.querySelector( ".user-item__phone" );

	// isEditing - если true, то item находится в состоянии редактирования, то есть кликнули
	// кнопку "Редактировать", иначе - была нажата кнопка "Сохранить"
	if (isEditing) {
		nameInput.focus();
		nameInput.selectionStart = nameInput.value.length;
	}
	else {
		// const response = await fetch( url, {
		// 	method: "PUT",
		// 	headers: {
		// 		// ...
		// 	},
		// 	body: JSON.stringify({ id, name, phone })
		// });
		// if (!response.ok) throw "Проблемка возникла...";

		if (users[userIndex].name !== name) {
			users[userIndex].name = name;
			nameInput.setAttribute( "value", name );
		}

		if (users[userIndex].phone !== phone) {
			users[userIndex].phone = phone;
			phoneInput.setAttribute( "value", phone );
		}
	}

	users[userIndex].isEditing = isEditing;

	nameInput.readOnly = !isEditing;
	phoneInput.readOnly = !isEditing;
	
	userItem.querySelector( ".button_edit-user" ).innerHTML = isEditing ? "Сохранить" : "Редактировать";
};

const removeUser = id => {
	// Функцию обернуть в async.
	// Внутри функцию разбить на try catch блоки.
	// Это все относится к try:
	
	const userIndex = getUserIndex( id );
	if (userIndex === -1) return;

	// const response = await fetch( `${url}/${id}`, {
	// 	method: "DELETE",
	// 	headers: {
	// 		// ...
	// 	}
	// });
	// if (!response.ok) throw "Проблемка возникла...";

	users.splice( userIndex, 1 );
	document.querySelector( `.user-item[data-id="${id}"]` ).remove();
};



initUsers();

elements.usersContainer.addEventListener( "click", event => {
	const clickedElement = event.target;
	const userId = parseInt( clickedElement.closest( ".user-item" )?.dataset.id );
	// Как я помню, оператор ?. поддерживается не всеми браузерами, в таких ситуациях мне помогает Babel в Webpack/GULP.
	if (isNaN( userId )) return;

	if (clickedElement.classList.contains( "button_edit-user" )) {
		const name = elements.usersContainer.querySelector( `.user-item[data-id="${userId}"] .user-item__name` ).value;
		const phone = elements.usersContainer.querySelector( `.user-item[data-id="${userId}"] .user-item__phone` ).value;

		if (clickedElement.innerHTML === "Сохранить") {
			const { isError, nameErrorMessage, phoneErrorMessage } = getValidationInfo( name, phone );
			const errorElements = elements.usersContainer.querySelectorAll( `.user-item[data-id="${userId}"] .user-item__validation-error` );

			if (!isError) setUser( userId, false, name, phone );

			setVisibleError( errorElements[0], nameErrorMessage );
			setVisibleError( errorElements[1], phoneErrorMessage );
		}
		else {
			setUser( userId, true );
		}
	}
	else if (clickedElement.classList.contains( "button_remove-user" )) {
		removeUser( userId );
	}
});

elements.newUserButton.addEventListener( "click", event => {
	event.preventDefault();

	const name = elements.newUserNameInput.value;
	const phone = elements.newUserPhoneInput.value;

	const { isError, nameErrorMessage, phoneErrorMessage } = getValidationInfo( name, phone );
	if (!isError) addUser( name, phone );

	setVisibleError( elements.newUserNameError, nameErrorMessage );
	setVisibleError( elements.newUserPhoneError, phoneErrorMessage );
});

document.querySelectorAll( ".user-item__phone" ).forEach( phoneInput => {
	phoneInput.addEventListener( "input", () => onInputChangeValue( phoneInput ) );
});