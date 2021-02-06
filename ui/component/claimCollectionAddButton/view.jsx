// @flow
import * as MODALS from 'constants/modal_types';
import * as ICONS from 'constants/icons';
import React from 'react';
import classnames from 'classnames';
import Button from 'component/button';

type Props = {
  uri: string,
  doOpenModal: (string, {}) => void,
  fileAction?: boolean,
};

export default function CollectionAddButton(props: Props) {
  const { doOpenModal, uri, fileAction } = props;

  // one form for claim actions, one for thumb
  return (
    <Button
      button={fileAction ? undefined : undefined}
      className={classnames({ 'button--file-action': fileAction })}
      icon={fileAction ? ICONS.ADD : ICONS.LIBRARY}
      iconSize={fileAction ? 22 : undefined}
      label={fileAction ? __('Add to List --[button to support a claim]--') : ''}
      requiresAuth={IS_WEB}
      title={__('Add this claim to a list')}
      onClick={e => {
        e.preventDefault();
        e.stopPropagation();
        if (fileAction) {
          doOpenModal(MODALS.COLLECTION_ADD, { uri });
        } else {
          // just add it to watch later?
        }
      }}
    />
  );
}
