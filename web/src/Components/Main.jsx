import React, { useState } from 'react';
import Room from './Room';
import Participant from './Participant';
import Chat from './Chat';
import {  Call } from '@material-ui/icons';
import { Container, Header, Title, LogoText, Circle } from './Welcome';
import styled from 'styled-components';

const End = styled.div`
	width: 8em;
	height: 3em;
	background-color: tomato;
	color: whitesmoke;
	padding: 1%;
	display: flex;
	align-items: center;
	box-sizing: border-box;
	border-radius: 10px;
	justify-content: space-around;
	cursor: pointer;
`;

const Body = styled.div`
	display: flex;
	justify-content: space-between;
	height: 100%;
	box-sizing: border-box;
	width: 100%;
	overflow: hidden;
`;

const Main = ({ user }) => {
	const [members, setMember] = useState([user]);
	const [message, setMessage] = useState('');
	const [chats, setChats] = useState([]);
	const [send, setSend] = useState(0);

	const sendMessage = () => {
		setSend((prev) => prev + 1);
	};

	const leaveCall = () => {
		window.location.href = '/';
	};
	const addMembers = (member) => {
        if(member.length > 0){
            setMember((prev) => [...prev, ...member]);
        }
	};

	const onChange = (e) => {
		setMessage(e.target.value);
	};

	const setChat = (chat) => {
		setChats((prev) => [...prev, chat]);
	};
	return (
		<Container>
			<Header>
				<Circle>
					<LogoText>I</LogoText>
				</Circle>
				<Title>Interact</Title>
				<End onClick={leaveCall}>
					<Call />
					<p>End Call</p>
				</End>
			</Header>
			<Body>
				<Participant member={members} />
				<Room
					user={user}
					addMember={addMembers}
					message={message}
					setChat={setChat}
					send={send}
                    setMessage={setMessage}
				/>
				<Chat
					message={message}
					onChange={onChange}
					chats={chats}
					user={user}
					sendMessage={sendMessage}
                    setMessage={setMessage}
				/>
			</Body>
		</Container>
	);
};

export default Main;
