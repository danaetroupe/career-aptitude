import { Provider } from "./components/ui/provider";
import Home from './components/Home';

function App({ Component, pageProps }) {
  return (
    <Provider>
      <Component {...pageProps} />
      <Home/>
    </Provider>
  )
}

export default App;