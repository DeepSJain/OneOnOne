import TitleInstructions from '../../components/title_instructions/title_instructions';
import BaseApp from '../../components/base_app/base_app';

import Events from '../../components/events/events';

import { useNavigate } from 'react-router-dom';

function Main() {
    let navigate = useNavigate();
    return (
        <main className="prose p-4">
            <TitleInstructions title="Home" instructions="Click on an event to view more details" />
            <div className="divider"></div>
            <Events />
            <div className="divider"></div>
            <div className="text-center mt-4">
                {/* <button className="btn btn-primary" onClick={() => window.location.href = "/create_event/"}>Create Event</button> */}
                <button className="btn btn-primary" onClick={() => navigate("/create_event/")}>Create Event</button>
            </div>
        </main>
    );
}

function App() {
    return (
        <BaseApp main={<Main />} home_url="/events/" is_nav={true} />
    );
}

export default App;
