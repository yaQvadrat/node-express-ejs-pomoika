const searchForm = document.getElementById('searchForm');
const searchQuery = document.getElementById('searchQuery');
const orderBy = document.getElementById('orderBy');
const inStock = document.getElementById('inStock');

const confirmDialog = document.getElementById('confirmDialog');
const confirmButton = document.getElementById('confirmButton');
const bookDialog = document.getElementById('bookDialog');
const bookManageForm = document.getElementById('bookManageForm');

let currentAction = '';
let targetElement = null;

const actions = {
    delete: () => {
        if (!targetElement) {
            return;
        }
        const bookId = targetElement.getAttribute('data-id');
        fetch(`/books/${bookId}`, {
            method: 'DELETE'
        }).then(response => {
            if (response.ok) {
                targetElement.remove();
                targetElement = null;
            } else {
                alert('Error deleting book');
            }
        }).catch(error => console.error(error));
    },

    add: () => {
        let formData = new FormData(bookManageForm);

        fetch('/books', {
            method: 'POST',
            body: formData,
        }).then(() => location.reload())
        .catch(error => console.error(error));
    },

    edit: () => {
        if (!targetElement) {
            return
        }

        const bookId = targetElement.getAttribute('data-id');
        let formData = new FormData(bookManageForm);

        fetch(`/books/${bookId}`, {
            method: 'PUT',
            body: formData,
        }).then(() => location.reload())
        .catch((error) => console.error(error));
    }
}

document.querySelectorAll('.btn-need-confirm').forEach((el) => {
    el.addEventListener('click', (e) => {
        currentAction = e.currentTarget.getAttribute('name');
        targetElement = e.currentTarget.closest('.container-book');
        confirmDialog.showModal();
    });
});

confirmButton.addEventListener('click', () => {
    if (actions[currentAction])
        actions[currentAction]();
    else
        console.error(`Unrecognized action: ${currentAction}.`);
    confirmDialog.close();
})

searchForm.addEventListener('change', function (event) {
    filterBooks();
});

searchForm.addEventListener('submit', function (event) {
    event.preventDefault();
});

bookManageForm.addEventListener('submit', function (event) {
    event.preventDefault();
    bookDialog.close();
    if (actions[currentAction])
        actions[currentAction]();
    else
        console.error(`Unrecognized action: ${currentAction}.`);
});

function filterBooks() {
    fetch('/books/search?' + new URLSearchParams({
        query: searchQuery.value,
        in_stock: inStock.checked,
        order_by: orderBy.value
    }).toString()).then(response => response.text()).then(html => {
        document.getElementById('booksContainer').innerHTML = html;

        document.querySelectorAll('.btn-need-confirm').forEach((el) => {
            el.addEventListener('click', (e) => {
                currentAction = e.currentTarget.getAttribute('name');
                targetElement = e.currentTarget.closest('.container-book');
                confirmDialog.showModal();
            });
        });
    }).catch(error => console.error(error));
}

function openDialogAdd() {
    document.getElementById('titleDialog').innerText = 'Add new book';
    document.getElementById('book-title').value = '';
    document.getElementById('book-description').value = '';
    document.getElementById('book-authors').value = '';
    document.getElementById('book-release-date').value = '';
    currentAction = 'add';
    bookDialog.showModal();
}

function openDialogEdit(bookId) {
    document.getElementById('titleDialog').innerText = 'Edit book';
    fetch(`/books/${bookId}`, { headers: { 'accept': 'application/json' } })
    .then(response => response.json())
    .then(data => {
        document.getElementById('book-title').value = data.title;
        document.getElementById('book-description').value = data.description;
        document.getElementById('book-authors').value = data.authors.join(', ');
        document.getElementById('book-release-date').value = data.releaseDate;
    }).catch(error => console.error(error));
    currentAction = 'edit';
    targetElement = document.querySelector(`[data-id='${bookId}']`);
    bookDialog.showModal();
}  