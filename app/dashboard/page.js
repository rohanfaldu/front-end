
'use client'
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import React, { useEffect, useState } from 'react';

import CountetNumber from "@/components/elements/CountetNumber"
import DashboardChart from "@/components/elements/DashboardChart"
import DeleteFile from "@/components/elements/DeleteFile"
import LayoutAdmin from "@/components/layout/LayoutAdmin"
import Link from "next/link"
export default function Dashboard() {
	const [startDate, setStartDate] = useState(new Date())
	const [endDate, setEndDate] = useState(new Date());
	return (
		<>
			<DeleteFile />
			<LayoutAdmin>
				<div>
					<div className="flat-counter-v2 tf-counter">
						<div className="counter-box">
							<h2>Hello Data</h2>
						</div>
					</div>
				</div>

			</LayoutAdmin >
		</>
	)
}