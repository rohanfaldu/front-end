'use client'
import { useState } from 'react'
import ModalVideo from 'react-modal-video'
import "../../node_modules/react-modal-video/css/modal-video.css"

export default function VideoPopup({another}) {
	const [isOpen, setOpen] = useState(false)
	return (
		<>
			<a onClick={() => setOpen(true)} className="btn-video">
				{!another ? <span className="icon icon-play2" /> : <span className="icon icon-play" />}
			</a>
			{isOpen && (
				<div className="modal-video-wrapper">
					{videoType === 'mp4' ? (
						<div className="modal-video">
							<video controls autoPlay>
								<source src="your-video-link.mp4" type="video/mp4" />
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