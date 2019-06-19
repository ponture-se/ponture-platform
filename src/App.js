import React, { useEffect, useState } from 'react'
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom'
// import 'bootstrap/dist/css/bootstrap.css'

import StateProvider from './hooks/useGlobalState/stateProvider'
import { LocaleProvider } from './hooks/useLocale/localeContext'
import { useTheme, useLocale, useLayout } from './hooks'
import './styles/app.scss'
import Notifies from './components/Notifies'

import Routes from './routes'
import PrivateRoute from './PrivateRoute'

const App = () => {
  const [layout, setLayout] = useState(
    process.env.REACT_APP_DEFAULT_LAYOUT || 'ltr'
  )
  useTheme('theme1')
  useLayout(layout)
  useEffect(() => {
    setLayout('ltr')
  }, [])
  return (
    <StateProvider>
      <LocaleProvider>
        <BrowserRouter>
          <div>
            <Switch>
              {Routes.map(route => {
                if (route.isPublic) {
                  return (
                    <Route
                      key={route.path}
                      path={route.path}
                      render={props => {
                        const Component = route.component
                        let nestedRoutes
                        if (route.routes) {
                          nestedRoutes = (
                            <>
                              {route.routes.map(nestedRoute => (
                                <Route
                                  exact
                                  key={nestedRoute.path}
                                  path={nestedRoute.path}
                                  render={props => {
                                    const NestedComponent =
                                      nestedRoute.component
                                    const p = {
                                      ...props,
                                      component: nestedRoute
                                    }
                                    return <NestedComponent {...p} />
                                  }}
                                />
                              ))}
                            </>
                          )
                        }
                        return <Component {...props} routes={nestedRoutes} />
                      }}
                    />
                  )
                } else {
                  return (
                    <PrivateRoute
                      key={route.path}
                      path={route.path}
                      render={props => {
                        const Component = route.component
                        let nestedRoutes
                        if (route.routes) {
                          nestedRoutes = (
                            <>
                              {route.routes.map(nestedRoute => (
                                <Route
                                  exact
                                  key={nestedRoute.path}
                                  path={nestedRoute.path}
                                  render={props => {
                                    const NestedComponent =
                                      nestedRoute.component

                                    const p = {
                                      ...props,
                                      component: nestedRoute
                                    }
                                    return <NestedComponent {...p} />
                                  }}
                                />
                              ))}
                            </>
                          )
                        }

                        return <Component {...props} routes={nestedRoutes} />
                      }}
                    />
                  )
                }
              })}
              {/* <Route to="/not-found" render={props=><NoutFound/>}/> */}
              {/* اگه دقیقا / رو زد برو لاگین */}
              <Redirect from='/' to='/panel' exact />
              {/* اگه هیچی نزد یا چرت و پرت زد برو اون روتی که نات فاند هست */}
              {/* <Redirect to="/not-found"/> */}
            </Switch>
          </div>
        </BrowserRouter>
      </LocaleProvider>
      <Notifies />
    </StateProvider>
  )
}

export default App
