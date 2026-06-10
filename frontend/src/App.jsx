import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './auth/AuthContext.jsx'
import Layout from './components/Layout.jsx'
import Home from './pages/Home.jsx'
import About from './pages/About.jsx'
import Activities from './pages/Activities.jsx'
import Awards from './pages/Awards.jsx'
import Recruit from './pages/Recruit.jsx'
import BoardList from './pages/BoardList.jsx'
import PostDetail from './pages/PostDetail.jsx'
import PostWrite from './pages/PostWrite.jsx'
import PostEdit from './pages/PostEdit.jsx'
import Login from './pages/Login.jsx'
import Signup from './pages/Signup.jsx'
import MyPage from './pages/MyPage.jsx'

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/activities" element={<Activities />} />
          <Route path="/awards" element={<Awards />} />
          <Route path="/recruit" element={<Recruit />} />
          <Route path="/board/:board" element={<BoardList />} />
          <Route path="/board/:board/write" element={<PostWrite />} />
          <Route path="/board/:board/:id" element={<PostDetail />} />
          <Route path="/board/:board/:id/edit" element={<PostEdit />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/mypage" element={<MyPage />} />
        </Route>
      </Routes>
    </AuthProvider>
  )
}
