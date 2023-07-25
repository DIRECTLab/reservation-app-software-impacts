import { useNavigate } from "react-router-dom"

const ErrorPage = () => {
  let navigate = useNavigate()
  const routeChange = (path: string) => {
    return navigate(path)
  }

  return (
    <div className="flex flex-col items-center justify-center text-center">
      <h1 className="text-3xl font-bold mt-16">404 Page not found</h1>
      <h2 className="text-xl font-semibold self-center">The page you were looking for does not exist</h2>
      <button
        className="btn btn-primary w-4/5 md:w-1/5 mt-8"
        onClick={() => routeChange("/")}
      >
          Back to Home
      </button>
    </div>
  )
}
export default ErrorPage