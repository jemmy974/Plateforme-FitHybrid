import { useState } from 'react'
import './App.css'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import HomeLayouts from './components/layouts/home/HomeLayouts.jsx'
import Home from './pages/Home.jsx'
import Boutique from './pages/Boutique.jsx'
import Excercice from './pages/Excercice.jsx'
import Dash from './pages/admin/Dash.jsx'
import AdminLayout from './components/layouts/admin/AdminLayouts.jsx'
import AdminUsers from './pages/admin/AdminUsers.jsx'
import AdminProducts from './pages/admin/AdminProducts.jsx'
import Login from './pages/auth/Login.jsx'
import Register from './pages/auth/Register.jsx'
import AdminRoute, { SuperAdminRoute } from './components/AdminRoute.jsx'
import PrivateRoute from './components/PrivateRoute.jsx'
import AddExercice from './pages/admin/AdminExercice.jsx'
import Exercice from './components/Excercice/Exercice.jsx'
import ProgrammeExercice from './pages/admin/ProgrammeExercice.jsx'
import Checkout from './pages/Checkout.jsx'
import Dashboard from './components/admin/Dashboard.jsx'
import Salles from './pages/superAdmin/Salle.jsx'
import SuperUsers from './pages/superAdmin/Users.jsx'
import SuperProducts from './pages/superAdmin/Products.jsx'
import SuperAdminAbonnements from './pages/superAdmin/Abonnements.jsx'
import SuperAdminLayout from './components/layouts/superadmin/SuperLayouts.jsx'
import SuperAdminDashboard from './pages/superAdmin/Dashboard.jsx'
import AdminCommandes from './pages/admin/AdminCommandes.jsx'
import Communautes from './pages/Communaute.jsx'
import Aide from './pages/Aide.jsx'
import Profil from './pages/Profil.jsx'
import MesCommandes from './pages/Mescommandes.jsx'

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<HomeLayouts />}>
          <Route path='/' element={<Home />} />
          <Route path='/communautes' element={<Communautes />} />
          <Route path='/aide' element={<Aide />} />
          <Route path='/boutique' element={
            <PrivateRoute>
              <Boutique />
            </PrivateRoute>
          } />
          <Route path='/bouti' element={<Navigate to='/boutique' replace />} />
          <Route path='/checkout' element={
            <PrivateRoute>
              <Checkout />
            </PrivateRoute>
          } />
          <Route path='/exo' element={
            <PrivateRoute>
              <Excercice />
            </PrivateRoute>
          } />
          <Route path='/profil' element={
            <PrivateRoute>
              <Profil />
            </PrivateRoute>
          } />
          <Route path="/mes-commandes" element={
            <PrivateRoute>
              <MesCommandes />
            </PrivateRoute>
          } />
        </Route>
        <Route path='/login' element={<Login />} />
        <Route path='/inscrire' element={
          <AdminRoute>
            <Register />
          </AdminRoute>
        } />
        {/* <Route path='/programmes' element={<Navigate to='/exo' replace />} />
        <Route path='/communautes' element={<Navigate to='/' replace />} />
        <Route path='/aide' element={<Navigate to='/' replace />} />
        <Route path='/profil' element={<Navigate to='/' replace />} />
        <Route path='/coach/dashboard' element={<Navigate to='/dashboard' replace />} />
        <Route path='/mes-reservations' element={<Navigate to='/boutique' replace />} /> */}
        <Route element={<AdminLayout />}>
          <Route path='/admin/dashboard' element={<Navigate to='/dashboard' replace />} />
          <Route path='/admin/orders' element={<Navigate to='/dashboard' replace />} />
          <Route path='/admin/categories' element={<Navigate to='/admin/exercice' replace />} />
          <Route path='/admin/stats' element={<Navigate to='/inscrire' replace />} />
          <Route path='/admin/settings' element={<Navigate to='/dashboard' replace />} />
          <Route path='/dashboard' element={
            <AdminRoute>
              <Dash />
            </AdminRoute>
          } />
          <Route path='/admin/commande' element={
            <AdminRoute>
              <AdminCommandes />
            </AdminRoute>
          } />
          <Route path='/admin/users' element={
            <AdminRoute>
              <AdminUsers />
            </AdminRoute>
          } />
          <Route path='/admin/products' element={
            <AdminRoute>
              <AdminProducts />
            </AdminRoute>
          } />
          <Route path='/admin/exercice' element={
            <AdminRoute>
              <AddExercice />
            </AdminRoute>
          } />
          <Route path='/admin/ProgrammeExercice' element={
            <AdminRoute>
              <ProgrammeExercice />
            </AdminRoute>
          } />
        </Route>
        <Route element={<SuperAdminLayout />}>
          <Route path='/superadmin' element={
            <SuperAdminRoute>
              <SuperAdminDashboard />
            </SuperAdminRoute>
          } />
          <Route path="/superadmin/stats" element={<Navigate to="/superadmin" replace />} />
          <Route path="/superadmin/search" element={<Navigate to="/superadmin" replace />} />
          <Route path="/superadmin/salles" element={
            <SuperAdminRoute>
              <Salles />
            </SuperAdminRoute>
          } />
          <Route path="/superadmin/users" element={
            <SuperAdminRoute>
              <SuperUsers />
            </SuperAdminRoute>
          } />
          <Route path="/superadmin/products" element={
            <SuperAdminRoute>
              <SuperProducts />
            </SuperAdminRoute>
          } />
          <Route path="/superadmin/abonnements" element={
            <SuperAdminRoute>
              <SuperAdminAbonnements />
            </SuperAdminRoute>
          } />
        </Route>

        <Route path="*" element={<Navigate to="/" />} />





      </Routes>

    </BrowserRouter>
  )
}

export default App
