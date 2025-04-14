
import './App.css';
import CalendarComponent from './CalendarComponent';
import { ToastContainer, Bounce } from 'react-toastify';


function App() {

    return (
        <div>

            <CalendarComponent></CalendarComponent>

            <ToastContainer
                position="top-center"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick={false}
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
                transition={Bounce}
            />
        </div>

    );


}

export default App;