import { Link } from 'react-router'

const ErrorPage = () => {
  return (
    <div>
      <h1>Oh my bad, this page doesn't exist!</h1>
      <Link to='/'>
        You can get back to the home page by clicking here, though!
      </Link>
    </div>
  )
}

export default ErrorPage;
