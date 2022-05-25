import { Alert } from 'antd'

const ErrorMessage = ({ type }) => {
	const messages = {
		noResult: 'Nothing found',
		error: 'Error',
		noRated: 'The rating is empty',
	}
	const descriptions = {
		noResult:
			'Nothing was found for your query. Change the query and try again.',
		error: 'Sorry, something went wrong!',
		noRated: "You haven't rated a single movie yet!",
	}
	const message = messages[type]
	const description = descriptions[type]
	return (
		<Alert
			message={message}
			description={description}
			showIcon
			type='warning'
		/>
	)
}

export default ErrorMessage
