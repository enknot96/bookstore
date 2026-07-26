import DangerButton from '@/Components/DangerButton';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import Modal from '@/Components/Modal';
import SecondaryButton from '@/Components/SecondaryButton';
import TextInput from '@/Components/TextInput';
import { useForm } from '@inertiajs/react';
import { FormEventHandler, useRef, useState } from 'react';

export default function DeleteUserForm() {
    const [confirmingUserDeletion, setConfirmingUserDeletion] = useState(false);
    const passwordInput = useRef<HTMLInputElement>(null);

    const {
        data,
        setData,
        delete: destroy,
        processing,
        reset,
        errors,
        clearErrors,
    } = useForm({
        password: '',
    });

    const confirmUserDeletion = () => setConfirmingUserDeletion(true);

    const closeModal = () => {
        setConfirmingUserDeletion(false);
        clearErrors();
        reset();
    };

    const deleteUser: FormEventHandler = (e) => {
        e.preventDefault();

        destroy(route('profile.destroy'), {
            data: { password: data.password },
            preserveScroll: true,
            onSuccess: () => closeModal(),
            onError: () => passwordInput.current?.focus(),
            onFinish: () => reset(),
        });
    };

    return (
        <section>
            <header>
                <h2 className="text-lg font-medium text-[#431608]">退会</h2>
                <p className="mt-1 text-sm text-gray-600">
                    退会するとアカウントが無効化され、ログインできなくなります。注文履歴は運用上の記録として保持されます。
                </p>
            </header>

            <DangerButton onClick={confirmUserDeletion} className="mt-4">
                退会する
            </DangerButton>

            <Modal show={confirmingUserDeletion} onClose={closeModal}>
                <form onSubmit={deleteUser} className="p-6">
                    <h2 className="text-lg font-medium text-[#431608]">本当に退会しますか？</h2>

                    <p className="mt-1 text-sm text-gray-600">
                        退会すると再度ログインできなくなります。続行する場合はパスワードを入力してください。
                    </p>

                    <div className="mt-6">
                        <InputLabel htmlFor="delete_password" value="パスワード" className="sr-only" />
                        <TextInput
                            id="delete_password"
                            type="password"
                            ref={passwordInput}
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            className="mt-1 block w-3/4"
                            placeholder="パスワード"
                        />
                        <InputError message={errors.password} className="mt-2" />
                    </div>

                    <div className="mt-6 flex justify-end gap-3">
                        <SecondaryButton onClick={closeModal}>キャンセル</SecondaryButton>
                        <DangerButton disabled={processing}>退会する</DangerButton>
                    </div>
                </form>
            </Modal>
        </section>
    );
}
