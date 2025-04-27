import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ProfilePicture from '../components/ProfilePicture';
import PersonalDataForm from '../components/PersonalDataForm';
import ChangePasswordForm from '../components/ChangePasswordForm';

const MyProfilePage = () => {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [profileSuccess, setProfileSuccess] = useState('');
    const [profileError, setProfileError] = useState('');
    const [passwordSuccess, setPasswordSuccess] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [user, setUser] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        gender: '',
        birthDate: '',
        phoneNumber: '',
        country: '',
        state: '',
        city: '',
        profilePicture: '',
        bio: '',
    });

    useEffect(() => {
        const fetchUser = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                console.error('Brak tokenu');
                return;
            }

            try {
                const response = await axios.get('http://localhost:8080/api/users/me', {
                    headers: {
                        'x-auth-token': token,
                    },
                });
                setUser(response.data);
                setFormData({
                    gender: response.data.gender || '',
                    birthDate: response.data.birthDate || '',
                    phoneNumber: response.data.phoneNumber || '',
                    country: response.data.country || '',
                    state: response.data.state || '',
                    city: response.data.city || '',
                    profilePicture: response.data.profilePicture || '',
                    bio: response.data.bio || '',
                });
            } catch (error) {
                console.error('Could not fetch user data:', error);
            }
        };

        fetchUser();
    }, []);

    const handleEdit = () => {
        setIsEditing(!isEditing);
        setProfileSuccess('');
        setProfileError('');
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setProfileError('Brak tokenu autoryzacyjnego.');
                return;
            }

            const formDataToSend = new FormData();
            formDataToSend.append('gender', formData.gender);
            formDataToSend.append('birthDate', formData.birthDate);
            formDataToSend.append('phoneNumber', formData.phoneNumber);
            formDataToSend.append('country', formData.country);
            formDataToSend.append('state', formData.state);
            formDataToSend.append('city', formData.city);
            formDataToSend.append('bio', formData.bio);

            if (formData.profilePicture) {
                formDataToSend.append('profilePicture', formData.profilePicture);
            }

            await axios.put('http://localhost:8080/api/users/me', formDataToSend, {
                headers: {
                    'x-auth-token': token,
                    'Content-Type': 'multipart/form-data',
                },
            });

            setUser({ ...user, ...formData });
            setIsEditing(false);
            setProfileSuccess('Profil został zaktualizowany.');
            setProfileError('');
        } catch (error) {
            console.error('Update failed:', error);
            setProfileError('Nie udało się zaktualizować profilu.');
            setProfileSuccess('');
        }
    };


    const handleProfilePictureUpload = (file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            setFormData({ ...formData, profilePicture: reader.result });
        };
        reader.readAsDataURL(file);
    };


    const handleDeleteAccount = async () => {
        if (window.confirm('Czy na pewno chcesz usunąć swoje konto?')) {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    setProfileError('Brak tokenu autoryzacyjnego.');
                    return;
                }

                const url = 'http://localhost:8080/api/users/me';

                await axios.delete(url, {
                    headers: {
                        'x-auth-token': token,
                    },
                });

                localStorage.removeItem('token');
                window.location = '/login';
            } catch (error) {
                setProfileError(
                    error.response?.data?.message || 'Błąd podczas usuwania konta.'
                );
            }
        }
    };

    const handleSubmitPassword = async (e) => {
        e.preventDefault();

        if (newPassword !== confirmNewPassword) {
            setPasswordError('Nowe hasła nie są takie same.');
            setPasswordSuccess('');
            return;
        }

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setPasswordError('Brak tokenu autoryzacyjnego.');
                return;
            }

            const url = 'http://localhost:8080/api/users/change-password';
            const data = {
                currentPassword,
                newPassword,
            };

            const response = await axios.put(url, data, {
                headers: {
                    'x-auth-token': token,
                },
            });

            setPasswordSuccess(response.data.message);
            setPasswordError('');
            setCurrentPassword('');
            setNewPassword('');
            setConfirmNewPassword('');
        } catch (error) {
            setPasswordError(
                error.response?.data?.message || 'Błąd podczas zmiany hasła.'
            );
            setPasswordSuccess('');
        }
    };

    const handleCurrentPasswordChange = (e) => setCurrentPassword(e.target.value);
    const handleNewPasswordChange = (e) => setNewPassword(e.target.value);
    const handleConfirmNewPasswordChange = (e) =>
        setConfirmNewPassword(e.target.value);

    return (
        <div className="container mt-5">
            <h1 className="mb-4 text-center">Mój profil</h1>
            <div className="row justify-content-center">
                <div className="col-md-10">
                    <div className="card shadow-lg mb-4">
                        <div className="card-body">
                            <div className="row">
                                <ProfilePicture
                                    user={user}
                                    isEditing={isEditing}
                                    handleProfilePictureUpload={handleProfilePictureUpload}
                                />
                                <div className="card shadow-sm mb-4">
                            </div>
                                <div className="mt-4"></div>
                                <PersonalDataForm
                                    user={user}
                                    formData={formData}
                                    isEditing={isEditing}
                                    handleChange={handleChange}
                                    handleEdit={handleEdit}
                                    handleSubmit={handleSubmit}
                                    handleDeleteAccount={handleDeleteAccount}
                                    profileSuccess={profileSuccess}
                                    profileError={profileError}
                                />
                            </div>
                        </div>
                    </div>

                    <ChangePasswordForm
                        currentPassword={currentPassword}
                        newPassword={newPassword}
                        confirmNewPassword={confirmNewPassword}
                        handleCurrentPasswordChange={handleCurrentPasswordChange}
                        handleNewPasswordChange={handleNewPasswordChange}
                        handleConfirmNewPasswordChange={handleConfirmNewPasswordChange}
                        handleSubmitPassword={handleSubmitPassword}
                        passwordSuccess={passwordSuccess}
                        passwordError={passwordError}
                    />
                </div>
            </div>
        </div>
    );
};

export default MyProfilePage;
