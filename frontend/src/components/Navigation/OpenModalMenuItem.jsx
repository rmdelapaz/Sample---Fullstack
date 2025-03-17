
import { useModal } from '../../context/Modal';

function OpenModalMenuItem({
  modalComponent,
  itemText,
  onItemClick, // optional: callback function ---> called once the menu item that opens the modal is clicked
  onModalClose // optional: callback function ---> called once the modal is closed
}) {
  const { setModalContent, setOnModalClose } = useModal();

  const onClick = () => {
    if (onModalClose) setOnModalClose(onModalClose);
    setModalContent(modalComponent);
    if (typeof onItemClick === "function") onItemClick();
  };

  return (
    <li onClick={onClick}>{itemText}</li>
  );
}

export default OpenModalMenuItem;