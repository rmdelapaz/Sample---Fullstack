import { useModal } from '../../context/Modal';

function OpenModalButton({
  modalComponent,
  buttonText,
  onButtonClick,
  onModalClose,
  className
}) {
  const { setModalContent, setOnModalClose } = useModal();

  const onClick = (e) => {
    e.stopPropagation();
    if (onButtonClick) onButtonClick(e);
    if (onModalClose) setOnModalClose(onModalClose);
    setModalContent(modalComponent);
  };

  return (
    <button className={className} onClick={onClick}>
      {buttonText}
    </button>
  );
}

export default OpenModalButton;