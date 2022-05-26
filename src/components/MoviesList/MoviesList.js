import { Row, Col, Pagination } from 'antd'

import CardMovie from '../CardMovie/CardMovie'

import MovieService from '../../service/movie-service'

import './MoviesList.scss'
import { useEffect } from 'react'

const moviesService = new MovieService()

const MoviesList = props => {
	useEffect(() => moviesService.cutOverView('.movie-item__overview'), [])

	const createList = data => {
		const { sessionID, refreshRated, genresList } = props

		return data.map(el => {
			const { id } = el

			return (
				<Col key={id} xs={{ span: 24 }} lg={{ span: 12 }}>
					<CardMovie
						genresList={genresList}
						sessionID={sessionID}
						refreshRated={refreshRated}
						{...el}
					/>
				</Col>
			)
		})
	}

	const { data, changePage, currentPage, totalResults } = props
	const moviesList = createList(data)
	const paginationShow = (
		<Pagination
			current={currentPage}
			total={totalResults}
			onChange={page => changePage(page)}
			pageSize={20}
			showSizeChanger={false}
		/>
	)
	console.log(totalResults)
	const pagination = totalResults > 20 ? paginationShow : null

	return (
		<>
			<Row gutter={[36, 36]}>{moviesList}</Row>
			<div className='movie-list__pagination'>{pagination}</div>
		</>
	)
}

export default MoviesList
