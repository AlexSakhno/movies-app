import { Tabs } from 'antd'
import { useEffect, useState } from 'react'

import SearchPanel from '../SearchPanel/SearchPanel'
import Content from '../Content/Content'

import MovieService from '../../service/movie-service'

import './App.scss'

const { TabPane } = Tabs

const moviesService = new MovieService()

export default function App() {
	const [dataMovies, setData] = useState(() => {
		return {
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
	})

	// useEffect(() => {
	// 	async function questSession() {
	// 		const res = await moviesService.getGuestSession()
	// 		setData(() => ({ ...dataMovies, sessionID: res }))
	// 	}
	// 	questSession()
	// }, [])

	const getMoviesBase = async (key, page, rated, sessionId) => {
		if (key === '' && !rated) {
			setData({
				...dataMovies,
				data: [],
				currentSearch: '',
				totalResultsSearch: 0,
				loading: false,
			})
		}

		try {
			const { getMovies, getGenresList, getGuestSession } = moviesService

			setData({ ...dataMovies, loading: true, errorLoading: false })

			const res = await getMovies(key, page, rated, sessionId)
			const resGenres = await getGenresList()
			const resGuest = await getGuestSession()

			const { data, currentPage, totalResults, totalPage } = res

			setData(prevState => ({
				data: rated ? prevState.data : data,
				ratedData: rated ? data : prevState.ratedData,
				loading: false,
				currentSearch: rated ? prevState.currentSearch : key,
				currentPageSearch: rated ? prevState.currentPageSearch : currentPage,
				currentPageRated: rated ? currentPage : prevState.currentPageRated,
				totalResultsSearch: rated ? prevState.totalResultsSearch : totalResults,
				totalPage: rated ? prevState.totalPage : totalPage,
				genresList: resGenres.genresList,
				sessionID: resGuest,
			}))
		} catch (err) {
			setData({ ...dataMovies, loading: false, errorLoading: true })
		}
	}

	const refreshRated = async () => {
		const { getMovies } = moviesService
		const { sessionID, currentPageRated } = dataMovies
		const ratedData = await getMovies(null, currentPageRated, true, sessionID)

		setData({
			...dataMovies,
			ratedData: ratedData.data,
			totalResultsRated: ratedData.totalResults,
		})
	}

	const changePageSearch = page => {
		const { currentSearch } = dataMovies
		getMoviesBase(currentSearch, page)
	}

	const changePageRated = page => {
		const { sessionID } = dataMovies
		getMoviesBase(null, page, true, sessionID)
	}

	const {
		data,
		ratedData,
		currentPageSearch,
		currentPageRated,
		totalResultsSearch,
		totalResultsRated,
		...params
	} = dataMovies

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
				onChange={() =>
					setTimeout(
						() => moviesService.cutOverView('.movie-item__overview'),
						100
					)
				}
				centered
			>
				<TabPane tab='Search' key='search'>
					<SearchPanel searchData={getMoviesBase} />
					<Content
						search
						refreshRated={refreshRated}
						data={checkRatedData}
						totalResults={totalResultsSearch}
						currentPage={currentPageSearch}
						changePage={changePageSearch}
						{...params}
					/>
				</TabPane>
				<TabPane tab='Rated' key='rated'>
					<Content
						refreshRated={refreshRated}
						data={ratedData}
						totalResults={totalResultsRated}
						currentPage={currentPageRated}
						changePage={changePageRated}
						{...params}
					/>
				</TabPane>
			</Tabs>
		</div>
	)
}
