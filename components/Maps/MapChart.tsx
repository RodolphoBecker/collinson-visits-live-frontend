import { worldCountries } from "@/utils/world-countries";
import {
	Autocomplete,
	Card,
	CardContent,
	CircularProgress,
	Divider,
	Stack,
	TextField,
} from "@mui/material";
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
import ModalCustom from "../Modal";
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';

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

type LoungeCodeOptions = {
	label: string;
}[];

const MapChart = () => {
	const [data, setData] = useState<LoungeData>([]);
	const [maxValue, setMaxValue] = useState(0);
	const [scaleFactor, setScaleFactor] = useState(1);
	const [loading, setLoading] = useState(false);
	const [loungeCodesOptions, setLoungeCodesOptions] =
		useState<LoungeCodeOptions>([]);
	const [clickedLounge, setClickedLounge] = useState<LoungeData[0] | null>(
		null
	);
	const [handleModalOpen, setHandleModalOpen] = useState(false);

	useEffect(() => {
		csv("/data.csv").then((lounges: any) => {
			const sortedLounges = sortBy(lounges, (o) => -o.total_guest_count);

			const mappedLounges: LoungeData = sortedLounges.map((lounge) => ({
				...lounge,
				lat: parseFloat(lounge.lat),
				lng: parseFloat(lounge.lng),
				total_guest_adult: parseInt(lounge.total_guest_adult),
				total_guest_child: parseInt(lounge.total_guest_child),
				total_guest_infant: parseInt(lounge.total_guest_infant),
				total_guest_count: parseInt(lounge.total_guest_count),
				color: randomColor(),
			}));

			const loungeCodes = mappedLounges.map((lounge) => ({
				label: lounge.lounge_code,
			}));

			setLoungeCodesOptions(loungeCodes);

			setMaxValue(mappedLounges[0].total_guest_count);

			setData(mappedLounges);
		});
	}, []);

	const popScale = useMemo(
		() => scaleLinear().domain([0, maxValue]).range([0, 20]),
		[maxValue]
	);

	const loungeCodeFilter = (loungesCode: { label: string }[]) => {
		console.log(loungesCode);
	};

	const handleClickedLounge = (lounge: LoungeData[0]) => {
		setClickedLounge(lounge);
		setHandleModalOpen(true);
	};

	return (
		<>
			<Stack flexDirection="column" rowGap={2}>
				<Card variant="outlined">
					<CardContent sx={{ display: "flex", alignItems: "center" }}>
						<Autocomplete
							disablePortal
							multiple
							id="lounge-code-select"
							options={loungeCodesOptions}
							sx={{ width: 300 }}
							renderInput={(params) => (
								<TextField {...params} label="Lounge Code" />
							)}
							onChange={(event, value) => {
								loungeCodeFilter(value);
							}}
						/>
					</CardContent>
				</Card>
				<Card variant="outlined">
					<CardContent
						sx={{
							height: "800px",
							display: "flex",
							justifyContent: "center",
							alignItems: "center",
						}}
					>
						{loading ? (
							<CircularProgress />
						) : (
							<ComposableMap
								projection={"geoEqualEarth"}
								projectionConfig={{ rotate: [-10, 0, 0], scale: 150 }}
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
								{data.map((lounge) => {
									return (
										<Tooltip
											key={lounge.lounge_code}
											title={
												<>
													<ul>
														<li>Lounge Code: {lounge.lounge_code}</li>
														<li>Total Guests: {lounge.total_guest_count}</li>
														<Divider
															sx={{
																marginTop: "5px",
																marginBottom: "5px",
																background: "white",
															}}
														/>
														<li>Latitude: {lounge.lat}</li>
														<li>Longitude: {lounge.lng}</li>
													</ul>
												</>
											}
										>
											<Marker
												key={lounge.lounge_code}
												coordinates={[lounge.lng, lounge.lat]}
											>
												<circle
													stroke="#FFF"
													opacity={0.8}
													fill={lounge.color}
													r={popScale(lounge.total_guest_count)}
													onClick={() => {
														handleClickedLounge(lounge);
													}}
												/>
											</Marker>
										</Tooltip>
									);
								})}
							</ComposableMap>
						)}
					</CardContent>
				</Card>
			</Stack>
			<ModalCustom
				setHandleModalOpen={setHandleModalOpen}
				handleModalOpen={handleModalOpen}
			>
				<ul>
					<li>
						<AccountBalanceIcon sx={{ color: "rgb(162, 7, 41)" }} />
						<strong>Lounge Code: {clickedLounge?.lounge_code}</strong>
					</li>
				</ul>
			</ModalCustom>
		</>
	);
};

export default MapChart;
