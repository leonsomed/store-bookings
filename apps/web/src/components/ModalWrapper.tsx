interface ModalWrapperProps {
  children: React.ReactNode | string;
}

export const ModalWrapper = ({ children }: ModalWrapperProps) => {
  return (
    <div className="bg-black bg-opacity-80 fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center">
      <div className="bg-white w-1/2 p-6 rounded-sm">{children}</div>
    </div>
  );
};
