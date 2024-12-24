'use client'
import { useState } from 'react'
import ModalVideo from 'react-modal-video'
import "../../node_modules/react-modal-video/css/modal-video.css"

export default function Video({ type, link }) {
	const [isOpen, setOpen] = useState(false)
	return (
		<>
			<a onClick={() => setOpen(true)} className="btn-video">
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
						<ModalVideo
							channel="youtube"
							autoplay
							isOpen={isOpen}
							videoId="vfhzo499OeA"
							onClose={() => setOpen(false)}
						/>
						
					)}
				</div>
			)}
		</>
	)
}