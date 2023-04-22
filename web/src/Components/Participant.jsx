import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
	height: 100%;
	color: whitesmoke;
	background-color: #343640;
	padding: 0 2%;
	flex: 0.2;
	box-sizing: border-box;
	display: flex;
	flex-direction: column;
	align-items: center;
`;
const Member = styled.div`
	display: flex;
	width: 100%;
	height: 3em;
	padding: 0 2%;
	box-sizing: border-box;
	align-items: center;
	margin-top: 10px;
	border-radius: 10px;
	background-color: #454552;
`;

const Online = styled.div`
	width: 10px;
	height: 10px;
	border-radius: 50%;
	background-color: lightgreen;
	margin-right: 1em;
	margin-left: 0.5em;
`;

const Participant = ({ member }) => {
	const members = member?.map(m => m.email)
	const uniqueMembers = [...new Set(members)]
	console.log({members})
	return (
		<Container>
			<p>Active Members</p>
			{uniqueMembers?.map((m, i) => (
				<Member key={i}>
					<Online> </Online>
					<p className="ml-4">{m}</p>
				</Member>
			))}
		</Container>
	);
};

export default Participant;
