import React from 'react';
import { Send } from '@material-ui/icons';
import styled from 'styled-components';

const Container = styled.div`
	height: 100%;
	color: whitesmoke;
	background-color: #343640;
	flex: 0.25;
	box-sizing: border-box;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: space-between;
	overflow:hidden;
`;
const Input = styled.input`
	outline: none;
	border: none;
	border-radius: 10px;
	background-color: #606070;
	color: whitesmoke;
	text-indent: 10px;
	height: 4em;
	flex: 1;
`;

const TextBox = styled.div`
	display: flex;
	padding: 2%;
	background-color: #454552;
	box-sizing: border-box;
	width: 100%;
	justify-self: center;
`;

const Text = styled.div`
	display: flex;
	align-items: center;
	background-color: #606070;
	border-radius: 10px;
	width: 100%;
	padding: 0 2%;
`;

const ChatContainer = styled.div`
	display: flex;
	align-items: center;
	box-sizing: border-box;
	flex-direction: column;
	width: 100%;
	padding: 0 2%;
	overflow:hidden;
`;

const Chats = styled.div`
	display: flex;
	box-sizing: border-box;
	flex-direction: column;
	width: 100%;
	overflow-y:auto;
`;

const MessageInfo = styled.div`
	background-color: ${(props) => (props.isUser ? '#4b634b' : '#606070')};
	width: fit-content;
	display: flex;
	flex-direction: column;
	margin-left: ${(props) => (props.isUser ? 0 : 'auto')};
	margin-right: ${(props) => (props.isUser ? 'auto' : 0)};
	border-radius: 5px;
	box-sizing: border-box;
	padding: 1% 5%;
	margin-bottom: 10px;
`;

const Message = styled.p`
	margin: 0;
	font-size: small;
	color: whitesmoke;
`;

const MessageSender = styled.p`
	margin: 0;
	font-size: smaller;
	color: lightgrey;
`;

const Chat = ({ message, onChange, chats, sendMessage }) => {
	return (
		<Container>
			<ChatContainer>
			<p className="text-center text-sm mt-1">Your messages will appear here.</p>
				<Chats>
					{chats?.map((c, i) => (
						<MessageInfo isUser={c?.from === 'Me' ? true : false}>
							<MessageSender>{c?.from}</MessageSender>
							<Message>{c?.message}</Message>
						</MessageInfo>
					))}
				</Chats>
			</ChatContainer>
			<TextBox>
				<Text>
					<Input placeholder="Send Message" value={message} onChange={onChange} />
					<Send style={{ color: 'lightgray' }} onClick={sendMessage}/>
				</Text>
			</TextBox>
		</Container>
	);
};

export default Chat;
