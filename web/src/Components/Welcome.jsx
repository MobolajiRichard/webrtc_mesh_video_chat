import React, { useState } from 'react';
import styled from 'styled-components';

export const Container = styled.div`
	height: 100vh;
	width: 100%;
	display: flex;
	flex-direction: column;
	align-items: center;
	background-color: #13141c;
	color: white;
	box-sizing: border-box;
    position:relative;
`;

export const Header = styled.div`
	display: flex;
	width: 100%;
	justify-content: space-around;
	height: 12%;
	align-items: center;
	background-color: #1e202b;
`;
export const Circle = styled.div`
	width: 3em;
	height: 3em;
	border-radius: 50%;
	background-color: #4b4e61;
	display: flex;
	align-items: center;
	justify-content: center;
    cursor:pointer;
`;

export const LogoText = styled.p`
	font-size: 2rem;
	color: whitesmoke;
`;

export const Title = styled.p`
	font-family: monospace;
	font-size: 2rem;
`;

const Main = styled.div`
	box-sizing: border-box;
	display: flex;
	width: 60%;
	justify-content: space-around;
	height: 70%;
	align-items: center;
	background-color: #1e202b;
	border-radius: 25px;
	display: flex;
	flex-direction: column;
	padding: 1% 5%;
	color: whitesmoke;
	margin-top: 4em;
`;

const FormField = styled.div`
	display: flex;
	flex-direction: column;
	margin-bottom: 1em;
	width: 100%;
`;

const Input = styled.input`
	outline: none;
	border: none;
	background-color: #343640;
	color: whitesmoke;
	text-indent: 10px;
	height: 4em;
	border-radius: 10px;
`;

const Button = styled.button`
	background-color: #4b4e61;
	outline: none;
	border: none;
	cursor: pointer;
	border-radius: 10px;
	color: whitesmoke;
	height: 4em;
	width: 8em;
`;

const Error = styled.p`
	color: tomato;
`;

const Help = styled.div`
background-color: #454552;
border-radius:10px;
padding: 0 2%;
position:absolute;
z-index:99;
top:10%;
right:4%;
width:20%;
`

const Welcome = ({ setUser }) => {
	const [email, setEmail] = useState('');
	const [room, setRoom] = useState('');
	const [error, setError] = useState(false);
	const [displayHelp, setDisplayHelp] = useState(false);

	const onSubmit = (e) => {
		e.preventDefault();
		setError(false);
		if (!email || !room) {
			setError(true);
		} else {
			let userObject = {
				room,
				email,
			};
			setUser(userObject);
			const nextUrl = `/${userObject.room}`;
			const nextTitle = `Interact Room ${userObject.room}`;
			const nextState = { additionalInfomation: 'move to the chat room' };
			window.history.pushState(nextState, nextTitle, nextUrl);
		}
	};
	return (
		<Container>
			<Header>
				<Circle>
					<LogoText>I</LogoText>
				</Circle>
				<Title>Interact</Title>
				<Circle onClick={() => setDisplayHelp(prev => !prev)}>
					{!displayHelp &&<LogoText>?</LogoText>}
					{displayHelp &&<LogoText>x</LogoText>}
				</Circle>
			</Header>
           {displayHelp && <Help>
                <ul>
                    <li>Enter the fields to create a room</li>
                    <li>If the room does not exist it'll create a new one</li>
                    <li>If the room exist it'll direct you to the room</li>
                    <li>To join a room, simply enter your email and the room name</li>
                    <li>Please note, the maximum number of users in a room is 4</li>
                </ul>
            </Help>}
			<Main>
				<p>Create or join a room</p>
				<FormField>
					<p>Enter your Email:</p>
					<Input value={email} onChange={(e) => setEmail(e.target.value)} />
				</FormField>
				<FormField>
					<p>Enter Room ID:</p>
					<Input value={room} onChange={(e) => setRoom(e.target.value)} />
				</FormField>
				<Button onClick={onSubmit}>Join</Button>
				{error && (
					<Error>
						An error occured, please ensure all fields are filled and try again.
					</Error>
				)}
			</Main>
		</Container>
	);
};

export default Welcome;
