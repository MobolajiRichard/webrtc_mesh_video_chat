import React, { useState} from 'react';
import Main from './Components/Main';
import Welcome from './Components/Welcome';

const App = () => {
	const [userDetails, setUserDetails] = useState({
		room: '',
		email: '',
	});

	const setUser = (user) => {
		setUserDetails(user);
	};
	console.log({ userDetails });

	if (window.location.pathname === '/') {
		return <Welcome setUser={setUser} />;
	}
	return (
		<div style={{ overflow: 'hidden' }}>
			<Main user={userDetails} />
		</div>
	);
};

export default App;
