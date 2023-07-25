import TokenProps from "../types/TokenProps";
import MenuOpenProps from "../types/MenuOpenProps";
import CurrentReservation from "../components/CurrentReservation";
import UpcomingReservations from "../components/UpcomingReservations";


type HomeProps = MenuOpenProps & TokenProps

const Home = ({token, menuOpen, setMenuOpen, encodedToken}: HomeProps) => {

  const closeMenu = () => {
    if (menuOpen) {
      setMenuOpen(false)
    }
  }
  return (
    <>
      <div className="flex flex-col items-center justify-center" onClick={closeMenu}>
        <h1 className="text-2xl mt-4 font-bold">Welcome {token.firstName}</h1>
        <h2 className="text-xl mt-4 font-semibold">Current Reservation</h2>
        <CurrentReservation userId={token.id} encodedToken={encodedToken} menuOpen={menuOpen}/>
        <div className="divider"/>
        <h2 className="text-xl mt-4 font-semibold">Upcoming Reservations</h2>
        <UpcomingReservations userId={token.id} encodedToken={encodedToken}/>
      </div>
    </>
  )

}
export default Home;