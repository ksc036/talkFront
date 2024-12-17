import React from 'react';
import { createPortal } from 'react-dom';

const ModalPortal = ({
  children,
  container,
}: {
  children: React.ReactNode;
  container?: HTMLElement | null;
}) => {
  return createPortal(children, container ?? document.body);
};

export default ModalPortal;
