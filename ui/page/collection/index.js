import { connect } from 'react-redux';

import { withRouter } from 'react-router-dom';
import CollectionPage from './view';
import {
  doResolveCollection,
  makeSelectCollectionForId,
  makeSelectUrlsForCollectionId,
  makeSelectIsResolvingCollectionForId,
  makeSelectTitleForUri,
  makeSelectThumbnailForUri,
  // makeSelectClaimIsMine,
  makeSelectClaimForUri,
  makeSelectClaimIsPending,
  makeSelectClaimForClaimId,
} from 'lbry-redux';

// /$/collection?pl=<xyz>
// resolve the collection if necessary

const select = (state, props) => {
  const { match } = props;
  const { params } = match;
  const { collectionId } = params;

  const claim = collectionId && makeSelectClaimForClaimId(collectionId)(state);
  const uri = (claim && (claim.canonical_url || claim.permanent_url)) || null;

  return {
    collectionId,
    collection: makeSelectCollectionForId(collectionId)(state),
    collectionUrls: makeSelectUrlsForCollectionId(collectionId)(state),
    isResolvingCollection: makeSelectIsResolvingCollectionForId(collectionId)(state),
    title: makeSelectTitleForUri(uri)(state),
    thumbnail: makeSelectThumbnailForUri(uri)(state),
    // isMine: makeSelectClaimIsMine(uri)(state), // or collection is mine?
    claim: makeSelectClaimForUri(uri)(state),
    pending: makeSelectClaimIsPending(uri)(state),
    uri,
  };
};

const perform = dispatch => ({
  // updatePlaylist
  // updateCollection
  // publishCollection
  collectionResolve: claimId => dispatch(doResolveCollection(claimId)),
});

export default withRouter(connect(select, perform)(CollectionPage));
