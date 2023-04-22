import React, { useState, useRef, useEffect, useCallback } from 'react';
import io from 'socket.io-client';
import Video from './Video';
import styled from 'styled-components';
import { Videocam, VideocamOff, MicOff, Mic, Call} from '@material-ui/icons';

const Container = styled.div`
	height: 100%;
	color: whitesmoke;
	padding: 1% 1%;
	flex: 0.7;
	box-sizing: border-box;
	display: flex;
	flex-direction: column;
	align-items: center;
	overflow:hidden;
	justify-content: space-between;
`;

const Circle = styled.div`
	width: 3em;
	height: 3em;
	border-radius: 50%;
	background-color: #4b4e61;
	display: flex;
	align-items: center;
	justify-content: center;
	margin-right: 1em;
	cursor: pointer;
`;

const RedCircle = styled.div`
	width: 3em;
	height: 3em;
	border-radius: 50%;
	background-color: tomato;
	display: flex;
	align-items: center;
	justify-content: center;
	margin-right: 1em;
	cursor: pointer;
`;

const Main = styled.div`
	display: grid;
	grid-template-columns:1fr 1fr;
	width:100%;
	height: 100%;
	gap:20px 20px;
	background-color: #343640;
	flex:0.9;
	overflow-y:auto;
`;
const Footer = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;
	flex:0.1;
	
`;

const UserVideo = styled.video`
	width: 100%;
	 height: 100%;
