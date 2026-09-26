import { useLocation } from 'react-router'
import Navbar from '../components/Navbar'


function Dashboard() {
  const location = useLocation()
  const username = location.state?.username

  return (
    <>
      <Navbar />
      <div className="min-h-[calc(100vh-64px)] flex flex-col items-center justify-center bg-gray-50">

        {username && (
          <p className=''>Welcome <span className='text-green-700 text-lg font-medium'>{username}</span></p>
        )}

        <p className=''>This is the dashboard</p>
      </div>
    </>
  )
}

export default Dashboard
