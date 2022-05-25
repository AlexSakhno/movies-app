import { format } from 'date-fns'
import noFoundPoster from './no_image_poster.png'

export default class MovieService {
	_apiKey = '51f8b50bead654976e1dbb11722a52cb'

	_urlBase = 'https://api.themoviedb.org/3'

	_imageBase = 'https://image.tmdb.org/t/p/w500'

	requestDefault = async request => {
		const query = `${this._urlBase}${request}`
		const res = await fetch(query)
		const data = await res.json()
		return data
	}

	getGuestSession = async () => {
		const request = `${this._urlBase}/authentication/guest_session/new?api_key=${this._apiKey}`
		const res = await fetch(request)
		const body = await res.json()
		return body.guest_session_id
	}

	getGenresList = async () => {
		const request = `/genre/movie/list?&api_key=${this._apiKey}`
		const res = await this.requestDefault(request)

		return {
			genresList: res.genres,
		}
	}

	dataMovie = data => {
		let date = ''

		try {
			date = format(new Date(data.release_date), 'MMM d, y')
		} catch (err) {
			date = 'No release date'
		}

		const poster = data.poster_path
			? `${this._imageBase}${data.poster_path}`
			: noFoundPoster

		return {
			id: data.id,
			title: data.title,
			overview: data.overview,
			date,
			poster,
			genresIds: data.genre_ids,
			globalRate: data.vote_average,
			userRate: data.rating || 0,
		}
	}

	rateMovie = async (id, value, sessionID) => {
		const query = `${this._urlBase}/movie/${id}/rating?api_key=${this._apiKey}&guest_session_id=${sessionID}`
		const paramsRequest = {
			method: 'POST',
			headers: {
				'Content-type': 'application/json',
			},
			body: JSON.stringify({ value }),
		}
		const res = await fetch(query, paramsRequest)
		const data = await res.json()
		return data
	}

	getMovies = async (key, page, rated, sessionId) => {
		const request = rated
			? `/guest_session/${sessionId}/rated/movies?api_key=${this._apiKey}&page=${page}`
			: `/search/movie?api_key=${this._apiKey}&query=${key}&page=${page}`
		const res = await this.requestDefault(request)

		const data = res.results.map(el => this.dataMovie(el))

		return {
			data,
			currentPage: res.page,
			totalResults: res.total_results,
			totalPage: res.total_pages,
		}
	}

	cutOverView(selector) {
		const overviewBlocks = document.querySelectorAll(selector)
		overviewBlocks.forEach(el => {
			if (el.clientHeight) {
				while (el.scrollHeight > el.clientHeight) {
					const lastSpace = el.textContent.lastIndexOf(' ')
					el.textContent = `${el.textContent.slice(0, lastSpace)}...`
				}
			}
		})
	}
}
