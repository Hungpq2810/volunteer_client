import { Navigate, Outlet, useRoutes } from 'react-router-dom'
import AuthLayout from './layouts/AuthLayout/AuthLayout'
import Login from './pages/Login/Login'
import Register from './pages/Register/Register'
import { useContext } from 'react'
import { AppContext } from './contexts/app.context'
import MainLayout from './layouts/MainLayout/MainLayout'
import Profile from './pages/Profile/Profile'
import ManageUser from './pages/ManageUser/ManageUser'
import Home from './pages/Home/Home'
import HomeLayout from './layouts/HomeLayout/HomeLayout'
import ManageEvent from './pages/ManageEvent/ManageEvent'
import CreateEvent from './pages/CreateEvent/CreateEvent'
import ManageRequest from './pages/ManageRequest/ManageRequest'
import EventDetail from './pages/EventDetail/EventDetail'
import ManageFaq from './pages/ManageFaq/ManageFaq'
import General from './pages/General/General'
import Term from './pages/Term/Term'
import ListEvent from './pages/ListEvent/ListEvent'
import Faq from './pages/Faq/Faq'

function ProtectedRoute() {
  const { isAuthenticated } = useContext(AppContext)
  return isAuthenticated ? <Outlet /> : <Navigate to={'/login'} />
}

function RejectedRoute() {
  const { isAuthenticated } = useContext(AppContext)
  return !isAuthenticated ? <Outlet /> : <Navigate to={'/'} />
}

export default function useRouteElements() {
  const routeElements = useRoutes([
    {
      path: '',
      element: <RejectedRoute />,
      children: [
        {
          path: '/login',
          element: (
            <AuthLayout>
              <Login />
            </AuthLayout>
          )
        },
        {
          path: '/register',
          element: (
            <AuthLayout>
              <Register />
            </AuthLayout>
          )
        }
      ]
    },
    {
      path: '',
      element: <ProtectedRoute />,
      children: [
        {
          path: '/profile',
          element: (
            <MainLayout>
              <Profile />
            </MainLayout>
          )
        },
        {
          path: '/manage-user',
          element: (
            <MainLayout>
              <ManageUser />
            </MainLayout>
          )
        },
        {
          path: '/manage-faq',
          element: (
            <MainLayout>
              <ManageFaq />
            </MainLayout>
          )
        },
        {
          path: '/general',
          element: (
            <MainLayout>
              <General />
            </MainLayout>
          )
        },
        {
          path: '/my-event',
          element: (
            <MainLayout>
              <ManageEvent />
            </MainLayout>
          )
        },
        {
          path: '/manage-request',
          element: (
            <MainLayout>
              <ManageRequest />
            </MainLayout>
          )
        },
        {
          path: '/create-event',
          element: (
            <MainLayout>
              <CreateEvent />
            </MainLayout>
          )
        },
        {
          path: '/update-event/:slug',
          element: (
            <MainLayout>
              <CreateEvent />
            </MainLayout>
          )
        }
      ]
    },
    {
      path: '',
      index: true,
      element: (
        <HomeLayout>
          <Home />
        </HomeLayout>
      )
    },
    {
      path: '/term',
      index: true,
      element: (
        <HomeLayout>
          <Term />
        </HomeLayout>
      )
    },
    {
      path: '/events',
      index: true,
      element: (
        <HomeLayout>
          <ListEvent />
        </HomeLayout>
      )
    },
    {
      path: '/faq',
      index: true,
      element: (
        <HomeLayout>
          <Faq />
        </HomeLayout>
      )
    },
    {
      path: '/:slug',
      index: true,
      element: (
        <HomeLayout>
          <EventDetail />
        </HomeLayout>
      )
    }
  ])

  return routeElements
}
