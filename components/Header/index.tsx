import HomeIcon from "@mui/icons-material/Home";
import MenuIcon from "@mui/icons-material/Menu";
import {
	AppBar,
	Button,
	Container,
	List,
	ListItemButton,
	ListItemIcon,
	ListItemText,
	Toolbar,
} from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import DrawerDefault from "../Drawer";

const pages = [
	{
		link: "/",
		text: "Home",
		layout: "conciliacao_impostos",
		icon: <HomeIcon />,
	},
];

const Header = () => {
	const [open, setOpen] = useState<boolean>(false);

	const router = useRouter();

	const path = router.pathname;

	return (
		<AppBar position="fixed" sx={{ background: "white" }}>
			<Container maxWidth="xl">
				<Toolbar
					disableGutters
					sx={{ display: "flex", justifyContent: "space-between" }}
				>
					<Link href={"/"} passHref>
						<Image
							src={"/logo.png"}
							width={131}
							height={36}
							alt="logo-collinson"
						/>
					</Link>

					<Button onClick={() => setOpen(true)}>
						{<MenuIcon sx={{ color: "rgb(162, 7, 41)" }} fontSize="large" />}
					</Button>

					<DrawerDefault open={open} setOpen={setOpen}>
						<List
							component="nav"
							aria-label="menu-list"
							sx={{ padding: "10px", background: "rgb(162, 7, 41)", height: "100%" }}
						>
							{pages.map((page, i) => {
								return (
									<Link href={page.link} passHref key={i}>
										<ListItemButton
											selected={path === page.link}
											onClick={() => setOpen(false)}
										>
											<ListItemIcon sx={{ color: "white" }}>
												{page.icon}
											</ListItemIcon>
											<ListItemText
												sx={{ color: "white" }}
												primary={page.text}
											/>
										</ListItemButton>
									</Link>
								);
							})}
						</List>
					</DrawerDefault>
				</Toolbar>
			</Container>
		</AppBar>
	);
};

export default Header;
