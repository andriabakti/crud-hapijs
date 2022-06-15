import { nanoid } from 'nanoid'
import books from './books.js'

const addBookHandler = (request, h) => {
	const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload

	const id = nanoid(16)
	const finished = pageCount === readPage
	const insertedAt = new Date().toISOString()
	const updatedAt = insertedAt

	if (!name) {
		const response = h.response({
			status: 'fail',
			message: 'Gagal menambahkan buku. Mohon isi nama buku'
		})
		response.code(400)
		return response
	}
	if (readPage > pageCount) {
		const response = h.response({
			status: 'fail',
			message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount'
		})
		response.code(400)
		return response
	}

	const newBook = {
		id, name, year, author, summary, publisher, pageCount, readPage, finished, reading, insertedAt, updatedAt
	}
	books.push(newBook)

	const isSuccess = books.filter((book) => book.id === id)
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
		message: 'Buku gagal ditambahkan'
	})
	response.code(500)
	return response
}

const getAllBooksHandler = (request, h) => {
	const { name, reading, finished } = request.query
	let result

	if (name) {
		result = books.filter((item) => {
			if (item.name.toLowerCase().includes(name.toLowerCase())) {
				return item
			}
		})
	}
	if (reading) {
		if (Number(reading) === 0) {
			result = books.filter((item) => item.reading === false)
		}
		if (Number(reading) === 1) {
			result = books.filter((item) => item.reading === true)
		}
	}
	if (finished) {
		if (Number(finished) === 0) {
			result = books.filter((item) => item.finished === false)
		}
		if (Number(finished) === 1) {
			result = books.filter((item) => item.finished === true)
		}
	}
	if (!name && !reading && !finished) {
		result = books
	}

	const allBooks = result.map(item => {
		return ({
			id: item.id,
			name: item.name,
			publisher: item.publisher
		})
	})

	const response = h.response({
		status: 'success',
		data: {
			books: allBooks
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

	if (!name) {
		const response = h.response({
			status: 'fail',
			message: 'Gagal memperbarui buku. Mohon isi nama buku'
		})
		response.code(400)
		return response
	}
	if (readPage > pageCount) {
		const response = h.response({
			status: 'fail',
			message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount'
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

export { addBookHandler, getAllBooksHandler, getBookDetailHandler, editBookHandler, removeBookHandler }
