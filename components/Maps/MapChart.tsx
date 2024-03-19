import { worldCountries } from "@/utils/world-countries";
import {
	Autocomplete,
	Button,
	Card,
	CardContent,
	CircularProgress,
	Divider,
	List,
	ListItem,
	Stack,
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableRow,
	TextField,
	Typography,
} from "@mui/material";
import Tooltip from "@mui/material/Tooltip";
import {
	createColumnHelper,
	flexRender,
	getCoreRowModel,
	useReactTable,
} from "@tanstack/react-table";
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
	total_guest_count_adult: number;
	total_guest_count_child: number;
	total_guest_count_infant: number;
}[];

type LoungeCodeOptions = {
	label: string;
}[];

interface ClickedLoungeTableProps {
	loungeData: LoungeData[0];
}

// Create a column helper for the LoungeData
const columnHelper = createColumnHelper<LoungeData[0] | null>();

// Define the columns for the ClickedLoungtable
const columns = [
	columnHelper.accessor("lounge_code", {
		header: () => "Lounge Code",
		cell: (info) => info.getValue(),
	}),
	columnHelper.accessor("lat", {
		header: () => "Latitude",
		cell: (info) => info.renderValue(),
	}),
	columnHelper.accessor("lng", {
		header: () => "Longitude",
		cell: (info) => info.renderValue(),
	}),
	columnHelper.accessor("total_guest_count_infant", {
		header: () => "Total Infant",
		cell: (info) => info.renderValue(),
	}),
	columnHelper.accessor("total_guest_count_child", {
		header: () => "Total Child",
		cell: (info) => info.renderValue(),
	}),
	columnHelper.accessor("total_guest_count_adult", {
		header: () => "Total Adult",
		cell: (info) => info.renderValue(),
	}),
	columnHelper.accessor("total_guest_count", {
		header: () => "Total Guests",
		cell: (info) => info.renderValue(),
	}),
];

// Define the table for the Clicked Lounge on the map
const ClickedLoungeTable = ({ loungeData }: ClickedLoungeTableProps) => {
	const [data, setData] = useState([loungeData]);

	useEffect(() => {
		setData([loungeData]);
	}, [loungeData]);

	const table = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
	});

	return (
		<div className="p-2">
			<Table>
				<TableHead>
					{table.getHeaderGroups().map((headerGroup) => (
						<TableRow key={headerGroup.id} className="collinson-red-background">
							{headerGroup.headers.map((header) => (
								<TableCell
									key={header.id}
									sx={{ color: "white", fontWeight: "bold" }}
								>
									{header.isPlaceholder
										? null
										: flexRender(
												header.column.columnDef.header,
												header.getContext()
										  )}
								</TableCell>
							))}
						</TableRow>
					))}
				</TableHead>
				<TableBody>
					{table.getRowModel().rows.map((row) => (
						<TableRow key={row.id}>
							{row.getVisibleCells().map((cell) => (
								<TableCell key={cell.id}>
									{flexRender(cell.column.columnDef.cell, cell.getContext())}
								</TableCell>
							))}
						</TableRow>
					))}
				</TableBody>
			</Table>
		</div>
	);
};

const MapChart = () => {
	const [data, setData] = useState<LoungeData>([]);
	const [maxValue, setMaxValue] = useState(0);
	// const [scaleFactor, setScaleFactor] = useState(1);
	const [loading, setLoading] = useState(true);
	const [loungeCodesOptions, setLoungeCodesOptions] =
		useState<LoungeCodeOptions>([]);
	const [clickedLounge, setClickedLounge] = useState<LoungeData[0] | null>(
		null
	);

	useEffect(() => {
		csv("/data.csv").then((lounges: any) => {
			const sortedLounges = sortBy(lounges, (o) => -o.total_guest_count);

			const mappedLounges: LoungeData = sortedLounges.map((lounge) => ({
				...lounge,
				lat: parseFloat(lounge.lat),
				lng: parseFloat(lounge.lng),
				total_guest_count_adult: parseFloat(lounge.total_guest_count_adult),
				total_guest_count_child: parseFloat(lounge.total_guest_count_child),
				total_guest_count_infant: parseFloat(lounge.total_guest_count_infant),
				total_guest_count: parseFloat(lounge.total_guest_count),
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

	useEffect(() => {
		const timer = setTimeout(() => {
			setLoading(false)
		}, 3000);
		return () => clearTimeout(timer);
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
	};

	const handleRefresh = () => {
		setLoading(true);
	};

	return (
		<>
			<Stack flexDirection="column" rowGap={2}>
				{/* Interactive actions section */}
				<Card variant="outlined">
					<CardContent
						sx={{ display: "flex", alignItems: "center", columnGap: 2 }}
					>
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
						<Button variant="contained" color="success" disabled onClick={handleRefresh}>
							Refresh Data
						</Button>
					</CardContent>
				</Card>
				{/* Interactive actions section */}

				{/* Selected lounge information section */}
				{clickedLounge !== null ? (
					<Card
						variant="outlined"
						className="white-background"
						sx={{ minHeight: "151px" }}
					>
						<CardContent>
							<ClickedLoungeTable loungeData={clickedLounge} />
						</CardContent>
					</Card>
				) : (
					<Card
						variant="outlined"
						className="collinson-red-background"
						sx={{ minHeight: "151px", display: "flex", alignItems: "center", justifyContent: "center"}}
					>
						<CardContent>
							<Stack textAlign={"center"}>
								<Typography variant="h6" color={"white"}>
									Selected Lounge Information
								</Typography>
								<Typography variant="body1" color={"white"}>
									Click on a lounge for more details
								</Typography>
							</Stack>
						</CardContent>
					</Card>
				)}
				{/* Selected lounge information section */}

				{/* Map Section */}
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
													<List>
														<ListItem>
															<Typography variant="caption">
																Lounge Code: {lounge.lounge_code}
															</Typography>
														</ListItem>
														<ListItem>
															<Typography variant="caption">
																Total Guests: {lounge.total_guest_count}
															</Typography>
														</ListItem>
														<Divider
															sx={{
																marginTop: "5px",
																marginBottom: "5px",
																background: "white",
															}}
														/>
														<ListItem>
															<Typography variant="caption">
																Latitude: {lounge.lat}
															</Typography>
														</ListItem>
														<ListItem>
															<Typography variant="caption">
																Longitude: {lounge.lng}
															</Typography>
														</ListItem>
													</List>
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
				{/* Map Section */}
			</Stack>
		</>
	);
};

export default MapChart;
