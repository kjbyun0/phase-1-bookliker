
let bookList;

// idxBook is an index of a current book shown. If no book is shown, it is -1.
let idxBook = -1;

// If idxUser is -1, it indicates the user is not in a user list or the book detail is now shown yet.
// I assume user is 'pouros'.
let idxUser = -1;

document.addEventListener("DOMContentLoaded", function() {
    fetch('http://localhost:3000/books')
    .then(resp => resp.json())
    .then(books => {
        //console.log(books);
        bookList = books;
        const lstBooks = document.getElementById('list');
        for (let i = 0; i < books.length; i++) {
            const liBook = document.createElement('li');
            liBook.textContent = books[i].title;
            liBook.style.cursor = 'pointer';
            const pIdx = document.createElement('p');
            pIdx.textContent = i.toString();
            pIdx.hidden = true;
            liBook.appendChild(pIdx);
            lstBooks.appendChild(liBook);

            liBook.addEventListener('click', e => {
                //console.log(e.target);
                idxBook = parseInt(e.target.children[0].textContent, 10);
                displayBook();
            });
        }
    })
    .catch(error => console.log(error));
});

function displayBook() {
    const divShowPanel = document.getElementById('show-panel');
    divShowPanel.innerHTML = '';
    const imgBook = document.createElement('img');
    imgBook.src = bookList[idxBook].img_url;
    const h4Title = document.createElement('h4');
    h4Title.textContent = bookList[idxBook].title;
    const h4Subtitle = document.createElement('h4');
    h4Subtitle.textContent = bookList[idxBook].subtitle;
    const h4Author = document.createElement('h4');
    h4Author.textContent = bookList[idxBook].author;
    const pDesc = document.createElement('p');
    pDesc.textContent = bookList[idxBook].description;

    const ulUsers = document.createElement('ul');
    addUsersToUl(ulUsers);
    const btnLike = document.createElement('button');
    btnLike.textContent = (idxUser !== -1) ? 'UNLIKE' : 'LIKE';
    btnLike.addEventListener('click', e => {
        //console.log(e);
        onClickBtnLike(e);
    });
    divShowPanel.append(imgBook, h4Title, h4Subtitle, h4Author, pDesc, ulUsers, btnLike);
}

function addUsersToUl(ulUsers) {
    ulUsers.innerHTML = '';
    idxUser = -1;
    const userList = bookList[idxBook].users;
    for (let i = 0; i < userList.length; i++) {
        const liUser = document.createElement('li');
        liUser.textContent = userList[i].username;
        ulUsers.appendChild(liUser);
        if (userList[i].id === 1) {
            idxUser = i;
        }
    }
}

function onClickBtnLike(e) {
    const userList = bookList[idxBook].users;
    let userListCopy;
    if (idxUser == -1) {
        userListCopy = [...userList];
        userListCopy.push({
            id: 1,
            username: 'pouros',
        });
    } else {
        userListCopy = [...userList.slice(0,idxUser), ...userList.slice(idxUser+1)];
    }
    //console.log(idxUser, userListCopy);

    fetch(`http://localhost:3000/books/${bookList[idxBook].id}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
        body: JSON.stringify({
            users: userListCopy,
        }),
    })
    .then(resp => {
        //console.log(resp);
        bookList[idxBook].users = userListCopy;
        const divShowPanel = document.getElementById('show-panel');
        const ulUsers = divShowPanel.children[5]
        addUsersToUl(ulUsers);
        const btnLike = divShowPanel.children[divShowPanel.children.length - 1];
        btnLike.textContent = (idxUser !== -1) ? 'UNLIKE' : 'LIKE';
    })
    .catch(error => console.log(error));
}