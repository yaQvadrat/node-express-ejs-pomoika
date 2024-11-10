const confirmDialog = document.getElementById('confirmDialog');
const confirmButton = document.getElementById('confirmButton');
const bookDialog = document.getElementById('bookDialog');
const bookManageForm = document.getElementById('bookManageForm');
const bookGiveDialog = document.getElementById('bookGiveDialog');
const bookGiveForm = document.getElementById('bookGiveForm');

const bookId = document.querySelector('.container-book').dataset.id;

let currentAction = '';
const actions = {
    give: () => {
        let formData = new FormData(bookGiveForm);
        formData.append('status', 'NOT_AVAILABLE');

        fetch(`/books/${bookId}`, {
            method: 'PUT',
            body: formData,
        }).then(() => location.reload())
        .catch(error => console.error(error));
    },

    return: () => {
        let formData = new FormData();
        formData.append('status', 'IN_STOCK');
        formData.append('returnDate', '');
        formData.append('givenTo', '');

        fetch(`/books/${bookId}`, {
            method: 'PUT',
            body: formData
        }).then((response) => response.json())
            .then((data) => {
                if (data.message)
                    alert(data.message);
                else
                    location.reload();
            })
            .catch((error) => console.error(error));
    },

    edit: () => {
        let formData = new FormData(bookManageForm);

        fetch(`/books/${bookId}`, {
            method: 'PUT',
            body: formData,
        }).then(() => location.reload())
        .catch(error => console.error(error));
    },

    delete: () => {
        fetch(`/books/${bookId}`, {
            method: 'DELETE'
        }).then(response => {
            if (response.ok) {
                location.href = '/books';
            } else {
                alert('Error deleting book.');
            }
        }).catch(error => console.error(error));
    }
};

confirmButton.addEventListener('click', () => {
    if (actions[currentAction])
        actions[currentAction]();
    else
        console.error(`Unrecognized action: ${currentAction}.`);
    confirmDialog.close();
})

document.querySelectorAll('.btn-need-confirm').forEach((button) => {
    button.addEventListener('click', (e) => {
        confirmDialog.showModal();
    });
});

document.querySelectorAll('button.manage-item').forEach((button) => {
    button.addEventListener('click', (e) => {
        currentAction = e.currentTarget.getAttribute('name');
    });
});

document.querySelectorAll('form').forEach((form) => {
    form.addEventListener('submit', function (event) {
        event.preventDefault();
        if (actions[currentAction]) {
            actions[currentAction]();
        } else {
            console.error(`Unrecognized action: ${currentAction}.`);
        }
    });
});

function openDialogEdit() {
    document.getElementById('titleDialog').innerText = 'Edit book'
    fetch(`/books/${bookId}`, { headers: { 'accept': 'application/json' } })
    .then(response => response.json())
    .then(data => {
            document.getElementById('book-title').value = data.title;
            document.getElementById('book-description').value = data.description;
            document.getElementById('book-authors').value = data.authors.join(', ');
            document.getElementById('book-release-date').value = data.releaseDate;
    }).catch(error => console.error(error));
    bookDialog.showModal();
}