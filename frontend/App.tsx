import './App.css'
import Home from './Pages/Home/Home';
import {Routes, Route} from 'react-router-dom';
import Apply from './Pages/Apply/Apply';
import Programs from './Pages/Programs/Programs';
import AuthPages from './Pages/AuthPages/AuthPages';
import Dashboard from './Pages/Dashboard/Dashboard';
import AboutUs from './Pages/AboutUs/AboutUs';
import ContactUs from './Pages/ContactUs/ContactUs';
import Testimonials from './Pages/Testimonials/Testimonials';
function App() {
  

  return (
    <Routes>
      <Route path="/" element={<Home/>}></Route>
      <Route path="/apply" element={<Apply/>}></Route>
      <Route path="/programs" element={<Programs/>}></Route>
      <Route path='/auth' element={<AuthPages/>}></Route>
      <Route path='/about' element={<AboutUs/>}></Route>
      <Route path='/contact' element={<ContactUs/>}></Route>
      <Route path='/testimonials' element={<Testimonials/>}></Route>

      <Route path='/dashboard' element={<Dashboard/>}></Route>
      
    </Routes>
  )
}

export default App
