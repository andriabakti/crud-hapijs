const { addBookHandler, getAllBooksHandler, getBookDetailHandler, editBookHandler, removeBookHandler } = require('./handler')

const routes = [
	{
		method: 'POST',
		path: '/books',
		handler: addBookHandler
	},
	{
		method: 'GET',
		path: '/books',
		handler: getAllBooksHandler
	},
	{
		method: 'GET',
		path: '/books/{bookId}',
		handler: getBookDetailHandler
	},
	{
		method: 'PUT',
		path: '/books/{bookId}',
		handler: editBookHandler
	},
	{
		method: 'DELETE',
		path: '/books/{bookId}',
		handler: removeBookHandler
	}
]

module.exports = routes
