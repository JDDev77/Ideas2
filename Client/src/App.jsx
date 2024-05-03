import { Routing } from "./router/Routing"
import { AuthProvider } from './context/AuthProvider'

function App() {
  return (
    <AuthProvider>
    <div className="layout">
      <Routing />
    </div>
    </AuthProvider>
  )
}

export default App
