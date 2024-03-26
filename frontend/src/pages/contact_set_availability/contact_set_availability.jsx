import { useParams } from 'react-router-dom';

import TitleInstructions from '../../components/title_instructions/title_instructions';
import BaseApp from '../../components/base_app/base_app';

import ContactSetAvailability from '../../components/contact_set_availability/contact_set_availability';

function Main() {
    let { event_id } = useParams();
    return (
        <main className="prose p-4">
            <TitleInstructions title="Set Your Availability" instructions="Select a time slot and click one of the buttons below to set your availability." />
            <div className="divider"></div>
            <ContactSetAvailability event_id={event_id} />
            {/* <div className="divider"></div> */}
            {/* {get_param("next") !== null ? <NavigationButtons back={{label: "Back", onClick: back}} next={{label: "Next", onClick: () => window.location.href = get_param("next")}} /> : <NavigationButtons back={{label: "Back", onClick: back}} />} */}
        </main>
    );
}

function App() {
    return (
        <BaseApp main={<Main />} home_url="/" is_nav={false} is_theme={false} />
    );
}

export default App;