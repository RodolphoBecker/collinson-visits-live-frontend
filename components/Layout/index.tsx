import React, { ReactNode } from "react";
import { Container, Box } from "@mui/material";
import Header from '../Header'
import Head from "next/head";
import { useRouter } from "next/router";
interface Props {
	children?: ReactNode;
}

const AppLayout = ({ children }: Props) => {
	const router = useRouter();

	return (
		<>
			<Head>
				<title>Collinson</title>
				<meta name="description" content="Generated by create next app" />
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<Header />
			<Container maxWidth="xl" sx={{ paddingTop: "100px" }}>
				<Box pb="50px">{children}</Box>
			</Container>
			<Box
				height="15px"
				width="100%"
				position="fixed"
				bottom="0"
				sx={{ background: "rgb(162, 7, 41)", zIndex: "9999" }}
			/>
		</>
	);
};

export default AppLayout;
