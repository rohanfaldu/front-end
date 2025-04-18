'use client'
import { useState } from 'react'
import ModalVideo from 'react-modal-video'
import Modal from 'react-modal';
import "../../node_modules/react-modal-video/css/modal-video.css"
import ReactPlayer from 'react-player';
export default function Video({ type, link }) {
	//const [open, setOpen] = useState(false);
	const [isOpen, setIsOpen] = useState(false);
	// console.log('type');
	// console.log(type);
	const openModal = () => setIsOpen(true);
	const closeModal = () => setIsOpen(false);
	return (
		<>
			<a onClick={() => setIsOpen(true)} className="btn-video">
				<span className="icon icon-play2" />
			</a>
			{isOpen && (
				<div className="modal-video-wrapper">
					{type === 'mp4' ? (
						<div className="modal-video">
							<video controls autoPlay>
								<source src={link} type="video/mp4" />
								Your browser does not support the video tag.
							</video>
							<button className="close-button" onClick={() => setOpen(false)}>Close</button>
						</div>
					) : (
						
						// <ModalVideo
						// 	channel="youtube"
						// 	autoplay
						// 	isOpen={isOpen}
						// 	videoId="vfhzo499OeA"
						// 	onClose={() => setOpen(false)}
						// />
						<Modal
							isOpen={isOpen}
							onRequestClose={closeModal}
							contentLabel="Video Modal"
							style={{
							overlay: { backgroundColor: 'rgba(0, 0, 0, 0.75)' },
							content: { padding: 0, border: 'none', borderRadius: '10px', height: 'auto', margin: 'auto' },
							}}
						>
							{/* <video
								controls
								autoPlay
								style={{ width: '100%', height: 'auto' }}
							>
							<source src="/path/to/video.mp4" type="video/mp4" />
								Your browser does not support the video tag.
							</video> */}
								<ReactPlayer
									url={link}
									controls
									width="100%"
									height="400px"
								/>
						</Modal>
					)}
				</div>
			)}
		</>
	)
}