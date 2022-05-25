import MovieService from '../../service/movie-service'
import classNames from 'classnames'

import MovieRate from '../MovieRate/MovieRate'

import './CardMovie.scss'

const moviesService = new MovieService()

const CardMovie = props => {
	const {
		overview,
		userRate,
		id,
		poster,
		globalRate,
		title,
		date,
		genresIds,
		genresList,
		sessionID,
	} = props

	const changeRate = value => {
		const { rateMovie } = moviesService
		const { id, refreshRated } = props
		rateMovie(id, value, sessionID).then(() => {
			setTimeout(() => refreshRated(), 1000)
		})
	}

	const newGenresList = new Map([])

	genresList.forEach(item => {
		newGenresList.set(item.id, item.name)
	})

	const genresBlocks = genresIds.map(el => {
		return (
			<span key={el} className='movie-item__genres-item'>
				{newGenresList.get(el)}
			</span>
		)
	})

	const rateStatus = classNames({
		'movie-item__vote-container--low': globalRate < 3,
		'movie-item__vote-container--pre-intermediate':
			globalRate >= 3 && globalRate < 5,
		'movie-item__vote-container--intermediate':
			globalRate >= 5 && globalRate < 7,
	})

	return (
		<div className='movie-item'>
			<header className='movie-item__header'>
				<img className='movie-item__poster' src={poster} alt='Movie poster' />
				<div className='movie-item__header-content'>
					<div className={`movie-item__vote-container ${rateStatus}`}>
						<span className='movie-item__vote'>{globalRate}</span>
					</div>
					<h3 className='movie-item__title'>{title}</h3>
					<div className='movie-item__date'>{date}</div>
					<div className='movie-item__genres-container'>{genresBlocks}</div>
				</div>
			</header>

			<p id={id} className='movie-item__overview'>
				{overview}
			</p>
			<footer className='movie-item__footer'>
				<MovieRate
					userRate={userRate}
					changeRate={value => changeRate(value)}
				/>
			</footer>
		</div>
	)
}

export default CardMovie
