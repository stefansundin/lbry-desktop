import { connect } from 'react-redux';
import {
  makeSelectTitleForUri,
  makeSelectThumbnailForUri,
  makeSelectMetadataItemForUri,
  doUpdateCollection,
  doCreateCollection,
  makeSelectAmountForUri,
  makeSelectClaimForUri,
  selectUpdateCollectionError,
  selectUpdatingCollection,
  selectCreateCollectionError,
  selectBalance,
  doClearCollectionErrors,
  selectCreatingCollection,
} from 'lbry-redux';
import { doOpenModal } from 'redux/actions/app';

import CollectionPage from './view';

const select = (state, props) => ({
  claim: makeSelectClaimForUri(props.uri)(state),
  title: makeSelectTitleForUri(props.uri)(state),
  thumbnailUrl: makeSelectThumbnailForUri(props.uri)(state),
  description: makeSelectMetadataItemForUri(props.uri, 'description')(state),
  tags: makeSelectMetadataItemForUri(props.uri, 'tags')(state),
  locations: makeSelectMetadataItemForUri(props.uri, 'locations')(state),
  languages: makeSelectMetadataItemForUri(props.uri, 'languages')(state),
  amount: makeSelectAmountForUri(props.uri)(state),
  updateError: selectUpdateCollectionError(state),
  updatingCollection: selectUpdatingCollection(state),
  createError: selectCreateCollectionError(state),
  creatingCollection: selectCreatingCollection(state),
  balance: selectBalance(state),
});

const perform = dispatch => ({
  openModal: (modal, props) => dispatch(doOpenModal(modal, props)),
  updateCollection: params => dispatch(doUpdateCollection(params)),
  createCollection: params => {
    const { name, amount, ...optionalParams } = params;
    return dispatch(doCreateCollection('@' + name, amount, optionalParams));
  },
  clearCollectionErrors: () => dispatch(doClearCollectionErrors()),
});

export default connect(select, perform)(CollectionPage);