`
const pc_config = {
	iceServers: [
		// {
		//   urls: 'stun:[STUN_IP]:[PORT]',
		//   'credentials': '[YOR CREDENTIALS]',
		//   'username': '[USERNAME]'
		// },
		{
			urls: 'stun:stun.l.google.com:19302',
		},
	],
};
const SOCKET_SERVER_URL = 'http://localhost:8080';

const Room = ({ user, addMember, message, setChat, send, setMessage, setMember }) => {
	const [toggleMic, setToggleMic] = useState(false);
	const [toggleVideo, setToggleVideo] = useState(false);
	const socketRef = useRef();
	const pcsRef = useRef({});
	const localVideoRef = useRef(null);
	const localStreamRef = useRef();
	const [users, setUsers] = useState([]);

	//get media stream using the getUserMedia Api
	const getLocalStream = useCallback(async () => {
		try {
			const localStream = await navigator.mediaDevices.getUserMedia({
				audio: true,
				video: true,
			});
			localStreamRef.current = localStream;
			if (localVideoRef.current) localVideoRef.current.srcObject = localStream;
			if (!socketRef.current) return;
			socketRef.current.emit('join_room', user);
		} catch (e) {
			console.log(`getUserMedia error: ${e}`);
		}
	}, []);

	const createPeerConnection = useCallback((socketID, email) => {
		try {
			const pc = new RTCPeerConnection(pc_config);

			pc.onicecandidate = (e) => {
				if (!(socketRef.current && e.candidate)) return;
				console.log('onicecandidate');
				socketRef.current.emit('candidate', {
					candidate: e.candidate,
					candidateSendID: socketRef.current.id,
					candidateReceiveID: socketID,
				});
			};

			pc.oniceconnectionstatechange = (e) => {
				console.log(e);
			};

			pc.ontrack = (e) => {
				console.log('ontrack success');
				setUsers((oldUsers) =>
					oldUsers
						.filter((user) => user.id !== socketID)
						.concat({
							id: socketID,
							email,
							stream: e.streams[0],
						}),
				);
			};

			if (localStreamRef.current) {
				console.log('localstream add');
				localStreamRef.current.getTracks().forEach((track) => {
					if (!localStreamRef.current) return;
					pc.addTrack(track, localStreamRef.current);
				});
			} else {
				console.log('no local stream');
			}

			return pc;
		} catch (e) {
			console.error(e);
			return undefined;
		}
	}, []);

	const storeChat = useCallback((data) =>{
		setChat(data)
	},[])

	useEffect(() => {
		socketRef.current = io.connect(SOCKET_SERVER_URL);
		getLocalStream();

		socketRef.current.on('all_users', (allUsers) => {
			allUsers.forEach(async (user) => {
				if (!localStreamRef.current) return;
				const pc = createPeerConnection(user.id, user.email);
				if (!(pc && socketRef.current)) return;
				pcsRef.current = { ...pcsRef.current, [user.id]: pc };
				try {
					const localSdp = await pc.createOffer({
						offerToReceiveAudio: true,
						offerToReceiveVideo: true,
					});
					console.log('create offer success');
					await pc.setLocalDescription(new RTCSessionDescription(localSdp));
					socketRef.current.emit('offer', {
						sdp: localSdp,
						offerSendID: socketRef.current.id,
						offerSendEmail: user.email,
						offerReceiveID: user.id,
					});
				} catch (e) {
					console.error(e);
				}
			});
		});

		socketRef.current.on(
			'getOffer',
			async (data) => {
				const { sdp, offerSendID, offerSendEmail } = data;
				console.log('get offer');
				if (!localStreamRef.current) return;
				const pc = createPeerConnection(offerSendID, offerSendEmail);
				if (!(pc && socketRef.current)) return;
				pcsRef.current = { ...pcsRef.current, [offerSendID]: pc };
				try {
					await pc.setRemoteDescription(new RTCSessionDescription(sdp));
					console.log('answer set remote description success');
					const localSdp = await pc.createAnswer({
						offerToReceiveVideo: true,
						offerToReceiveAudio: true,
					});
					await pc.setLocalDescription(new RTCSessionDescription(localSdp));
					socketRef.current.emit('answer', {
						sdp: localSdp,
						answerSendID: socketRef.current.id,
						answerReceiveID: offerSendID,
					});
				} catch (e) {
					console.error(e);
				}
			},
		);

		socketRef.current.on(
			'getAnswer',
			(data) => {
				const { sdp, answerSendID } = data;
				console.log('get answer');
				const pc= pcsRef.current[answerSendID];
				if (!pc) return;
				pc.setRemoteDescription(new RTCSessionDescription(sdp));
			},
		);

		

		socketRef.current.on(
			'getCandidate',
			async (data) => {
				console.log('get candidate');
				const pc = pcsRef.current[data.candidateSendID];
				if (!pc) return;
				await pc.addIceCandidate(new RTCIceCandidate(data.candidate));
				console.log('candidate add success');
			},
		);

		socketRef.current.on('addMessages', (data)=>{
			storeChat(data)
			console.log('chatdata reeceived')
		})


		socketRef.current.on('user_exit', (data) => {
			if (!pcsRef.current[data.id]) return;
			pcsRef.current[data.id].close();
			delete pcsRef.current[data.id];
			setUsers((oldUsers) => oldUsers.filter((user) => user.id !== data.id));
		});

		return () => {
			if (socketRef.current) {
				socketRef.current.disconnect();
			}
			users.forEach((user) => {
				if (!pcsRef.current[user.id]) return;
				pcsRef.current[user.id].close();
				delete pcsRef.current[user.id];
			});
		};

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [createPeerConnection, getLocalStream, storeChat]);

	useEffect(() => {
		addMember(users)
	}, [users])

	//send message to other peers
	useEffect(() => {
		if(send > 0){
			socketRef.current.emit('sendMessage', {room:user.room, message:message})
			setChat({from:'Me', message:message})
			setMessage('')
		}
	}, [send])

	//disable and enable camera
	const toggleCamera = async () => {
		let videoTrack = localStreamRef.current.getTracks().find(track => track.kind === 'video');
		if(videoTrack.enabled){
			videoTrack.enabled = false
			setToggleVideo(true)
		}else{
			videoTrack.enabled = true
			setToggleVideo(false)
		}
	}

	//disable and enable audio
	const toggleAudio = async () => {
		let audioTrack = localStreamRef.current.getTracks().find(track => track.kind === 'audio');
		if(audioTrack.enabled){
			audioTrack.enabled = false
			setToggleMic(true)
		}else{
			audioTrack.enabled = true
			setToggleMic(false)
		}
	}

	//end call
	const leaveCall = () =>{
		window.location.href = '/'
	}


	console.log({users})


	return (
		<Container>
		
			<Main >
				<UserVideo
					muted
					ref={localVideoRef}
					autoPlay
				/>
				{users.map((user, index) => (
					<Video key={index} email={user.email} stream={user.stream} />
				))} 
			</Main>
			<Footer>
				<Circle onClick={toggleAudio}>
					{!toggleMic && <Mic style={{ color: 'whitesmoke' }} />}
					{toggleMic && <MicOff style={{ color: 'whitesmoke' }} />}
				</Circle>
				<Circle onClick={toggleCamera}>
					{!toggleVideo && <Videocam style={{ color: 'whitesmoke' }} />}
					{toggleVideo && <VideocamOff style={{ color: 'whitesmoke' }} />}
				</Circle>
				<RedCircle onClick={leaveCall}>
					<Call />
				</RedCircle>
			</Footer>
		</Container>
	);
};

export default Room;
