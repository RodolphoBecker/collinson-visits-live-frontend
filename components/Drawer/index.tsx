import React from "react";
import { Drawer } from "@mui/material";

interface Props {
	children: React.ReactNode;
	open: boolean;
	setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const DrawerDefault = ({ children, open, setOpen }: Props) => {
	return (
		<Drawer
			anchor="right"
			open={open}
			onClose={() => setOpen(false)}
			sx={{ minWidth: "200px" }}
		>
			{children}
		</Drawer>
	);
};

export default DrawerDefault;
