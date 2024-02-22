
class book_t {
  constructor(title, author, year, is_readed) {
    this.m_title = title;
    this.m_author = author;
    this.m_year = year;
    this.m_is_readed = is_readed;
  }
}

class books_manager {
  constructor() {
    this.m_books = [];
  }

  add_book(title, author, year, is_readed) {
    this.m_books.push(new book_t(title, author, year, is_readed));
  }

  get_books() {
    return this.m_books;
  }

  update_book_lists() {
    const unfinished_book_obj = document.getElementById('unfinished-books-list');
    const finished_book_obj = document.getElementById('finished-books-list');
  
    unfinished_book_obj.innerHTML = '';
    finished_book_obj.innerHTML = '';
  
    this.m_books.forEach(book => {
      const book_div = document.createElement('div');
      book_div.textContent = `${book.m_title} by ${book.m_author} (${book.m_year})`;

      if (book.m_is_readed)
        finished_book_obj.appendChild(book_div);
      else
        unfinished_book_obj.appendChild(book_div);
    });
  }
}

window.books_manager_instance = new books_manager();
window.books_manager_instance.update_book_lists();

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('book_form');

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    alert('shit has been called');

    const title = document.getElementById('title').value;
    const author = document.getElementById('author').value;
    const year = parseInt(document.getElementById('year').value, 10);
    const readed = document.getElementById('read').checked;
  });

  window.books_manager_instance.add_book(title, author, year, readed);
  window.books_manager_instance.update_book_lists();
});