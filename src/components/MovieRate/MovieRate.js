import { Rate } from 'antd'

import './MovieRate.scss'

const MovieRate = ({ userRate, changeRate }) => {
	return (
		<Rate
			className='userRate'
			onChange={value => changeRate(value)}
			defaultValue={userRate}
			allowHalf
			count={10}
		/>
	)
}

export default MovieRate
