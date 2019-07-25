// import withResolver from '../hoc/withResolver'
import BusinessLoan from './Pages/BusinessLoan'

// const Home = withResolver(HomeComponent)

const routes = [
  // {
  //   path: '/verifyBankId/:personalNumber',
  //   component: BankIdVerify,
  //   isPublic: true
  // },
  {
    path: '/app/loan',
    component: BusinessLoan,
    isPublic: true
  }
]
export default routes
