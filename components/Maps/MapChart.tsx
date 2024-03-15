import { worldCountries } from "@/utils/world-countries";
import { Card, CardContent, Divider } from "@mui/material";
import Tooltip from "@mui/material/Tooltip";
import { csv } from "d3-fetch";
import { scaleLinear } from "d3-scale";
import sortBy from "lodash/sortBy";
import randomColor from "randomcolor";
import { useEffect, useMemo, useState } from "react";
import {
	ComposableMap,
	Geographies,
	Geography,
	Marker,
} from "react-simple-maps";

type LoungeData = {
	lat: number;
	lng: number;
	lounge_code: string;
	color: string;
	total_guest_count: number;
	total_guest_adult: number;
	total_guest_child: number;
	total_guest_infant: number;
}[];

const MapChart = () => {
	const [data, setData] = useState<LoungeData>([]);
	const [maxValue, setMaxValue] = useState(0);
	const [scaleFactor, setScaleFactor] = useState(1);

	useEffect(() => {
		csv("/data.csv").then((lounges: any) => {
			const sortedLounges = sortBy(lounges, (o) => -o.total_guest_count);

			const mappedLounges = sortedLounges.map((lounge) => ({
				...lounge,
				lat: parseFloat(lounge.lat),
				lng: parseFloat(lounge.lng),
				total_guest_adult: parseInt(lounge.total_guest_adult),
				total_guest_child: parseInt(lounge.total_guest_child),
				total_guest_infant: parseInt(lounge.total_guest_infant),
				total_guest_count: parseInt(lounge.total_guest_count),
				color: randomColor(),
			}));

			setMaxValue(mappedLounges[0].total_guest_count);

			setData(mappedLounges);
		});
	}, []);

	const popScale = useMemo(
		() => scaleLinear().domain([0, maxValue]).range([0, 20]),
		[maxValue]
	);

	return (
		<Card variant="outlined">
			<CardContent>
				<ComposableMap
					height={400}
					width={800}
					projection={"geoEqualEarth"}
					projectionConfig={{ rotate: [-10, 0, 0], scale: 120 }}
				>
					{/* <ZoomableGroup onMove={({ zoom }) => setScaleFactor(zoom)}> */}
					<Geographies geography={worldCountries}>
						{({ geographies }) =>
							geographies.map((geo) => (
								<Geography
									key={geo.rsmKey}
									geography={geo}
									fill="#DDD"
									stroke="black"
									strokeWidth={0.1}
								/>
							))
						}
					</Geographies>
					{/* </ZoomableGroup> */}

					{data.map(({ lounge_code, lng, lat, color, total_guest_count }) => {
						return (
							<Tooltip
								key={lounge_code}
								title={
									<>
										<ul>
											<li>Lounge Code: {lounge_code}</li>
											<li>Total Guests: {total_guest_count}</li>
											<Divider
												sx={{
													marginTop: "5px",
													marginBottom: "5px",
													background: "white",
												}}
											/>
											<li>Latitude: {lat}</li>
											<li>Longitude: {lng}</li>
										</ul>
									</>
								}
							>
								<Marker key={lounge_code} coordinates={[lng, lat]}>
									<circle
										fill={color}
										stroke="#FFF"
										r={popScale(total_guest_count)}
										opacity={0.8}
									/>
								</Marker>
							</Tooltip>
						);
					})}
				</ComposableMap>
			</CardContent>
		</Card>
	);
};

export default MapChart;
