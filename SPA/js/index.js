const elements = {
	usersContainer: document.querySelector( ".users-page__item-box" ),
	newUserNameInput: document.querySelector( ".users-page__new-item .user-item__name" ),
	newUserPhoneInput: document.querySelector( ".users-page__new-item .user-item__phone" ),
	newUserNameError: document.querySelector( ".user-item__validation-error_name" ),
	newUserPhoneError: document.querySelector( ".user-item__validation-error_phone" ),
	newUserButton: document.querySelector( ".button_add-user" ),
};

// В конце: оставить плейсхолдеры фетч апи.

const regName = /^[a-zа-я]+$/i;
const regPhone = /^[a-zа-я]+$/i;

const users = [
	{
		id: 0,
		name: "TestUser1",
		phone: "+7-901-949-53-17",
		isEditing: false
	},
	{
		id: 12,
		name: "TestUser2",
		phone: "+7-901-949-53-17",
		isEditing: false
	},
	{
		id: 22,
		name: "Роман",
		phone: "+7-901-949-53-17",
		isEditing: false
	},
	{
		id: 32,
		name: "TestUser3",
		phone: "+7-901-949-53-17",
		isEditing: false
	}
];

const getUserTemplateHTML = ( userId, userName, userPhone ) => {
	return `<div class="user-item" data-id="${userId}">
		<div class="user-item__input-box">
			<label class="user-item__input-wrapper">
				<input class="user-item__name" type="text" placeholder="Введите имя" value="${userName}" readonly>
				<span class="user-item__validation-error" style="display: none;"></span>
			</label>
			<label class="user-item__input-wrapper">
				<input class="user-item__phone" type="text" placeholder="+7-999-999-99-99" value="${userPhone}" readonly>
				<span class="user-item__validation-error" style="display: none;"></span>
			</label>
		</div>
		<div class="user-item__button-box">
			<button class="button button_green button_edit-user">Редактировать</button>
			<button class="button button_red button_remove-user">Удалить</button>
		</div>
	</div>`;
};

const initUsersHTML = () => {
	users.forEach( user => elements.usersContainer.insertAdjacentHTML(
		"beforeEnd",
		getUserTemplateHTML( user.id, user.name, user.phone )
	));
};

const getMessageValidationError = ( value, reg ) => {
	if (!value.length) return "Заполните поле!"; 
	if (!reg.test( value )) return "Поле не соответствует формату!";

	return false;
}

const getValidationInfo = ( name, phone ) => {
	const result = {
		nameErrorMessage: false,
		phoneErrorMessage: false
	};

	result.nameErrorMessage = getMessageValidationError( name, regName );
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
	const userIndex = getUserIndex( id );
	if (userIndex === -1) return;

	const userItemHTML = document.querySelector( `.user-item[data-id="${id}"]` );

	if (isEditing) {
		userItemHTML.querySelector( ".user-item__name" ).focus();
		userItemHTML.querySelector( ".user-item__name" ).selectionStart = userItemHTML.querySelector( ".user-item__name" ).value.length;
	}
	else {
		// Проверка, если не совпадают, аналогично с отрисовкой.
		users[userIndex].name = name;
		users[userIndex].phone = phone;
	}

	users[userIndex].isEditing = isEditing;

	userItemHTML.querySelector( ".user-item__name" ).readOnly = !isEditing;
	userItemHTML.querySelector( ".user-item__phone" ).readOnly = !isEditing;

	userItemHTML.querySelector( ".button_edit-user" ).innerHTML = isEditing ? "Сохранить" : "Редактировать";
};

const removeUser = id => {
	const userIndex = getUserIndex( id );
	if (userIndex === -1) return;

	users.splice( userIndex, 1 );
	document.querySelector( `.user-item[data-id="${id}"]` ).remove();
};



initUsersHTML();

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