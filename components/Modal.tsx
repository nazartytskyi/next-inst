import Image from 'next/image';

import { useRecoilState } from 'recoil';
import { modalState } from '../atoms/modelAtom';
import { Dialog, Transition } from '@headlessui/react';
import { ChangeEvent, Fragment, useRef, useState } from 'react';
import { CameraIcon } from '@heroicons/react/outline';
import { addDoc, collection, doc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { useSession } from 'next-auth/react';
import { db, storage } from '../firebase';
import { getDownloadURL, ref, uploadString } from 'firebase/storage';

const Modal: React.FunctionComponent = () => {
  const { data: session } = useSession();
  const [open, setOpen] = useRecoilState(modalState);
  const filePickerRef = useRef<HTMLInputElement>(null);
  const captionRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);

  const addImageToPost = (e: ChangeEvent<HTMLInputElement>) => {
    const reader = new FileReader();

    if (e.target?.files![0]) {
      reader.readAsDataURL(e.target.files[0]);
    }

    reader.onload = (readerEvent: ProgressEvent<FileReader>) => {
      let file: string | null = null;
      if (readerEvent.target?.result instanceof ArrayBuffer && readerEvent.target?.result) {
        const enc = new TextDecoder();
        file = enc.decode(readerEvent.target?.result);
      } else if (typeof readerEvent.target?.result === 'string' && readerEvent.target?.result) {
        file = readerEvent.target?.result;
      }

      setSelectedFile(file);
    };
  };

  const uploadPost = async () => {
    if (loading) return;

    setLoading(true);

    const docRef = await addDoc(collection(db, 'posts'), {
      username: session?.user?.username,
      avatar: session?.user?.image,
      caption: captionRef.current?.value ?? '',
      timestamp: serverTimestamp(),
    });

    console.log('new doc added with ID', docRef.id);

    const imageRef = ref(storage, `posts/${docRef.id}/image`);

    await uploadString(imageRef, selectedFile!, 'data_url').then(async (snapshot) => {
      const downloadURL = await getDownloadURL(imageRef);

      await updateDoc(doc(db, 'posts', docRef.id), {
        image: downloadURL,
      });
      session!.user!.publications!++;
      await updateDoc(doc(db, 'users', session?.user?.username!), {
        publications: session!.user!.publications,
      });
    });

    setOpen(false);
    setLoading(false);
    setSelectedFile(null);
  };

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as='div' className='fixed z-10 inset-0 overflow-y-auto' onClose={() => setOpen(false)}>
        <div className='flex items-end justify-center min-h-[800px] sm:min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0'>
          <Transition.Child
            as={Fragment}
            enter='easy-out duration-300'
            enterFrom='opacity-0'
            enterTo='opacity-100'
            leave='easy-in duration-200'
            leaveFrom='opacity-100'
            leaveTo='opacity-0'
          >
            <Dialog.Overlay className='fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity' />
          </Transition.Child>

          <span className='hidden sm:inline-block sm:align-middle sm:h-screen' aria-hidden='true'>
            &#8203;
          </span>

          <Transition.Child
            as={Fragment}
            enter='easy-out duration-300'
            enterFrom='opacity-0 transtate-y-4 sm:transtate-y-0 sm:scale-95'
            enterTo='opacity-100 transtate-y-0 sm:scale-100'
            leave='easy-in duration-200'
            leaveFrom='opacity-100 transtate-y-0 sm:scale-100'
            leaveTo='opacity-0 transtate-y-4 sm:transtate-y-0 sm:scale-95'
          >
            <div className='inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-sm sm:w-full'>
              <div>
                {selectedFile ? (
                  <Image
                    className='cursor-pointer'
                    width='4'
                    height='3'
                    src={selectedFile}
                    onClick={() => setSelectedFile(null)}
                    layout='responsive'
                    objectFit='cover'
                    alt='Post picture'
                  />
                ) : (
                  <div
                    onClick={() => {
                      filePickerRef.current?.click();
                    }}
                    className='mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 cursor-pointer'
                  >
                    <CameraIcon className='h-6 w-6 text-red-600' aria-hidden='true' />
                  </div>
                )}

                <div>
                  <div className='mt-3 text-center sm:mt-5'>
                    <Dialog.Title as='h3' className='text-lg leading-6 font-semibold text-gray-900'>
                      Upload a photo
                    </Dialog.Title>

                    <div>
                      <input ref={filePickerRef} type='file' hidden onChange={addImageToPost} />
                    </div>

                    <div className='mt-2'>
                      <input
                        className='border-none focus:ring-0 w-full text-center'
                        type='text'
                        ref={captionRef}
                        placeholder='Please enter a caption...'
                      />
                    </div>
                  </div>
                </div>

                <div className='mt-5 sm:mt-6'>
                  <button
                    type='button'
                    disabled={!selectedFile}
                    onClick={uploadPost}
                    className='inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring focus:ring-offset-2 focus:ring-red-500 sm:text-sm disabled:bg-gray-300 disabled:cursor-not-allowed hover:disabled:bg-gray-300'
                  >
                    {loading ? 'Uploading...' : 'Upload Post'}
                  </button>
                </div>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default Modal;
