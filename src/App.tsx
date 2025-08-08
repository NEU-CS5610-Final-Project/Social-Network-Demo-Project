import { HashRouter } from 'react-router'
import MovieNetwork from './MovieNetwork'
import { Provider } from 'react-redux'
import store from './MovieNetwork/store'

function App() {
  return (
    <HashRouter>
      <Provider store={store}>
        <MovieNetwork />
      </Provider>
    </HashRouter>
  )
}

export default App
