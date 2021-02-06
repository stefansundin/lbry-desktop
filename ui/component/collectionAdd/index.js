import { connect } from 'react-redux';
import CollectionAdd from './view';
import { withRouter } from 'react-router';
import {
  makeSelectClaimForUri,
  doCreateUnpublishedCollection,
  doUpdateUnpublishedCollection,
  selectBuiltinCollections,
  selectMyPublishedCollections,
  selectMyUnpublishedCollections,
} from 'lbry-redux';

const select = (state, props) => ({
  claim: makeSelectClaimForUri(props.uri)(state),
  builtin: selectBuiltinCollections(state),
  published: selectMyPublishedCollections(state),
  unpublished: selectMyUnpublishedCollections(state),
});

const perform = dispatch => ({
  addCollection: name => dispatch(doCreateUnpublishedCollection(name)),
  updateCollection: (id, params) => dispatch(doUpdateUnpublishedCollection(id, params)),
});

export default withRouter(connect(select, perform)(CollectionAdd));
