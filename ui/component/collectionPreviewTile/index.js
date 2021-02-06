import { connect } from 'react-redux';
import {
  doResolveUri,
  makeSelectIsUriResolving,
  makeSelectThumbnailForUri,
  makeSelectTitleForUri,
  makeSelectChannelForClaimUri,
  makeSelectClaimIsNsfw,
  makeSelectClaimIdForUri,
  makeSelectClaimForClaimId,
  makeSelectUrlsForCollectionId,
  makeSelectNameForCollectionId,
} from 'lbry-redux';
import { selectBlockedChannels } from 'redux/selectors/blocked';
import { selectBlackListedOutpoints, selectFilteredOutpoints } from 'lbryinc';
import { selectShowMatureContent } from 'redux/selectors/settings';
import CollectionPreviewTile from './view';

const select = (state, props) => {
  const collectionId = props.collectionId || (props.uri && makeSelectClaimIdForUri(props.uri));
  const claim = props.collectionId && makeSelectClaimForClaimId(props.collectionId)(state);
  const collectionUri = props.uri || (claim && (claim.canonical_url || claim.permanent_url)) || null;

  return {
    collectionId,
    uri: collectionUri,
    collectionName: makeSelectNameForCollectionId(collectionId)(state),
    collectionItemUrls: makeSelectUrlsForCollectionId(collectionId)(state), // ForId || ForUri
    claim,
    channel: collectionUri && makeSelectChannelForClaimUri(collectionUri)(state),
    isResolvingUri: collectionUri && makeSelectIsUriResolving(collectionUri)(state),
    thumbnail: collectionUri && makeSelectThumbnailForUri(collectionUri)(state),
    title: collectionUri && makeSelectTitleForUri(collectionUri)(state),
    blackListedOutpoints: selectBlackListedOutpoints(state),
    filteredOutpoints: selectFilteredOutpoints(state),
    blockedChannelUris: selectBlockedChannels(state),
    showMature: selectShowMatureContent(state),
    isMature: makeSelectClaimIsNsfw(collectionUri)(state),
  };
};

const perform = dispatch => ({
  resolveUri: uri => dispatch(doResolveUri(uri)),
});

export default connect(select, perform)(CollectionPreviewTile);
