import { Row, Col, Pagination } from 'antd'

import CardMovie from '../CardMovie/CardMovie'

import cutOverView from '../../service/cutOvweView'

import './MoviesList.scss'
import React from 'react'

export default class MoviesList extends React.Component {
	componentDidMount() {
		cutOverView('.movie-item__overview')
	}

	createList = data => {
		const { sessionID, refreshRated, genresList } = this.props

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

	render() {
		const { data, changePage, currentPage, totalResults } = this.props
		const moviesList = this.createList(data)
		const paginationShow = (
			<Pagination
				current={currentPage}
				total={totalResults}
				onChange={page => changePage(page)}
				pageSize={20}
				showSizeChanger={false}
			/>
		)

		const pagination = totalResults > 20 ? paginationShow : null

		return (
			<>
				<Row gutter={[36, 36]}>{moviesList}</Row>
				<div className='movie-list__pagination'>{pagination}</div>
			</>
		)
	}
}
