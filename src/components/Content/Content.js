import ErrorMessage from '../ErrorMessage/ErrorMessage'
import Loader from '../Loader/Loader'
import MoviesList from '../MoviesList/MoviesList'

import './Content.scss'

const Content = props => {
	const {
		loading,
		loadingError,
		currentSearch,
		totalResults,
		changePage,
		refreshRated,
		search,
		...data
	} = props

	if (loadingError) return <ErrorMessage type='error' />
	if (loading) return <Loader />
	if (!totalResults && !loading && currentSearch && search)
		return <ErrorMessage type='noResult' />
	if (!(loading || loadingError)) {
		return (
			<MoviesList
				changePage={changePage}
				currentSearch={currentSearch}
				totalResults={totalResults}
				refreshRated={refreshRated}
				{...data}
			/>
		)
	}
}

export default Content
