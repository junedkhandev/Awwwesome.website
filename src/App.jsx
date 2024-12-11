
import Home from './Home.jsx'
import {Routes,Route, BrowserRouter } from 'react-router-dom'
import LoginPage from './LoginPage.jsx'


function App(){

  return (
    <div>
      <BrowserRouter>
        <Routes>  
          <Route  path='/'  element={<Home/>}></Route>
          <Route path='/itsawesomewebsite' element={<LoginPage/>}></Route>
        </Routes>
      </BrowserRouter>
    </div>
  )

}

export default App


