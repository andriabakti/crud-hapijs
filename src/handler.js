const { nanoid } = require('nanoid')
const books = require('./books')

const addBookHandler = (request, h) => {
	const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload

	const id = nanoid(16)
	const finished = pageCount === readPage
	const insertedAt = new Date().toISOString()
	const updatedAt = insertedAt

	if (name === '') {
		const response = h.response({
			status: 'fail',
			message: 'Gagal menambahkan buku. Mohon isi nama buku'
		})
		response.code(400)
		return response
	} else if (readPage > pageCount) {
		const response = h.response({
			status: 'fail',
			message: 'Gagal menambahkan buku. readpage tidak boleh lebih besar dari pageCount'
		})
		response.code(400)
		return response
	}

	const newBook = {
		id, name, year, author, summary, publisher, pageCount, readPage, finished, reading, insertedAt, updatedAt
	}
	books.push(newBook)

	const isSuccess = books.filter((book) => book.id === id).length > 1
	if (isSuccess) {
		const response = h.response({
			status: 'success',
			message: 'Buku berhasil ditambahkan',
			data: {
				bookId: id
			}
		})
		response.code(201)
		return response
	}

	const response = h.response({
		status: 'error',
		message: 'B' + 'uku gagal ditambahkan'
	})
	response.code(500)
	return response
}

const getAllBooksHandler = (request, h) => {
	const { name, reading, finished } = request.query

	let result
	if (name) {
		const bookByName = books.find((item) => {
			if (item.name === name) {
				return true
			}
		})
		result = bookByName
	} else if (reading) {
		const bookOnReading = books.filter((item) => item.reading === reading)
		result = bookOnReading
	} else if (finished) {
		const finishedBook = books.filter((item) => item.finished === finished)
		result = finishedBook
	}

	const response = h.response({
		status: 'success',
		data: {
			books: result ?? books
		}
	})
	response.code(200)
	return response
}

const getBookDetailHandler = (request, h) => {
	const { bookId } = request.params
	const book = books.filter((item) => item.id === bookId)[0]

	if (book !== undefined) {
		const response = h.response({
			status: 'success',
			data: {
				book
			}
		})
		response.code(200)
		return response
	}

	const response = h.response({
		status: 'fail',
		message: 'Buku tidak ditemukan'
	})
	response.code(404)
	return response
}

const editBookHandler = (request, h) => {
	const { bookId } = request.params
	const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload
	const updatedAt = new Date().toISOString()

	if (name === '') {
		const response = h.response({
			status: 'fail',
			message: 'Gagal menambahkan buku. Mohon isi nama buku'
		})
		response.code(400)
		return response
	} else if (readPage > pageCount) {
		const response = h.response({
			status: 'fail',
			message: 'Gagal menambahkan buku. readpage tidak boleh lebih besar dari pageCount'
		})
		response.code(400)
		return response
	}

	const index = books.findIndex((item) => item.id === bookId)
	if (index !== -1) {
		books[index] = {
			...books[index],
			name,
			year,
			author,
			summary,
			publisher,
			pageCount,
			readPage,
			reading,
			updatedAt
		}

		const response = h.response({
			status: 'success',
			message: 'Buku berhasil diperbarui'
		})
		response.code(200)
		return response
	}

	const response = h.response({
		status: 'fail',
		message: 'Gagal memperbarui buku. Id tidak ditemukan'
	})
	response.code(404)
	return response
}

const removeBookHandler = (request, h) => {
	const { bookId } = request.params
	const index = books.findIndex((item) => item.id === bookId)

	if (index !== -1) {
		books.splice(index, 1)
		const response = h.response({
			status: 'success',
			message: 'Buku berhasil dihapus'
		})
		response.code(200)
		return response
	}

	const response = h.response({
		status: 'fail',
		message: 'Buku gagal dihapus. Id tidak ditemukan'
	})
	response.code(404)
	return response
}

module.exports = { addBookHandler, getAllBooksHandler, getBookDetailHandler, editBookHandler, removeBookHandler }
