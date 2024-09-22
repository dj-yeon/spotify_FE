'use client';

import useInfoModal from '@/hooks/useInfoModal';
import Modal from './Modal';

const InfoModal = () => {
  const { onClose, isOpen } = useInfoModal();

  const onChange = (open: boolean) => {
    if (!open) {
      onClose();
    }
  };

  return (
    <Modal
      title="Site Information"
      description="how to use this website"
      isOpen={isOpen}
      onChange={onChange}
    >
      <>
        <div className="text-white text-xl">
          <p>
            <strong>Sign Up</strong>
            <br />
            Only users with the &apos;admin&apos; role can add songs to the
            library.
          </p>
          <br />
          <p>
            <strong>Your Library</strong>
            <br />
            After logging in, you can view the list of songs you&apos;ve
            uploaded.
          </p>
          <br />
          <p>
            <strong>Liked Songs</strong>
            <br />
            After logging in, you can view and manage the songs you&apos;ve
            liked on the &quot;Liked Songs&quot; page.
            <br />
            While playing a song, clicking the heart icon (&apos;♥&apos;) on the
            player will add it to your liked songs.
          </p>
          <br />
          <p>
            <strong>Search</strong>
            <br />
            You can search for songs by title or artist.
          </p>
          <br />
          <p>
            <strong>Login Required</strong>
            <br />
            All features, except viewing the newest songs, require you to log
            in.
          </p>
          <br />

          <p>Let me know if you need further adjustments!</p>
        </div>
      </>
    </Modal>
  );
};

export default InfoModal;
