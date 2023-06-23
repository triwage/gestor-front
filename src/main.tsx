import { StrictMode, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router, useRoutes } from 'react-router-dom'

import './index.css'

import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import 'ag-grid-community/styles/ag-grid.css'
import 'ag-grid-community/styles/ag-theme-alpine.css'

import { X } from '@phosphor-icons/react'
import { QueryClientProvider } from '@tanstack/react-query'

import routes from '~react-pages'

import { Loader } from './components/System/Loader'
import { LoadingProvider } from './contexts/LoadingContext'
import { queryClient } from './libs/queryClient'

const contextClass = {
  success: 'bg-green text-white font-medium',
  error: 'bg-red text-white font-medium',
  info: 'bg-blue text-white font-medium',
  warning: 'bg-yellow text-black font-medium',
  default: 'bg-red text-white font-medium',
}
// eslint-disable-next-line react-refresh/only-export-components
const CloseButton = ({ closeToast }: any) => (
  <div className="flex items-start justify-start">
    <X onClick={closeToast} size={16} weight="bold" className="text-white" />
  </div>
)
// eslint-disable-next-line react-refresh/only-export-components
function App() {
  return <Suspense fallback={<Loader />}>{useRoutes(routes)}</Suspense>
}

const app = createRoot(document.getElementById('root')!)

app.render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <LoadingProvider>
        <Router>
          <ToastContainer
            closeButton={CloseButton}
            hideProgressBar
            toastClassName={({ type }: any) =>
              // @ts-expect-error
              contextClass[type || 'default'] +
              'relative flex mt-1 mx-1 p-1.5 min-h-10 rounded-lg justify-between overflow-hidden cursor-pointer'
            }
            autoClose={2500}
          />
          <App />
        </Router>
      </LoadingProvider>
    </QueryClientProvider>
  </StrictMode>,
)
