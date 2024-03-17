import { Box, Button, Modal } from "@mui/material";
import React from "react";

interface ModalCustomProps {
    children: React.ReactNode;
    setHandleModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
    handleModalOpen: boolean;
}

const style = {
	position: "absolute" as "absolute",
	top: "50%",
	left: "50%",
	transform: "translate(-50%, -50%)",
	width: 400,
	bgcolor: "background.paper",
	boxShadow: 24,
	p: 4,
};

const ModalCustom = ({ children, setHandleModalOpen, handleModalOpen }: ModalCustomProps) => {
	const handleClose = () => setHandleModalOpen(false);

	return (
		<div>
			<Modal
				open={handleModalOpen}
				onClose={handleClose}
				aria-labelledby="modal-modal-title"
				aria-describedby="modal-modal-description"
			>
				<Box sx={style}>
					{children}
				</Box>
			</Modal>
		</div>
	);
};

export default ModalCustom;
