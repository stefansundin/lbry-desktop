import { connect } from 'react-redux';
import { doHideModal } from 'redux/actions/app';
import CollectionAdd from './view';

const select = state => ({});

const perform = {
  doHideModal,
};

export default connect(select, perform)(CollectionAdd);
