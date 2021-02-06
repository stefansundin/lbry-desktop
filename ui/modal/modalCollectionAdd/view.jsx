// @flow
import React from 'react';
import CollectionAdd from 'component/collectionAdd';
import { Modal } from 'modal/modal';

type Props = {
  doHideModal: () => void,
  uri: string,
};

const ModalCollectionAdd = (props: Props) => {
  const { doHideModal, uri } = props;
  return (
    <Modal isOpen type="card" onAborted={doHideModal}>
      <CollectionAdd uri={uri} closeModal={doHideModal} />
    </Modal>
  );
};
export default ModalCollectionAdd;
