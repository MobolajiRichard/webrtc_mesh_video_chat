import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

const Container = styled.div`
	position: relative;
	width: 100%;
	height: 100%;
`;

const VideoContainer = styled.video`
width: 100%;
height: 100%;
`;



const Video = ({ email, stream, muted }) => {
	const ref = useRef(null);
	const [isMuted, setIsMuted] = useState(false);

	useEffect(() => {
		if (ref.current) ref.current.srcObject = stream;
		if (muted) setIsMuted(muted);
	}, [stream, muted]);

	return (
		<Container>
			<VideoContainer ref={ref} muted={isMuted} autoPlay />
		</Container>
	);
};

export default Video;
