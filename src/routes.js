// import withResolver from '../hoc/withResolver'
import BusinessLoan from './Pages/BusinessLoan'
import BankIdVerify from './Pages/B_LoanBankId'

// const Home = withResolver(HomeComponent)

const routes = [
  // {
  //   path: '/verifyBankId/:personalNumber',
  //   component: BankIdVerify,
  //   isPublic: true
  // },
  {
    path: '',
    component: BusinessLoan,
    isPublic: true
  }
]
export default routes
