import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Sidebar } from '../components/Sidebar'
import { Overview } from '../pages/Overview'
import { NewDocument } from '../pages/NewDocument'
import { ComingSoon } from '../pages/ComingSoon'

export function App() {
  return (
    <BrowserRouter>
      <div className="flex h-screen overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-auto bg-[#0f1117]">
          <Routes>
            <Route path="/" element={<Overview />} />
            <Route path="/new" element={<NewDocument />} />
            <Route path="/documents" element={<ComingSoon />} />
            <Route path="/templates" element={<ComingSoon />} />
            <Route path="/components" element={<ComingSoon />} />
            <Route path="/data-sources" element={<ComingSoon />} />
            <Route path="/preferences" element={<ComingSoon />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}
