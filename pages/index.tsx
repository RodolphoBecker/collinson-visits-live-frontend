import { Button, Stack, Typography } from "@mui/material";
import { NextPage } from "next";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect } from "react";

const Home: NextPage = () => {
	const router = useRouter();

	const handleButtonClick = (url: string) => {
		router.push(url);
	};

	return (
		<Stack
			height="100vh"
			justifyContent="center"
			display="flex"
			flexDirection="row"
		>
			<Stack
				flexBasis="50%"
				height="100%"
				className="white-background"
				sx={{ alignItems: "center", justifyContent: "center" }}
			>
				<Image
					src={"/background-collinson.png"}
					height={400}
					width={400}
					alt="logo-collinson"
				/>
			</Stack>
			<Stack
				flexBasis="50%"
				height="100%"
				flexDirection="column"
				justifyContent="center"
				className="collinson-red-background"
			>
				<Typography variant="h5" sx={{ textAlign: "center", width: "100%" }}>
					Please select one of the following options to see more about
				</Typography>
				<Stack
					display="flex"
					flexDirection="row"
					justifyContent="center"
					width="100%"
					mt="100px"
					columnGap={5}
				>
					<Button
						variant="contained"
						color="inherit"
						className="collinson-pink-background collinson-red-text"
						onClick={() => handleButtonClick("/visits")}
					>
						Visits
					</Button>
					<Button variant="contained" color="info" disabled>
						Future Section
					</Button>
				</Stack>
			</Stack>
		</Stack>
	);
};

export default Home;
