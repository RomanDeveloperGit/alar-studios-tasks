const elements = {
	usersContainer: document.querySelector( ".users-page__item-box" ), // через event.target чекать элемент
	newUserName: document.querySelector( ".users-page__new-item .user-item__name" ),
	newUserPhone: document.querySelector( ".users-page__new-item .user-item__phone" ),
	newUserButton: document.querySelector( ".button_add-user" )
};

const users = [
	{
		name: "Тест1",
		phone: "+7 (901) 949 53-17",
		nameError: false,
		phoneError: false,
		isEditing: false
	},
	{
		name: "Тест2",
		phone: "+7 (901) 949 53-17",
		nameError: false,
		phoneError: false,
		isEditing: false
	},
	{
		name: "Тест3",
		phone: "+7 (901) 949 53-17",
		nameError: false,
		phoneError: false,
		isEditing: false
	},
	{
		name: "Тест4",
		phone: "+7 (901) 949 53-17",
		nameError: false,
		phoneError: false,
		isEditing: false
	}
];

// Временно, потом провести точечное удаление/добавление в список, не весь массив рендерить заново.
const renderElements = () => {
	console.log( users );

	elements.usersContainer.innerHTML = "";

	users.forEach( ( item, index ) => {
		elements.usersContainer.insertAdjacentHTML(
			"beforeEnd",
			`<div class="user-item">
				<div class="user-item__input-box">
					<div class="user-item__input-wrapper">
						<input class="user-item__name" type="text" placeholder="Введите имя" value="${item.name}" ${!item.isEditing ? "readonly" : ""}>
						${item.nameError ? `<span class="user-item__validation-error">*Заполните поле!</span>` : ""}
					</div>
					<div class="user-item__input-wrapper">
						<input class="user-item__phone" type="text" placeholder="+7 (901) 949 53-17" value="${item.phone}" ${!item.isEditing ? "readonly" : ""}>
						${item.phoneError ? `<span class="user-item__validation-error">*Заполните поле корректно!</span>` : ""}
					</div>
				</div>
				<div class="user-item__button-box" data-index="${index}">
					<button class="button button_green button_edit">Редактировать</button>
					<button class="button button_red button_delete">Удалить</button>
				</div>
			</div>`
		);
	});
};

const addUser = ( name, phone ) => {
	users.push({ 
		name,
		phone,
		nameError: false,
		phoneError: false,
		isEditing: false
	});

	renderElements();
};

const removeUser = index => {
	delete users[index];

	renderElements();
};

renderElements();

elements.usersContainer.addEventListener( "click", event => {
	if (event.target.classList.contains( "button_delete" )) {
		const userItemId = event.target.parentNode.dataset.index;

		removeUser( userItemId );
	}

	// removeUser( index )
});

elements.newUserButton.addEventListener( "click", event => {
	event.preventDefault();

	addUser( elements.newUserName.value, elements.newUserPhone.value );
});