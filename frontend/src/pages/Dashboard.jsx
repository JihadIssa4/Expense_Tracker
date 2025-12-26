import Navbar from "../components/layout/Navbar"

function Dashboard() {
    const user = {
        firstName: "Jihad",
        lastName: "Issa",
    }
    const handleLogout = () => {
        console.log("Logout clicked");
    }
    return (
        <div>
            <Navbar title="Dashboard" user={user} onLogout={handleLogout}></Navbar>
            <p className="p-6">Dashboard content goes here</p>
        </div>
    )
}
export default Dashboard;