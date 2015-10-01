import React, {Component, PropTypes} from 'react';
import Promise from 'bluebird';
// Components
import Modal from 'app/stardust/Modal/Modal';
import ModalContent from 'app/stardust/Modal/ModalContent';
import ModalFooter from 'app/stardust/Modal/ModalFooter';
import ModalHeading from 'app/stardust/Modal/ModalHeading';

class ConfirmationModal extends Component {
  static propTypes = {
    abortLabel: PropTypes.string,
    confirmLabel: PropTypes.string,
    header: PropTypes.string,
    ref: PropTypes.string,
  };

  static defaultProps = {
    abortLabel: 'Cancel',
    confirmLabel: 'Yes',
    ref: 'modal',
  };

  state = {
    message: 'Remove this item from the list?',
  }

  componentDidMount() {
    this.deferred = Promise.defer();
  }

  handleAbort = () => {
    // Promise is resolved, confirmation is false
    this.deferred.resolve(false);
    this.refs.modal.hideModal();
  };

  handleConfirm = () => {
    // Promise is resolved, confirmation is true
    this.deferred.resolve(true);
    this.refs.modal.hideModal();
  };

  show = (message) => {
    // Need to reset promise with every time show() is called to clear out the promise resolve
    // from the previous button that called show method:
    this.deferred = Promise.defer();
    this.setState({message: message});

    this.refs.modal.showModal();
    // Send back promise to be resolved
    return this.deferred.promise;
  };

  render() {
    return (
      <Modal actionRequired ref='modal'>
        <ModalHeading>
          {this.props.header}
        </ModalHeading>
        <ModalContent>
          {this.state.message}
        </ModalContent>
        <ModalFooter>
          <div className='sd-abort-button ui button' onClick={this.handleAbort}>{this.props.abortLabel}</div>
          <div className='sd-confirm-button ui blue button' onClick={this.handleConfirm}>{this.props.confirmLabel}</div>
        </ModalFooter>
      </Modal>
    );
  }
}

export default ConfirmationModal;
