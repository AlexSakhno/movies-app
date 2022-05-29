import { Tabs } from 'antd'
import React from 'react'

import SearchPanel from '../SearchPanel/SearchPanel'
import Content from '../Content/Content'

import MovieService from '../../service/movie-service'
import cutOverView from '../../service/cutOvweView'

import './App.scss'

export default class App extends React.Component {
	moviesService = new MovieService()

	state = {
		data: [],
		ratedData: [],
		currentSearch: '',
		currentPageSearch: 1,
		currentPageRated: 1,
		totalResultsSearch: 0,
		totalResultsRated: 0,
		loading: false,
		loadingError: false,
		totalPage: 0,
		sessionID: null,
		genresList: [],
	}

	componentDidMount() {
		const { getGuestSession, getGenresList } = this.moviesService
		getGuestSession().then(sessionID => this.setState({ sessionID }))
		getGenresList().then(list => this.setState({ genresList: list.genresList }))
	}

	getMoviesBase = async (key, page, rated, sessionId) => {
		if (key === '' && !rated) {
			this.setState({
				data: [],
				currentSearch: '',
				totalResultsSearch: 0,
				loading: false,
			})
			return
		}

		try {
			const { getMovies } = this.moviesService

			this.setState({ loading: true, loadingError: false })

			const res = await getMovies(key, page, rated, sessionId)

			const { data, currentPage, totalResults } = res

			setTimeout(() => {
				this.setState(prevState => ({
					data: rated ? prevState.data : data,
					ratedData: rated ? data : prevState.ratedData,
					loading: false,
					currentSearch: rated ? prevState.currentSearch : key,
					currentPageSearch: rated ? prevState.currentPageSearch : currentPage,
					currentPageRated: rated ? currentPage : prevState.currentPageRated,
					totalResultsSearch: rated
						? prevState.totalResultsSearch
						: totalResults,
				}))
			}, 100)
		} catch (err) {
			this.setState({ loadingError: true, loading: false })
		}
	}

	refreshRated = async () => {
		const { getMovies } = this.moviesService
		const { sessionID, currentPageRated } = this.state
		const ratedData = await getMovies(null, currentPageRated, true, sessionID)

		this.setState({
			ratedData: ratedData.data,
			totalResultsRated: ratedData.totalResults,
		})
	}

	changePageSearch = page => {
		const { currentSearch } = this.state
		this.getMoviesBase(currentSearch, page)
	}

	changePageRated = page => {
		const { sessionID } = this.state
		this.getMoviesBase(null, page, true, sessionID)
	}

	render() {
		const { TabPane } = Tabs
		const {
			data,
			ratedData,
			currentPageSearch,
			currentPageRated,
			totalResultsSearch,
			totalResultsRated,
			...params
		} = this.state

		const checkRatedData = [...data]
		checkRatedData.forEach(searchEl => {
			ratedData.forEach(el => {
				if (searchEl.id === el.id) {
					searchEl.userRate = el.userRate
				}
			})
		})

		return (
			<div className='container'>
				<Tabs
					defaultActiveKey='search'
					onChange={() => cutOverView('.movie-item__overview')}
					centered
				>
					<TabPane tab='Search' key='search'>
						<SearchPanel searchData={this.getMoviesBase} />
						<Content
							search
							refreshRated={this.refreshRated}
							data={checkRatedData}
							totalResults={totalResultsSearch}
							currentPage={currentPageSearch}
							changePage={this.changePageSearch}
							{...params}
						/>
					</TabPane>
					<TabPane tab='Rated' key='rated'>
						<Content
							refreshRated={this.refreshRated}
							data={ratedData}
							totalResults={totalResultsRated}
							currentPage={currentPageRated}
							changePage={this.changePageRated}
							{...params}
						/>
					</TabPane>
				</Tabs>
			</div>
		)
	}
}
