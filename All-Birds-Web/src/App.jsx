import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import ReservedItemModal from "./Functionlity-Component/Reserved-Modal/Reserved.jsx"

import Men from './Pages/Men/Men';
import Women from './Pages/Women/Women';
import Socks from './Pages/Socks/Socks';
import NewArrivals from './Pages/New-Arrivals/NewArrivals';
import AllBirds from './Pages/AllBirds/AllBirds';
import SustainAbility from './Pages/SustainAbility/SustainAbility';
import Reburn from './Pages/Reburn/Reburn';
import Stores from './Pages/Stores/Stores';
import User from './Pages/User/User';
import Help from './Pages/Help/Help';
import Cart from './Pages/Cart/Cart';
import Mix from './Pages/Mix-Products/Mix';
import Terms from './Pages/TermsPage/Terms';
import Privacy from './Pages/PrivacyPage/Privacy';
import Accessibility from './Pages/AccessibilityPage/Accessibility';
import LinkDrops from './LinkDrops';
import ProductPage from './Pages/ProductPage/ProductPage';
import WithRouteLoader from './Components/WithRouteLoader/WithRouteLoader';
import Dashboard from './DashBoard/DashBoard.jsx';
import CheckOut from './Pages/CheckOut/CheckOut.jsx';
import ProfilePage from './Pages/ProfilePage/ProfilePage.jsx';

function App() {

  const [openCart, setOpenCart] = useState(false);

  return (
    <>
      <Cart openCart={openCart} setOpenCart={setOpenCart} />
      <LinkDrops setOpenCart={setOpenCart}>
        <WithRouteLoader>
          <Routes>
            <Route path="/men" element={<Men />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/women" element={<Women />} />
            <Route path="/socks" element={<Socks />} />
            <Route path="/new-arrivals" element={<NewArrivals />} />
            <Route path="/" element={<AllBirds />} />
            <Route path="/sustainability" element={<SustainAbility />} />
            <Route path="/reburn" element={<Reburn />} />
            <Route path="/stores" element={<Stores />} />
            <Route path="/user" element={<User />} />
            <Route path="/help" element={<Help />} />
            <Route path="/mix" element={<Mix />} />
            <Route path="/Terms" element={<Terms />} />
            <Route path="/Privacy" element={<Privacy />} />
            <Route path="/Accessibility" element={<Accessibility />} />
            <Route path='/items/:type/:id' element={<ProductPage />} />
            <Route path='/checkout' element={<CheckOut />} />
            <Route path="/profile/:id" element={<ProfilePage />} />
          </Routes>
        </WithRouteLoader>
      </LinkDrops>
      </>
  );
}

export default App;
