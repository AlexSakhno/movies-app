import React from 'react'
import * as ReactDOMClient from 'react-dom/client'
import 'antd/dist/antd.min.css'

import './index.css'

import App from './components/App/App'

const root = ReactDOMClient.createRoot(document.getElementById('root'))

root.render(<App />)
