import { observer } from 'mobx-react-lite';

import { useStore } from '@/stores';

type MailModalType = 'read' | 'writeNew' | 'reply';

interface MailModalProps {
  open: boolean;
  onClose: () => void;
  setModalType: (mode: MailModalType) => void;
  roomId: number;
  name: string;
  email: string;
}

const MailModal = observer((props: MailModalProps) => {
  const { uiStore, talkStore } = useStore();
  const { open, onClose, setModalType, roomId, name, email } = props;
  const { appId } = talkStore;

  if (uiStore.mailDialogMode === 'writeNew') {
    return (
      <></>
      // <MailTalkModal
      //   open={open}
      //   modalType="writeNew"
      //   setModalType={setModalType}
      //   onCloseModal={onClose}
      //   onClickMailAppButton={(mailId: number) => {
      //     console.log('메일 앱으로 이동'); // 메일 앱으로 이동
      //   }}
      //   onSendMailSuccess={onClose}
      //   from={{
      //     roomId: roomId,
      //     name: name,
      //     email: email,
      //   }}
      //   position={{ bottom: 12, right: 12 }}
      //   appId={appId}
      // />
    );
  } else if (uiStore.mailDialogMode === 'read') {
    return (
      <></>
      // <MailTalkModal
      //   open={open}
      //   modalType="read"
      //   setModalType={uiStore.setMailDialogMode}
      //   onCloseModal={onClose}
      //   mailId={uiStore.mailViewId}
      //   onClickMailAppButton={(mailId: number) => {
      //     console.log('메일 앱으로 이동'); // 메일 앱으로 이동
      //   }}
      //   onSendMailSuccess={onClose}
      //   from={{
      //     roomId: roomId,
      //     name: name,
      //     email: email,
      //   }}
      //   position={{ bottom: 12, right: 12 }}
      //   appId={appId}
      // />
    );
  }
  return null;
});

export default MailModal;
